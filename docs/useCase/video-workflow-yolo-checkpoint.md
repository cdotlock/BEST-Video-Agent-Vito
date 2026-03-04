# Use Case: 通用视频工作流（Style Init + YOLO/Checkpoint）

## 场景
验证通用视频链路从项目创建到任务执行的完整因果关系，覆盖：

1. Project/Sequence 创建
2. 公共图库搜图 + 风格反推 + profile 保存
3. 序列绑定 style profile
4. `YOLO` 与 `Checkpoint` 两种执行模式任务提交
5. 任务事件流与资源持久化

## 前置条件

- 服务已启动（`http://localhost:8001`）
- LLM / FC / 公共图库所需环境变量已按 `.env.example` 配置
- 若首次启动，先完成 schema 初始化（`pnpm db:push`）

## 验证步骤

### 1. 创建项目

```bash
curl -v -s -X POST http://localhost:8001/api/video/projects \
  -H 'Content-Type: application/json' \
  -d '{"name":"UIUX Demo Project","description":"video workflow verification"}' \
  2>&1 | tee temp/video-workflow.1.txt
```

期望：返回 `id`（记为 `PROJECT_ID`）。

### 2. 创建序列

```bash
curl -v -s -X POST http://localhost:8001/api/video/projects/<PROJECT_ID>/sequences \
  -H 'Content-Type: application/json' \
  -d '{"sequenceKey":"SQ1","sequenceName":"Opening","sequenceContent":"开场镜头：城市清晨，慢推镜"}' \
  2>&1 | tee temp/video-workflow.2.txt
```

期望：返回序列对象，记录 `id`（记为 `SEQUENCE_ID`）和 `sequenceKey=SQ1`。

### 3. 搜索公共图库参考图

```bash
curl -v -s -X POST http://localhost:8001/api/video/style/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"clean minimal cinematic interior daylight","providers":["unsplash","pexels"],"page":1,"perPage":8}' \
  2>&1 | tee temp/video-workflow.3.txt
```

期望：

1. 返回 `items`（至少 1 条）
2. `providers` 中有每个 provider 的状态与数量
3. 每条 item 包含 `source/sourceId/imageUrl`

### 4. 反推风格并保存 profile

从步骤 3 选取 1-3 张参考图填入 `references`。

```bash
curl -v -s -X POST http://localhost:8001/api/video/style/reverse \
  -H 'Content-Type: application/json' \
  -d '{
    "projectId":"<PROJECT_ID>",
    "memoryUser":"demo-user",
    "sequenceKey":"SQ1",
    "profileName":"clean_minimal_v1",
    "query":"clean minimal cinematic interior daylight",
    "creativeGoal":"品牌宣传视频开场",
    "references":[
      {
        "source":"unsplash",
        "sourceId":"example-1",
        "imageUrl":"https://images.unsplash.com/photo-1",
        "tags":["clean","minimal"]
      }
    ],
    "saveProfile":true
  }' \
  2>&1 | tee temp/video-workflow.4.txt
```

期望：

1. 返回 `styleTokens/positivePrompt/negativePrompt`
2. `profile` 非空且包含 `id`（记为 `PROFILE_ID`）

### 5. 将 profile 绑定到序列

```bash
curl -v -s -X PATCH http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/style-profile \
  -H 'Content-Type: application/json' \
  -d '{
    "projectId":"<PROJECT_ID>",
    "sequenceKey":"SQ1",
    "profileId":"<PROFILE_ID>",
    "memoryUser":"demo-user"
  }' \
  2>&1 | tee temp/video-workflow.5.txt
```

期望：返回绑定成功结果，后续任务上下文会注入 active style profile。

### 6. 提交 YOLO 任务

