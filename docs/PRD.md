# PRD：BEST Video Agent 专业化升级

- 版本：v0.7
- 日期：2026-03-06
- 状态：Draft for Review

## 1. 产品定位

BEST Video Agent 不是“一键出 60 分成片”的流水线工具，而是一个可被持续驯化、可不断抬高上限的 `Agent Native` 视频创作系统。

它面向两类用户同时成立：

1. 新手：一句话即可启动，默认走高质量内置路径。
2. 高手：通过自然语言、素材引用、Pro 叠层配置与长期记忆，把系统逐步进化成自己的专属视频导演 Agent。

产品核心不是单一工作流，而是：

1. 用 `Skills + MCP + Memory + Domain Resources` 把能力和知识原子化。
2. 由 Agent 按任务上下文动态装配能力与知识。
3. 在执行中主动评审、主动学习、主动写回记忆。

## 2. 当前问题定义

当前版本已经“能跑”，但距离专业级工具仍有结构性差距：

1. Prompt 仍偏单段式，缺少模型适配、场景知识、参考角色映射和隐藏运行时编译。
2. 知识深度不够，对不同题材、镜头语言、对白场景、分镜组织方式的熟悉度不足。
3. Agent 决策仍偏线性，缺少真正的路径图、失败回退和阶段性 review。
4. 记忆机制仍偏被动，无法持续提炼用户的审美、习惯、禁忌和工作方式。
5. UI 已可用，但还不是专业工作台，缺少明确的导演台、资产图谱、审美统一性和高级感。
6. 剪辑台仍是“表单式粗剪”，没有形成接近专业编辑器的心智模型。

## 3. 目标

## 3.1 Must Have

1. Prompt 体系升级为可组合的 Prompt OS，而不是零散系统提示词。
2. 内置覆盖视频创作高频场景的知识包，并能按任务动态装配。
3. 工作流升级为可分支、可回退、可评审的 Workflow Graph。
4. 记忆从“可读”升级为“主动写回 + 主动调用 + 主动提炼”。
5. UI 升级为专业级导演工作台，严格基于 Ant Design 体系落地。
6. 剪辑台参考 `openreel-video` 的编辑器心智，至少形成专业粗剪能力。
7. 新手默认简单，高手可持续定制，二者共存。

## 3.2 Non-goal

1. 不改写 OpenAI chat/completions 兼容的 agent loop 基础协议。
2. 不允许普通用户直接编辑 MCP/Skill 源码。
3. 不追求首期就做到完整 NLE 或 CapCut 级全量编辑能力。

## 4. 产品原则

1. `Agent Native`：Chat 是主交互，工具只提供原子能力。
2. `Knowledge First`：上限来自 prompt 体系、知识包和记忆，不来自堆按钮。
3. `Dynamic Assembly`：上下文必须按任务动态组装，不允许把所有信息粗暴拼接。
4. `Review Before Regret`：关键阶段先 review 再继续，减少“莫名其妙开干”。
5. `Persistent Everything`：关键中间产物必须可 recall、可复用、可恢复。
6. `Novice Friendly, Expert Deep`：新手不用理解系统内部结构，高手可逐步驯化它。

## 5. 核心系统模型

## 5.1 Prompt OS

运行时 prompt 不再是单块文本，而是由以下层级动态编译：

1. `system_policy`
   - 安全、协议、持久化、MCP/Skill 约束
2. `model_pack`
   - 面向具体模型的写法与限制
   - 例如：图生视频、首尾帧、对白约束、时长约束、参考图数量限制
3. `domain_pack`
   - 视频创作领域知识
   - 包括镜头语言、分镜节奏、场景空镜、角色立绘、对白脚本、粗剪原则
4. `project_canon`
   - 当前项目世界观、角色设定、主风格、既有成果
5. `sequence_state`
   - 当前工作域已产出的分镜、素材、剪辑计划、脚本
