# API Playbook

给 AI agent 的操作手册。记录接口之间的因果关系和调用次序——这些信息无法从代码推断。

> 验证系统状态时使用 `curl http://localhost:8001/...`

## 多轮对话约定

服务端通过 `session_id` 维护会话状态，对话历史持久化在 DB（`ChatSession` + `ChatMessage`）。

- 首次请求不传 `session_id`，服务端自动创建新 session 并在响应中返回 `session_id`
- 后续请求携带 `session_id` 即可延续上下文，服务端从 DB 加载历史消息
- 进程重启不丢失会话

### 调试日志

请求 body 传 `"logs": true`，服务端会将当前 session 完整消息写入 `temp/chat-{sessionId}.{timestamp}.json`。
`temp/` 已 gitignore，不会提交。

## 启动依赖

MCP 初始化是 **惰性** 的——首次 API 请求触发 `initMcp()`。
初始化顺序：

1. 注册 core static providers（`skills`, `mcp_manager`, `ui`, `memory`）
2. 注册系统依赖 provider（`subagent`）
3. 业务 providers（`video_mgr`, `style_search`, `oss`, `biz_db` 等）按需加载（catalog 或 mcp_manager）

因此：刚启动后第一次请求会较慢（冷启动）。

## 时序依赖（因果链）

### Skill → Agent
1. `POST /api/skills` 创建 skill
2. 下一次 `POST /api/chat` 时，`buildSystemPrompt()` 重新查 DB，新 skill 出现在 system prompt 的 Available Skills 索引中
3. Agent 通过 `skills__get` tool 按需读取全文（progressive disclosure）

**因果**：skill 不存在 → agent 不知道它 → 不会使用。

### Dynamic MCP → Agent
1. `POST /api/mcps` 创建 MCP server（`enabled: true`）
2. service 立即执行：DB 写入 → sandbox 加载 JS 代码 → `registry.replace()` 注册 provider
3. 下一次 agent tool-use loop 时，`registry.listAllTools(context)` 在“当前会话可见 + 允许白名单”范围内返回 tools
4. Agent 仅能调用当前上下文允许的 MCP tools（不在可见/白名单内会被拒绝）

**因果**：dynamic MCP 必须 create 且 sandbox load 成功，且被当前会话显式加载并通过白名单策略，tools 才在 agent 可用。`loadError` 非空说明沙盒加载失败，tools 不可用。

### Agent Chat 完整链路
`POST /api/chat` → `runAgent()`:
1. `initMcp()`（首次）
2. `getOrCreateSession(session_id)` — 从 DB 加载/创建 session 及历史消息
3. `buildSystemPrompt()` — 查 DB 注入 skill 索引
4. `registry.listAllTools(context)` — 收集当前上下文可见的 provider tools
5. LLM 调用（OpenAI format，历史消息 + 当前 user message）
6. 若 LLM 返回 `tool_calls` → `registry.callTool()` 执行 → 结果追加到 messages → 回到步骤 5
7. 若 LLM 返回纯文本 → `pushMessages()` 持久化本轮所有新消息到 DB → 返回最终 reply
8. 若请求传了 `logs=true` → 写 `temp/chat-{sessionId}.{timestamp}.json`

### Agent Chat Streaming (deprecated)
`POST /api/chat/stream` 仍可用，但前端已迁移到 Task 架构。

### Task 后端驱动架构
Task 解耦了任务执行与前端连接。agent loop 在后端独立运行，客户端通过 SSE 观察。

**提交任务**：
```
curl -X POST http://localhost:8001/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"message": "hello", "user": "test"}'
# → { "task_id": "...", "session_id": "..." }
```
返回后任务已在后端开始执行。

若未配置 `LLM_API_KEY`，`/api/tasks` 和 `/api/video/tasks` 会直接返回 `503`（fail-fast），不会创建 task 记录。

**观察事件流**：
```
curl -N http://localhost:8001/api/tasks/{task_id}/events
```
SSE 事件类型：
- `event: session` → `{ session_id }`
- `event: delta` → `{ text }`（assistant 增量文本）
- `event: tool` → `{ summary }`（工具/skill 摘要）
- `event: upload_request` → 上传请求
- `event: key_resource` → 关键资源
- `event: done` → `{ session_id, reply }`
- `event: error` → `{ error }`

每个事件带有单调递增 `id:` 字段。断线重连时，服务端通过 `Last-Event-ID` header 从 DB 重放遗漏事件，确保不丢失。