```bash
curl -v -s -X POST http://localhost:8001/api/video/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "message":"请基于当前序列直接自动推进，生成分镜图和视频提示词",
    "user":"video:<PROJECT_ID>:SQ1",
    "memory_user":"demo-user",
    "execution_mode":"yolo",
    "video_context":{"projectId":"<PROJECT_ID>","sequenceKey":"SQ1"}
  }' \
  2>&1 | tee temp/video-workflow.6.txt
```

期望：返回 `task_id`（记为 `TASK_YOLO`）和 `session_id`。

### 7. 观察 YOLO 事件流

```bash
curl -v -N http://localhost:8001/api/tasks/<TASK_YOLO>/events \
  2>&1 | tee temp/video-workflow.7.txt
```

期望：可看到 `session/delta/tool/tool_start/tool_end/done` 事件；YOLO 不应出现中间确认阻塞。

### 8. 提交 Checkpoint 任务

```bash
curl -v -s -X POST http://localhost:8001/api/video/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "message":"继续下一阶段，但在关键高成本动作前先确认",
    "session_id":"<步骤 6 的 session_id>",
    "user":"video:<PROJECT_ID>:SQ1",
    "memory_user":"demo-user",
    "execution_mode":"checkpoint",
    "video_context":{"projectId":"<PROJECT_ID>","sequenceKey":"SQ1"}
  }' \
  2>&1 | tee temp/video-workflow.8.txt
```

期望：返回新的 `task_id`（记为 `TASK_CHECKPOINT`），执行策略切换为 checkpoint。

### 9. 验证资源持久化

```bash
curl -v -s "http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/resources?projectId=<PROJECT_ID>" \
  2>&1 | tee temp/video-workflow.9.txt
```

期望：返回 `categories`，能看到已落库素材（image/video/json）及其分组。

### 10. 验证路径推荐（长期记忆）

```bash
curl -v -s "http://localhost:8001/api/video/memory/path-recommendations?memoryUser=demo-user&goal=%E9%9C%80%E8%A6%81%E4%B9%9D%E5%AE%AB%E6%A0%BC%E5%88%86%E9%95%9C%E5%B9%B6%E6%9C%80%E7%BB%88%E6%8B%BC%E6%8E%A5&storyboardDensity=grid_3x3&wantsMultiClip=true" \
  2>&1 | tee temp/video-workflow.10.txt
```

期望：返回 `recommendations`，包含路径 id、score 与原因（why）。

### 11. 记录路径评审写回记忆

从步骤 10 返回的推荐路径里选 1 条作为 `pathId`。

```bash
curl -v -s -X POST http://localhost:8001/api/video/memory/path-review \
  -H 'Content-Type: application/json' \
  -d '{
    "memoryUser":"demo-user",
    "projectId":"<PROJECT_ID>",
    "sequenceKey":"SQ1",
    "pathId":"path.multi_clip_compose",
    "score":1,
    "note":"adopted in usecase"
  }' \
  2>&1 | tee temp/video-workflow.11.txt
```

期望：返回 `{ "ok": true }`，后续同用户路径推荐会体现该偏好增强。

### 12. 保存最简剪辑计划

```bash
curl -v -s -X POST http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/clip-plan \
  -H 'Content-Type: application/json' \
  -d '{
    "key":"clip_plan_demo_v1",
    "title":"clip_plan_demo_v1",
    "clips":[
      {"resourceId":null,"url":"https://example.com/a.mp4","inSec":0,"outSec":3.5,"transition":"cut","title":"clip-a"},
      {"resourceId":null,"url":"https://example.com/b.mp4","inSec":1,"outSec":4.2,"transition":"fade","title":"clip-b"}
    ]
  }' \
  2>&1 | tee temp/video-workflow.12.txt
```

期望：返回 `resourceId` 与 `totalDurationSec`，且资源列表中出现 `clip_plan` JSON 资产。

### 13. 清理（可选）

```bash
curl -v -s -X DELETE http://localhost:8001/api/video/projects/<PROJECT_ID> \
  2>&1 | tee temp/video-workflow.13.txt
```

期望：项目删除成功。