6. `asset_role_pack`
   - 将素材按角色注入，而不是一律视作“参考图”
7. `user_memory`
   - 用户长期偏好、禁忌、常用路径、历史成功模式
8. `task_intent`
   - 当前这一轮任务目标、交付物、约束、执行模式
9. `hidden_ops`
   - 不暴露给用户的运行时编排信息，例如风格参考图注入、对话脚本注入、scope 归一化

Prompt Compiler 必须产出两类结果：

1. 面向用户的可解释计划
2. 面向模型的隐藏运行时 prompt

两者必须解耦，避免用户文案和真实执行 prompt 相互污染。

当前实现约定：

1. 运行时由 `VideoContextProvider -> Prompt Compiler` 产出编译快照
2. 编译层至少包含 `model_pack / domain_pack / project_canon / asset_roles / user_memory / task_intent / hidden_ops`
3. 同时输出 `Public Response Contract`，约束 Agent 以结构化导演台消息响应，而不是散乱长文
4. 已附加 `workflow_graph` 快照，用于向模型注入当前节点、候选路径与 review rubric
5. `domain_pack + task_intent + workflow_graph` 已显式覆盖：分镜密度、首帧/首尾帧、mixed refs、角色优先、空镜优先、对白脚本、粗剪节奏与模型约束

## 5.2 领域知识包

知识不再内嵌在少数大 prompt 中，而要拆成可组合知识包：

1. 场景包：室内、街景、夜戏、雨戏、群像、空镜、情绪场
2. 镜头包：远景、中景、近景、特写、跟拍、推拉摇移、定镜
3. 分镜包：单图、四宫格、九宫格、多候选 storyboard
4. 角色包：立绘、表情、服装、姿态连续性
5. 运动包：首帧、首尾帧、图视频混参、动作连续性
6. 对白包：台词脚本、口型风险、镜头调度与对白承载
7. 剪辑包：节奏、转场、蒙太奇、选段策略、粗剪串联
8. 模型包：面向 nanobanana、视频模型等不同生成能力的适配层
9. Review 包：何时补分镜、何时换路径、何时要求确认、何时自动推进

## 5.3 Workflow Graph v2

工作流从线性步骤升级为图结构。每个节点包含：

1. 节点目标
2. 必要输入
3. 可选输入
4. 可用工具
5. 成功判据
6. 失败回退
7. review gate

系统必须内置高价值路径原子：

1. 风格初始化
2. 单图分镜
3. 四宫格分镜
4. 九宫格分镜
5. 角色立绘生成
6. 场景空镜生成
7. 首帧图生视频
8. 首尾帧图生视频
9. 图/视频混合参考视频生成
10. 台词脚本生成与注入
11. 多候选视频筛选
12. 粗剪与导出

Agent 必须根据上下文自由组合，而不是只会跑一条预设链。

## 5.4 Review 机制

系统需要三层 review：

1. `alignment review`
   - 在 checkpoint 模式下，首轮先对齐画风、工作流、分镜密度、对白需求、最终交付目标
2. `mid review`
   - 在关键阶段判断是否补素材、补分镜、改策略、加多候选
3. `final review`
   - 在导出前检查风格统一、叙事连续、镜头冗余、剪辑节奏

Review 结论要么：

1. 转成给用户的确认问题
2. 转成系统内部下一步调整
3. 写回记忆作为未来偏好

## 5.5 记忆系统

记忆至少分四层：

1. `user_memory`
   - 长期偏好、审美、禁忌、常用模型、常用工作流
2. `project_canon`
   - 当前项目世界观、角色、风格、叙事约束
3. `sequence_memory`
   - 当前工作域的阶段性策略与中间产物索引
4. `artifact_memory`
   - 每个素材的来源、用途、被引用次数、被保留/丢弃原因

主动写回触发点：

1. 用户明确偏好或否定某种结果
2. 用户主动调整 workflow
3. 某条路径被多次复用并获得正反馈
4. 某类素材被反复作为参考
5. 最终剪辑中哪些片段被保留、哪些被舍弃

