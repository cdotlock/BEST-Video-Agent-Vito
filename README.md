# BEST Video Agent

通用视频创作工作台（Agent Native）：基于 Chat + MCP + Skills + 领域资源面板，支持项目化视频生成、风格初始化、长记忆偏好与 YOLO/Checkpoint 两种执行模式。

## 1. 本版本已实现功能（你现在可以直接用）

## 1.1 通用项目与序列模型

1. 支持创建/删除视频项目。
2. 支持在项目下创建序列（`sequenceKey` + 内容）。
3. 支持按序列加载会话与资源。

对应能力入口：

1. 页面：`/video`、`/video/[projectId]`
2. API：`/api/video/projects`、`/api/video/projects/[projectId]/sequences`

## 1.2 生成前风格初始化

1. 支持从公共图库搜索参考图（Unsplash/Pexels/Pixabay）。
2. 支持勾选参考图并反推风格 token + 正负提示词。
3. 支持保存风格档案（Style Profile）。
4. 支持将风格档案应用到当前序列。

对应 API：

1. `POST /api/video/style/search`
2. `POST /api/video/style/reverse`
3. `GET/POST /api/video/style/profiles`
4. `PATCH /api/video/sequences/[sequenceId]/style-profile`

## 1.3 执行模式（Checkpoint / YOLO）

1. 支持 `checkpoint` 模式：关键步骤可确认。
2. 支持 `yolo` 模式：自动推进，不逐步确认。
3. 模式可在工作台顶部和输入区切换。

对应 API：

1. `POST /api/video/tasks`（`execution_mode` 字段）

## 1.4 记忆与推荐（长期记忆默认可用）

1. 支持记录风格偏好反馈。
2. 支持读取风格推荐默认值（查询词、风格 token、偏好图库）。
3. 支持清理某个 `memoryUser` 的记忆数据。
4. 支持流程路径推荐（按目标与历史偏好返回 Top 路径）。
5. 支持路径评审写回（强化/抑制后续路径推荐）。

对应 API：

1. `POST /api/video/memory/feedback`
2. `GET /api/video/memory/recommendations`
3. `GET /api/video/memory/path-recommendations`
4. `POST /api/video/memory/path-review`
5. `DELETE /api/video/memory`

## 1.5 素材工作台能力

1. 资源按 category 分组展示（image/video/json）。
2. 支持资源搜索、类型筛选、删除、JSON 编辑。
3. Storyboard 视图支持快捷操作：复制 prompt、继续生成、设为风格参考。
4. Timeline 视图展示任务关键事件。
5. Clip 视图支持最简剪辑：片段排序、in/out、转场，并保存拼接计划。
6. `/video/[projectId]` 已重构为白色三栏工作台：
   - 左侧：导航菜单 + 序列/会话
   - 中间：新手引导 + 主创作视图
   - 右侧：素材分组面板

## 1.6 自进化路径能力（A2/A3）

1. `video_memory` 新增路径推荐与路径评审工具：
   - `video_memory__recommend_paths`
   - `video_memory__review_path`
2. `video_mgr` 新增分镜与拼接原子工具：
   - `video_mgr__generate_storyboard_grid`（四宫格/九宫格）
   - `video_mgr__save_clip_plan`（保存拼接方案）
3. `video_mgr__generate_video` 支持策略化输入：
   - `prompt_only`
   - `first_frame`
   - `first_last_frame`
   - `mixed_refs`
4. 图/视频生成支持“角色化参考输入”：
   - 角色：`style_ref / scene_ref / empty_shot_ref / character_ref / motion_ref`
   - 支持与 legacy `referenceImageUrls/referenceVideoUrls` 混合传入
   - 服务端合并去重后写入 `domain_resources.data` 供后续 review

## 1.7 Docker 开发启动能力

1. `docker-compose.dev.yml` 支持同时启动 `db + app`。
2. 默认 `app` 对外端口为 `8001`。
3. 健康检查已配置，启动后可直接通过浏览器访问。

## 2. 快速启动

## 2.1 前置要求

1. Docker + Docker Compose
2. Node.js 20+
3. pnpm 10+

## 2.2 环境变量

1. 使用你当前的 `.env`（你已提供完整值）。
2. 至少确保以下变量可用：

- `DATABASE_URL`
- `BUSINESS_DATABASE_URL`
- `LLM_API_KEY`
- `LLM_BASE_URL`
- `FC_GENERATE_IMAGE_URL`
- `FC_GENERATE_IMAGE_TOKEN`
- `FC_GENERATE_VIDEO_URL`
- `FC_GENERATE_VIDEO_TOKEN`
- `OSS_REGION`
- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`
- `OSS_BUCKET`
- `OSS_ENDPOINT`

## 2.3 启动命令

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

访问：

```text
http://localhost:8001
```

查看状态：

```bash
docker compose -f docker-compose.dev.yml ps
```

查看日志：

```bash
docker logs -f agent-forge-app-dev
```

停止：

```bash
docker compose -f docker-compose.dev.yml down
```

## 3. 新手使用流程（建议按这个顺序）

1. 打开 `/video`，创建一个新项目。
2. 进入项目页后，先上传一个 `.md/.txt` 序列文件。
3. 按引导卡 4 步执行：上传序列 -> 风格确认 -> 开始生成 -> 保存拼接计划。
4. 在 `Style Init` 中输入关键词搜图，勾选参考图，执行反推并应用 profile。
5. 选择 `Checkpoint` 或 `YOLO` 模式（YOLO 不做中间确认）。
6. 在聊天框发送生成指令，观察 Timeline 与 Storyboard。
7. 在 Clip 视图设置片段顺序/in-out/转场，保存拼接计划。

## 4. 主要接口入参示例

## 4.1 创建项目

```json
{
  "name": "Brand Launch Video",
  "description": "Q2 campaign"
}
```

## 4.2 创建序列

```json
{
  "sequenceKey": "SQ1",
  "sequenceName": "Opening",
  "sequenceContent": "A calm sunrise over modern city skyline"
}
```

## 4.3 发起视频任务

```json
{
  "message": "请先生成这个序列的关键画面提示词",
  "memory_user": "default",
  "execution_mode": "checkpoint",
  "video_context": {
    "projectId": "<projectId>",
    "sequenceKey": "SQ1"
  }
}
```

## 5. 当前版本边界说明

1. 本版本核心可用路径是 `/video` 工作台。
2. 风格搜索依赖公共图库 key；未配置时会返回空结果或 provider 错误状态。
3. 图片/视频生成能力依赖 FC 服务与 OSS 配置。
4. 模型可用性取决于 `LLM_BASE_URL` 与 `LLM_API_KEY` 实际配额状态。

## 6. 文档索引

1. 产品需求：`docs/PRD.md`
2. UIUX 重构方案：`docs/UIUX.md`
3. 接口时序与验证：`docs/api-playbook.md`
4. 用例验证：`docs/useCase/`