**查询任务状态**：
```
curl http://localhost:8001/api/tasks/{task_id}
# → { "id", "sessionId", "status", "reply", "error", ... }
# status: pending | running | completed | failed | cancelled
```

**取消任务**：
```
curl -X POST http://localhost:8001/api/tasks/{task_id}/cancel
```

**重连流程**：
1. `GET /api/sessions/{sid}` → 响应包含 `activeTask: { id, status }` （若有活跃任务）
2. 前端加载 session 时，发现 activeTask → 自动连接 `GET /api/tasks/{taskId}/events`
3. EventSource 断线时浏览器自动重连，携带 `Last-Event-ID`

**因果**：Task 状态和事件持久化到 DB，客户端断开不影响执行，重连后从断点继续。

### Video Task 模式控制（Checkpoint / YOLO）

`POST /api/video/tasks` 支持 `execution_mode`：

- `checkpoint`（默认）— 审慎推进偏好（上下文注入）
- `yolo` — 自动推进偏好（上下文注入）

请求示例：
```
curl -X POST http://localhost:8001/api/video/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "开始生成",
    "user": "video:demo:SQ1",
    "memory_user": "default",
    "execution_mode": "yolo",
    "video_context": { "projectId": "demo", "sequenceKey": "SQ1" }
  }'
```

**因果**：
- `execution_mode` 写入 `VideoContextProvider`，作为偏好上下文，不触发前端硬编码确认流程
- 当 `execution_mode=checkpoint` 且 `pro_config.checkpointAlignmentRequired=true` 时，首轮会先进行画风/工作流/分镜对齐，再进入生成
- `memory_user` 默认开启长期记忆，并在上下文中注入历史风格偏好
- `/api/video/tasks` 会使用受控白名单（核心视频 MCP + `mcp_manager/subagent` + 受控 skills），支持在 Chat 中进行工作流客制化
- 未配置 `LLM_API_KEY` 时该接口返回 `503`，避免创建必然失败的异步任务

`POST /api/video/tasks` 还支持可选 `pro_config`：

- `customKnowledge`
- `workflowTemplate`
- `checkpointAlignmentRequired`
- `enableSelfReview`

**因果**：灵动岛展开态中的 `Pro` 配置会作为隐藏上下文注入，影响路径选择与执行策略。

当前前端落地约定：

- Pro 固定收进灵动岛展开态，并分为 `Knowledge / Workflow / Strategy / Memory / Capabilities`
- `Memory` tab 会读取 `/api/video/memory/recommendations` 与 `/api/video/memory/path-recommendations`
- `Capabilities` 仅展示已绑定的 MCP / Skill 叠层，不直接暴露源码编辑

### Chat 上下文挂载（@素材与风格参考）

`POST /api/video/tasks` 额外支持：

- `context_resource_ids: string[]`：用户通过 `@该素材` 挂载的上下文资源 ID（仅注入上下文，不自动发指令）
- `style_reference_resource_ids: string[]`：用户选定的风格参考图资源 ID（隐式注入生图参考）

**因果**：
- 这两类字段只影响系统上下文注入，不会额外生成一条用户消息；
- 风格参考会在内部提示中约束 `video_mgr__generate_image` 合并 `referenceImageUrls/references(role=style_ref)`；
- 该隐式机制不向终端用户文案暴露。

### 默认会话回填（按 project+sequence）

前端在选定 sequence 后，会以 `user=video:{projectId}:{sequenceKey}` 调用：

1. `GET /api/sessions?user=...` 获取会话列表（按 `updatedAt desc`）
2. 若存在历史会话，默认加载第一条（最近会话）
3. 用户点击“新会话”后，当前 sequence 下不再自动回填旧会话，直到切换 sequence 或刷新页面

**因果**：保持“默认接续上下文”与“手动开新线程”并存，避免误回到旧对话。

### Project → Sequence → Task（通用视频链路）

1. `POST /api/video/projects` 创建项目（返回 `id`）
2. `POST /api/video/projects/{projectId}/sequences` 创建序列（返回 `id`）
3. `POST /api/video/style/search` 搜索参考图（可选但推荐）
4. `POST /api/video/style/reverse` 反推风格并保存 profile（可选但推荐）
5. `POST /api/video/tasks` 提交任务（`video_context` 传 `projectId + sequenceKey`）
6. `GET /api/video/sequences/{sequenceId}/resources?projectId=...` 拉取素材

**因果**：sequence 是任务上下文和资源聚合的最小工作单元；project 级资源与 sequence 级资源在读取时合并展示。

### 素材写回稳定性校验（2026-03 更新）

前端刷新链路必须同时覆盖：