当前实现约定：

1. 长期记忆已额外提炼 `preferredEditingHints / preferredCameraHints / preferredModelIds / rejectedWorkflowPaths`
2. `POST /api/video/tasks` 会把显式模型选择记为弱偏好
3. `Clip Studio` 手动保存会同时写回：
   - `path.multi_clip_compose` 路径评审
   - 剪辑偏好（例如快切 / 溶解 / 多候选）
   - 镜头语言偏好（例如特写推进 / 慢推镜）
   - 当前使用模型

## 5.6 Skills / MCP / Pro 的关系

对用户暴露的是“可定制能力”，不是源码。

1. Chat 负责表达需求与确认修改
2. Pro 负责配置知识、模板、记忆与能力叠层
3. Agent 负责把这些变化映射到 Skill / MCP / hidden context

允许的高级能力：

1. 新增或修改工作流模板
2. 增减知识叠层
3. 管理记忆用户和记忆清理
4. 调整 review 策略
5. 调整默认模型策略

不要求用户直接碰代码或 JSON 协议。

当前实现约定：

1. 项目页主舞台顶部新增 `灵动岛（Dynamic Island）`，默认是单条动态状态岛，显式展示运行态、路径轨道、当前 cue、缺口提示与关键进度
2. `灵动岛` 展开后同时承载运行监控、导演编排与 `Pro` 叠层，不再把 `Pro` 作为独立重复入口悬挂在顶栏
3. `Pro` 新增 `Atelier` 层，把分镜密度、参考路线、角色/空镜/对白/粗剪策略转成导演蓝图
4. `Capabilities + 灵动岛 + Atelier` 三层共同承担“高上限但不暴露源码”的交互边界

## 5.7 资产系统

右侧资产区不仅展示文件，更是结构化上下文图谱。

资源至少需要以下语义：

1. `media_type`
   - `image | video | json`
2. `role`
   - `style_ref | scene_ref | empty_shot_ref | character_ref | motion_ref | first_frame_ref | last_frame_ref | storyboard_ref | dialogue_ref | clip_plan`
3. `group`
   - 由 Agent 生成的人类可读组名，例如“分镜候选”“角色立绘”“场景空镜”“对白脚本”
4. `provenance`
   - 来源工具、来源任务、来源 prompt
5. `relations`
   - 与其他资源的关联，例如“该视频引用了哪些分镜和立绘”

当前实现约定：

1. Asset Atlas 顶部会先归纳 `Resource Mix + Semantic Roles`
2. 高价值导演动作统一收口到 `灵动岛`，避免右栏与主舞台重复指挥
3. 资源语义仍以 `semanticRole` 写回资源数据，保持可 recall 与可复用
6. `usage`
   - 被注入上下文次数、被设为风格参考次数、被加入粗剪次数

目标是让 Agent 能基于这些语义做 Context Assembly，而不是只会扫一堆 URL。

## 5.8 剪辑台升级方向

剪辑台目标是专业级粗剪，而不是全功能 NLE。

需要借鉴 `openreel-video` 的不是视觉皮肤，而是编辑器心智：

1. 右侧 `Media & Assets`
2. 中上 `Preview`
3. 左侧 `Inspector / Properties`
4. 底部 `Timeline`
5. 可拖拽、可裁切、可串播、可恢复
6. 继续复用页面右侧 Asset Atlas，不在剪辑主舞台内部再复制另一套素材栏

结合方式：

1. 优先复用其编辑器状态模型与交互思路
2. 评估是否以隔离子应用或核心模块嵌入
3. 不盲目搬运整仓 UI，避免与现有 `Next.js + Ant Design` 架构冲突

当前实现约定：

