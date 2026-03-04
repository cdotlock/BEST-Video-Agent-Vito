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
2. 注册系统依赖 providers（`langfuse`, `subagent`）
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

- `checkpoint`（默认）— agent 在高成本/不可逆动作前应进行简短确认
- `yolo` — agent 自动推进流程，不做中间确认阻塞

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
- `execution_mode` 会注入 agent runtime 配置，直接影响确认策略；同一接口不传时默认 `checkpoint`
- `memory_user` 默认开启长期记忆，并在上下文中注入历史风格偏好
- `/api/video/tasks` 会强制产品模式白名单（MCP: `video_mgr/style_search/video_memory` + core；skills tag: `video-core`），低频运维能力不在默认产品路径暴露
- 未配置 `LLM_API_KEY` 时该接口返回 `503`，避免创建必然失败的异步任务

### Project → Sequence → Task（通用视频链路）

1. `POST /api/video/projects` 创建项目（返回 `id`）
2. `POST /api/video/projects/{projectId}/sequences` 创建序列（返回 `id`）
3. `POST /api/video/style/search` 搜索参考图（可选但推荐）
4. `POST /api/video/style/reverse` 反推风格并保存 profile（可选但推荐）
5. `POST /api/video/tasks` 提交任务（`video_context` 传 `projectId + sequenceKey`）
6. `GET /api/video/sequences/{sequenceId}/resources?projectId=...` 拉取素材

**因果**：sequence 是任务上下文和资源聚合的最小工作单元；project 级资源与 sequence 级资源在读取时合并展示。

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

### 长期记忆（默认开启）

1. `GET /api/video/memory/recommendations?memoryUser=...`：
   - 返回长期偏好推荐（style tokens / providers / prompt hints）
2. `POST /api/video/memory/feedback`：
   - 写入偏好事件（`style_profile_saved` / `style_profile_applied` / `generation_feedback` / `manual_feedback`）
3. `DELETE /api/video/memory`：
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