1. SSE `tool_end` 事件（常规刷新）
2. SSE `key_resource` 事件（图片写回即时刷新）
3. SSE `stream_end` 事件（兜底刷新）

验证方法：

1. 提交一次 `generate_image` 或 `generate_video` 任务。
2. 观察任务流结束后 2 秒内，`GET /api/video/sequences/{sequenceId}/resources?projectId=...` 返回中出现新增资源。
3. 若任务成功但素材列表无新增，优先检查事件流是否收到 `key_resource`/`stream_end`，再排查 DB 写入。

### Style 初始化链路（公共图库）

1. `POST /api/video/style/search`：
   - 输入 `query + providers`
   - 输出跨图库聚合后的候选参考图（带 `source/license/tags`）
2. `POST /api/video/style/reverse`：
   - 输入选中的 `references` + `memoryUser`
   - 输出 `styleTokens + positive/negative prompt + analysis`
   - 默认 `saveProfile=true`，直接持久化为可复用 `StyleProfile`
3. `GET /api/video/style/profiles?projectId=...`：
   - 读取 project 级 + global 风格档案

**因果**：风格档案持久化后，可跨会话复用；YOLO 模式下可直接自动推进到生成阶段，Checkpoint 模式可先确认再生成。

### Sequence 绑定风格档案（运行时 Style Layer）

1. `PATCH /api/video/sequences/{sequenceId}/style-profile`：
   - 输入 `{ projectId, sequenceKey, profileId|null, memoryUser? }`
   - 将序列绑定到指定 `StyleProfile`（或清空）
2. `POST /api/video/tasks`：
   - `VideoContextProvider` 在上下文中自动注入四层 Prompt 组装提示
   - 若序列已绑定 profile，自动注入：
     - `style_tokens`
     - `positive_prompt`
     - `negative_prompt`
     - `active_style_profile_id`

**因果**：绑定后，无需每轮重复手工粘贴风格 prompt；后续生成默认走 `Base / Style / Content / Task` 四层组装。

### 分镜网格与最简剪辑计划

1. 通过 MCP `video_mgr__generate_storyboard_grid`：
   - 输入 `layout=grid_2x2|grid_3x3` + cell prompts
   - 生成 cell 图片并持久化网格计划 JSON
2. `POST /api/video/sequences/{sequenceId}/clip-plan`：
   - 最简输入：片段列表（顺序/in/out/transition）
   - `transition` 当前支持：`none | cut | fade | dissolve | wipe_left | fade_black`
   - 扩展输入：`saveMode=manual|autosave` + `editorState`
   - clip 级额外字段：`audioEnabled / audioVolume`
   - 顶层额外字段：`audioTracks[]`（`startSec/sourceInSec/sourceOutSec/volume/muted`）
   - 保存 `timeline_v2` clip plan 到 `domain_resources`（mediaType=json）
3. Clip Studio 前端进入编辑态时：
   - 会按当前视频候选资源的顺序初始化时间线主舞台
   - 可一键触发 `AI 自动粗剪`，自动生成粗剪序列并落入时间线（用户仍可继续手调后保存）
   - 时间线时长按真实节目时长计算：视频片段会扣除转场重叠，尾部音频轨会继续推长总时长
   - 右侧 Asset Atlas 继续独立显示，不在剪辑器内部复制左侧资产栏
4. `POST /api/video/sequences/{sequenceId}/clip-plan/export`
   - 输入当前 clip plan（`clips + audioTracks`）
   - 服务端用 `ffmpeg/ffprobe` 拼接视频、应用转场、混合片段原声与简单音频轨
   - 返回 `video/mp4` 二进制流供前端直接下载

`editorState` 当前包含：

- `selectedClipId / selectedSourceResourceId`
- `sourceInSec / sourceOutSec / sourceDurationSec`
- `previewMode=source|program`
- `timelineZoom / snapEnabled / snapStepSec`

**因果**：网格分镜和 clip plan 均是持久化中间资产；Clip Studio 依赖 `timeline_v2 + audioTracks + editorState` 完成自动保存、跨会话恢复、音频编辑与手工继续编辑。前端导出前会先保存当前 plan，再调用 export route，保证下载结果与已持久化时间线一致。

### Asset Atlas 语义动作

右侧 Asset Atlas 的快捷动作不是纯前端局部状态：

1. `用于当前镜头起始帧 / 用于当前镜头结束帧`
   - 前端通过 `onInjectMessage` 注入上下文化指令，显式告诉 Agent 该图片服务的是当前镜头起点或终点
   - 起始帧指令会显式强调优先 `first_frame`，只有在结尾落点也明确时才允许走 `first_last_frame`