1. Clip plan 已升级为 `timeline_v2` 持久化结构
2. 同时写入 `editorState`，用于自动保存、跨会话恢复与继续编辑
3. `Clip Studio` 工作台固定为 `左侧 Properties & Effects + 中央 Preview/Timeline Stage + 页面右侧 Asset Atlas`
4. 中央主舞台进一步细分为 `中上 Preview Monitor + 下方全宽 Timeline`
5. 时间线主舞台不再采用纵向堆叠卡片，而要接近剪映 / iMovie 的工作区形态：紧凑工具栏、可 scrub 的时间尺、主视频轨时间流（预留多轨扩展）与导出收口
6. 首期时间线已明确提供 `Split at Playhead + Ripple Delete`，并保留拖拽重排、裁切与串播预览
7. 首期补充 `AI 自动粗剪`：基于候选视频自动生成粗剪草案并直接应用基础转场预设（Cut / Fade / Dissolve / Wipe Left / Fade Black）
8. 复用边界已明确：吸收 `openreel-video` 的四区心智与编辑状态思路，不引入其整套渲染/导出栈，继续保持 `Next.js + Ant Design + domain_resources` 主壳

## 6. 用户主线

## 6.1 新手主线

1. 一句话输入目标
2. Agent 在 checkpoint 中先对齐关键创作方向
3. Agent 自动选择默认高质量路径
4. 用户从素材区和聊天中逐步 refine
5. 最后进入剪辑台完成粗剪

## 6.2 高手主线

1. 上传或引用多个素材
2. 指定目标、风格、镜头语言或 workflow 偏好
3. 通过 Pro 和自然语言不断驯化知识、模板、记忆
4. 让 Agent 学会自己的常用路径和审美习惯
5. 最终形成专属视频生产 Agent

当前验收结果：

1. 新手主线已可通过一句话进入 `Checkpoint alignment_block`，先对齐画风、路径、分镜密度、首帧约束与最终交付物
2. 高手主线已可通过 `Asset Atlas -> semantic role -> Clip Studio -> memory writeback` 形成持续驯化闭环

## 7. 界面要求

1. 主交互始终在中间 Chat，不恢复左侧控制边栏。
2. 右侧资产区是素材与风格的统一入口。
3. 高级入口统一收口到 `灵动岛` 展开层，而不是继续在右上角分裂多个入口。
4. `checkpoint` 与 `yolo` 保留，但作为上下文偏好注入。
5. 视觉必须达到专业工具水准，且统一纳入 Ant Design 设计系统。

## 8. 成功指标

1. 首轮 checkpoint 不再“直接闷头开干”，而是先对齐关键创作信息。
2. 同一需求下，Agent 能根据上下文灵活选择不同路径，而非固定模板。
3. 多次使用后，系统能明显体现用户偏好记忆。
4. 资产引用、风格引用、分镜引用、对白引用均能稳定进入上下文。
5. 剪辑台从“表单”升级为接近专业编辑器的粗剪体验。

## 5.9 对白脚本确认层

对白不是附属说明，而是独立产物。

1. 故事型任务默认允许 Agent 先生成 `dialogue_script` JSON 草稿。
2. 用户应能像确认分镜或剪辑计划一样，单独确认与编辑对白脚本。
3. 对白脚本在 UI 中与视频 prompt 分开展示，避免创作说明和口播内容混杂。
4. 在真实生成阶段，系统要根据剧情、镜头与对白脚本，把台词组装进隐藏运行时 prompt，而不是要求用户每次手抄。

## 9. 外部参考

1. OpenReel Video 仓库：
   - [https://github.com/Augani/openreel-video](https://github.com/Augani/openreel-video)
2. 其 monorepo 与包结构：
   - [README](https://github.com/Augani/openreel-video/blob/main/README.md)
   - [apps/web/package.json](https://raw.githubusercontent.com/Augani/openreel-video/main/apps/web/package.json)
   - [packages/core/package.json](https://raw.githubusercontent.com/Augani/openreel-video/main/packages/core/package.json)
