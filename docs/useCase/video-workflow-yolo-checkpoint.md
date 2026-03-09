# Use Case: 通用视频工作流（Style Init + YOLO/Checkpoint）

## 场景
验证通用视频链路从项目创建到任务执行的完整因果关系，覆盖：

1. Project/Sequence 创建
2. 公共图库搜图 + 风格反推 + profile 保存
3. 序列绑定 style profile
4. `YOLO` 与 `Checkpoint` 两种执行模式任务提交
5. Asset Atlas 语义动作与 Clip Studio 持久化
6. 长期记忆路径推荐与主动写回

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

### 6. 新手一句话启动（Checkpoint 首轮对齐）

```bash
curl -v -s -X POST http://localhost:8001/api/video/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "message":"我想做一个 iPhone 宣传片开场，先帮我对齐方向。",
    "user":"video:<PROJECT_ID>:SQ1",
    "memory_user":"demo-user",
    "execution_mode":"checkpoint",
    "video_context":{"projectId":"<PROJECT_ID>","sequenceKey":"SQ1"},
    "pro_config":{"checkpointAlignmentRequired":true,"enableSelfReview":true}
  }' \
  2>&1 | tee temp/video-workflow.6.txt
```

期望：返回 `task_id`（记为 `TASK_CHECKPOINT`）和 `session_id`。

### 7. 观察 Checkpoint 事件流

```bash
curl -v -N http://localhost:8001/api/tasks/<TASK_CHECKPOINT>/events \
  2>&1 | tee temp/video-workflow.7.txt
```

期望：

1. 可看到 `session/delta/.../done` 事件
2. 最终回复含 `### alignment_block` 和 `### plan_block`
3. 回复会显式提到当前路径、分镜密度和最终交付物，而不是直接开工生成

### 8. 可选：提交 YOLO 任务

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
  2>&1 | tee temp/video-workflow.8.txt
```

期望：返回新的 `task_id`；YOLO 模式不会强制首轮确认，可连续推进。

### 9. 验证资源持久化

```bash
curl -v -s "http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/resources?projectId=<PROJECT_ID>" \
  2>&1 | tee temp/video-workflow.9.txt
```

期望：返回 `categories`，能看到已落库素材（image/video/json）及其分组。

### 10. 验证路径推荐（长期记忆）

```bash
curl -v -s "http://localhost:8001/api/video/memory/path-recommendations?memoryUser=demo-user&goal=%E9%9C%80%E8%A6%81%E4%B9%9D%E5%AE%AB%E6%A0%BC%E5%88%86%E9%95%9C%E5%B9%B6%E6%9C%80%E7%BB%88%E6%8B%BC%E6%8E%A5&storyboardDensity=grid_3x3&wantsMultiClip=true&hasImageReference=true&hasFirstFrameReference=true" \
  2>&1 | tee temp/video-workflow.10.txt
```

期望：返回 `recommendations`，包含路径 id、score 与原因（why）；当传入 `hasFirstFrameReference=true`、`prefersCharacterPriority=true`、`prefersEmptyShotPriority=true` 等信号时，推荐结果应明显偏向对应路径。

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

### 12. 保存最简剪辑计划（timeline_v2）

```bash
curl -v -s -X POST http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/clip-plan \
  -H 'Content-Type: application/json' \
  -d '{
    "key":"clip_plan_demo_v1",
    "title":"clip_plan_demo_v1",
    "saveMode":"manual",
    "clips":[
      {"id":"clip-a","resourceId":null,"url":"https://example.com/a.mp4","inSec":0,"outSec":3.5,"transition":"cut","title":"clip-a","sourceDurationSec":6,"audioEnabled":true,"audioVolume":100},
      {"id":"clip-b","resourceId":null,"url":"https://example.com/b.mp4","inSec":1,"outSec":4.2,"transition":"fade","title":"clip-b","sourceDurationSec":8,"audioEnabled":true,"audioVolume":80}
    ],
    "audioTracks":[
      {"id":"bgm-1","title":"bgm","url":"https://example.com/bgm.mp3","startSec":0,"sourceInSec":0,"sourceOutSec":6,"sourceDurationSec":12,"volume":70,"muted":false}
    ],
    "editorState":{
      "selectedClipId":"clip-b",
      "selectedSourceResourceId":null,
      "sourceInSec":1,
      "sourceOutSec":4.2,
      "sourceDurationSec":8,
      "previewMode":"program",
      "timelineZoom":20,
      "snapEnabled":true,
      "snapStepSec":0.25
    }
  }' \
  2>&1 | tee temp/video-workflow.12.txt
```

期望：返回 `resourceId` 与 `totalDurationSec`，且资源列表中出现 `format=timeline_v2`、`saveMode=manual` 的 `clip_plan` JSON 资产。

### 12.1 导出时间线成视频

```bash
curl -v -X POST http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/clip-plan/export \
  -H 'Content-Type: application/json' \
  -d '{
    "planName":"clip_plan_demo_v1",
    "clips":[
      {"id":"clip-a","resourceId":null,"url":"https://example.com/a.mp4","inSec":0,"outSec":3.5,"transition":"cut","title":"clip-a","sourceDurationSec":6,"audioEnabled":true,"audioVolume":100},
      {"id":"clip-b","resourceId":null,"url":"https://example.com/b.mp4","inSec":1,"outSec":4.2,"transition":"fade","title":"clip-b","sourceDurationSec":8,"audioEnabled":true,"audioVolume":80}
    ],
    "audioTracks":[
      {"id":"bgm-1","title":"bgm","url":"https://example.com/bgm.mp3","startSec":0,"sourceInSec":0,"sourceOutSec":6,"sourceDurationSec":12,"volume":70,"muted":false}
    ]
  }' \
  --output temp/clip-plan-demo.mp4
```

期望：返回 `200` 且输出 `video/mp4` 文件；成片里可见 `fade` 转场，且背景音频与片段原声一起混出。

### 13. Asset Atlas 语义动作写回

从步骤 9 的资源列表中选一条视频资源作为 `RESOURCE_ID`。

```bash
curl -v -s -X PATCH http://localhost:8001/api/video/sequences/<SEQUENCE_ID>/resources \
  -H 'Content-Type: application/json' \
  -d '{
    "resourceId":"<RESOURCE_ID>",
    "data":{"semanticRole":"first_frame_ref"}
  }' \
  2>&1 | tee temp/video-workflow.13.txt
```

期望：

1. 返回 `{ "ok": true }`
2. 再次读取资源列表时，该素材会显示为 `首帧` 角色
3. 后续 `Checkpoint alignment_block` 或路径推荐会显式感知首帧约束

### 14. 高手持续驯化工作流（记忆回读）

执行一次手动 clip plan 保存或直接写入反馈后，读取长期记忆：

```bash
curl -v -s "http://localhost:8001/api/video/memory/recommendations?memoryUser=demo-user" \
  2>&1 | tee temp/video-workflow.14.txt
```

期望：

1. 返回 `preferredWorkflowPaths`
2. 若发生过 clip 手动保存，返回中还应出现：
   - `preferredEditingHints`
   - `preferredCameraHints`
   - `preferredModelIds`

### 15. 清理（可选）

```bash
curl -v -s -X DELETE http://localhost:8001/api/video/projects/<PROJECT_ID> \
  2>&1 | tee temp/video-workflow.15.txt
```

期望：项目删除成功。