2. `角色锚点 / 空镜锚点`
   - 前端调用 `PATCH /api/video/sequences/{sequenceId}/resources`
   - 将 `domain_resources.data.semanticRole` 更新为对应角色
3. 下次 `POST /api/video/tasks`
   - `VideoContextProvider -> Prompt Compiler` 会重新读取资源语义
   - `workflow_graph / task_intent / hidden_ops` 自动抬高对应路径，同时保持 `first_frame` 与 `first_last_frame` 的策略边界
4. `加入时间线`
   - 先在前端把资源送入 Clip Studio 时间线
   - 只有保存 clip plan 后，才会持久化为新的 `clip_plan` 资产

**因果**：长期语义锚点仍然会被持久化 recall；而当前镜头的起始帧/结束帧则走上下文化注入，避免“看不见 slot”导致的误用。

### Clip Studio 主动记忆写回

当用户在 Clip Studio 里手动保存时：

1. `POST /api/video/sequences/{sequenceId}/clip-plan`
   - 持久化 `timeline_v2 + audioTracks + editorState`
2. 前端 best-effort 追加：
   - `POST /api/video/memory/path-review`
   - `POST /api/video/memory/feedback`
3. 写回内容至少包含：
   - `path.multi_clip_compose`
   - `editingHints`
   - `cameraHints`
   - `modelIds`

**因果**：高级用户的粗剪行为会反过来影响后续路径推荐和 Prompt Compiler 的 `user_memory` 组装。

### 对白脚本资产

MCP `video_mgr` 新增 `video_mgr__save_dialogue_script`：

- 输入：结构化台词条目（角色、台词、情绪、时长建议）
- 输出：`domain_resources` 中 `mediaType=json`、`data.type=dialogue_script` 的持久化资源

前端与 REST 链路：

1. `POST /api/video/sequences/{sequenceId}/dialogue-script`
   - 输入：`projectId + sequenceKey + title? + force?`
   - 默认行为：若当前 sequence 已存在 `dialogue_script_current`，直接复用
   - `force=true` 时重新基于剧情与当前素材摘要生成一份新草稿
2. 项目页选中 sequence 后：
   - 若当前序列存在剧情线索且还没有 `dialogue_ref`
   - 前端会自动调用一次上述接口，补一份默认对白脚本 JSON
3. 灵动岛中的“生成台词稿”动作与自动补全共用同一接口，只是显式触发时会走 `force=true`

`video_mgr__generate_video` 同时支持可选 `dialogueContext` 字段：

- tool 内部会把该字段合并到 runtime prompt（`hidden_dialogue_context=...`）
- 若调用方未显式传 `dialogueContext`，tool 会先 recall 当前 scope 下最近一份持久化对白脚本，再自动组装隐藏运行时对白上下文
- 生成结果会把本次使用的 `dialogueContext` 快照一并写回视频资源 `data`
- 用户可见 prompt 保持创作描述层，不暴露隐藏注入细节

**因果**：对白脚本是独立可确认的 JSON 资产，但视频生成阶段会自动 recall 并注入运行时 prompt；因此用户可以单独确认台词，同时不需要每次手工把对白再粘回生成提示词。

### 参考角色化（图/视频混合参考）

1. MCP `video_mgr__generate_image` 支持两类参考入参：
   - 兼容字段：`referenceImageUrls[]`
   - 角色化字段：`references[]`（`style_ref/scene_ref/empty_shot_ref/character_ref/motion_ref`）
2. MCP `video_mgr__generate_video` 支持：
   - 策略：`prompt_only/first_frame/first_last_frame/mixed_refs`
   - 兼容字段：`referenceImageUrls[] + referenceVideoUrls[]`
   - 角色化字段：`references[]`（含 `mediaType=image|video`）
3. 服务端会合并并去重参考链接，将快照写入 `domain_resources.data`，用于后续 review/复用。
4. 若当前任务处于视频工作台上下文，`video_mgr__generate_image / generate_video / generate_storyboard_grid` 还会自动注入：
   - 动画短片导演级 runtime prompt（单镜头/单动作主线、分镜可读性、角色一致性、连续性锚点）
   - 当前 sequence 的 style refs / active style profile references（自动并入 image refs）
5. `video_mgr` 各落库工具支持 scope 自动推断：若缺失 `scopeType/scopeId`，会根据 `user=video:{projectId}:{sequenceKey}` 自动回填当前 sequence scope；若误传 `scopeId=sequenceKey`，会自动纠正为真实 `sequenceId`。

**因果**：同一条生成记录既保留历史兼容字段，也保留角色语义；同时 provider 会在最终执行前自动补齐导演级约束和 style refs，降低“LLM 漏拼 prompt”对最终效果的伤害。

### domain_resources.data 结构升级（v2 envelope）

从 2026-03 起，`domain_resources.data` 统一写入版本化 envelope：

- `__af_resource_data_v=2`
- `encoding=utf-8`
- `payloadType`
- `payload`

读取链路兼容旧数据：

1. 若为 envelope，自动解包 `payload`
2. 若为历史双重 JSON 字符串，自动最多 3 层解包

**因果**：减少素材 JSON 乱码/转义串显示问题，并保证存储结构可演进。

### 长期记忆（默认开启）

1. `GET /api/video/memory/recommendations?memoryUser=...`：
   - 返回长期偏好推荐（style tokens / providers / prompt hints）
   - 同时返回 `preferredEditingHints / preferredCameraHints / preferredModelIds / rejectedWorkflowPaths`
2. `POST /api/video/memory/optimize-prompt`：
   - 输入 `memoryUser + prompt (+ mode)`
   - 用长期记忆自动优化 prompt，并补入 image/video 的导演约束，再默认记录 `prompt_optimized` 事件
3. `GET /api/video/memory/path-recommendations`：
   - 输入 `memoryUser` + 可选目标信息（`goal/storyboardDensity/hasImageReference/hasReferenceVideo/hasFirstFrameReference/hasLastFrameReference/wantsMultiClip/prefersCharacterPriority/prefersEmptyShotPriority`）
   - 返回 Top 路径推荐与原因
4. `POST /api/video/memory/path-review`：
   - 输入 `pathId + score`
   - 记录路径评审并写回长期记忆（`workflow_path_review`）
5. `POST /api/video/memory/feedback`：
   - 写入偏好事件（`style_profile_saved` / `style_profile_applied` / `generation_feedback` / `manual_feedback` / `prompt_optimized` / `workflow_path_review`）
   - 可附带 `rejectedWorkflowPaths / editingHints / cameraHints / modelIds`
6. `DELETE /api/video/memory`：
   - 按 `memoryUser` 清空长期记忆

**因果**：初始化、风格应用和生成阶段都可读写同一 memory user 的偏好；使用次数越多，默认参数越贴近用户风格。

## 双入口等价性

REST API (`/api/*`) 和 MCP tools（agent 内部 / `/mcp` 外部）**共享同一 service layer**。
通过任一入口的变更，对另一入口**立即可见**。

示例：通过 `curl POST /api/skills` 创建的 skill，agent 下一轮 chat 即可使用。

## Use Cases

Chat 是用户核心入口，验证 chat 即验证 MCP 注册、skill 加载、tool dispatch 全链路。
具体验证步骤见 `docs/useCase/`：

- `llm-chat-create-skill.md` — 通过 chat 创建 skill，验证全链路（LLM 连通 → tool 调用 → DB 持久化 → system prompt 注入）
- `llm-chat-create-mcp.md` — 通过 chat 创建 dynamic MCP，验证全链路（skill 指导 → 沙箱代码编写 → sandbox load → tool 注册 → 端到端调用）
- `chat-with-title.md` — 发起会话 + 并行生成 title，验证 title 生成、持久化、列表可见
- `session-crud.md` — Session 完整生命周期（创建、列出、查看、改名、删除）+ 用户隔离验证
- `video-workflow-yolo-checkpoint.md` — 通用视频链路（项目/序列、Style Init、YOLO/Checkpoint、事件流、资源持久化）

## Tool 命名规则

Agent 内部的 tool name 格式为 `{provider}__{tool}`。具体有哪些 tool 以运行时 `registry.listAllTools()` 为准，不在文档中维护列表。

## 测试原则

- **偏差优先矫正文档** — 当基于文档的测试结果与代码实际行为不一致时，优先假设文档未及时更新，矫正文档使其与代码行为对齐，而非修改代码适配文档。
- **前后端契约审查** — 如前端已实现对应功能，测试时应同时验证前端调用与后端 API 的请求/响应契约是否匹配（字段名、类型、必填/可选）。
- **保留完整报文** — 测试时 curl 命令必须使用 `-v` 并将完整请求/响应（含 headers 和 body）存入 `temp/`，文件命名 `{功能}.{序号}.txt`（如 `skill-create.1.txt`）。便于事后回溯和对比。`temp/` 已 gitignore，不会提交。
