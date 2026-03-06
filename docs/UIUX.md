# UIUX 设计规格：Cream Ceramic Director Console

- 版本：v2.0.0
- 日期：2026-03-06
- 状态：Draft for Review
- 目标页面：`/video`、`/video/[projectId]`

## 1. 体验目标

用户打开工作台后，应立刻感知这不是“聊天页套了几个按钮”，而是一套专业级视频导演工作台。

必须同时满足：

1. 新手能在一句话后被自然引导到正确路径。
2. 高手能在对话、素材、Pro 配置和剪辑台之间流畅切换。
3. 整体观感达到“奶油陶瓷”式的精致、温润、干净，而不是工程后台。

## 2. 视觉语言

## 2.1 设计概念

视觉方向定义为 `Cream Ceramic Director Console`：

1. 大面积温暖浅底，不用冷白后台感。
2. 容器像上釉陶瓷，有柔和高光与克制阴影。
3. 文字层级明确，避免“全都差不多灰”的廉价感。
4. 强调导演台、素材图谱、时间线三种专业区域的身份差异。

## 2.2 色彩

建议以 Ant Design token 为底，再覆盖自定义语义色：

1. Page BG：`#F4EFE8`
2. Surface：`#FFFDF9`
3. Surface Raised：`#FFFFFF`
4. Border：`#E5DDD2`
5. Text Primary：`#1E1B18`
6. Text Secondary：`#6F665C`
7. Brand：`#2F6B5F`
8. Accent Warm：`#C98B5B`
9. Accent Soft Blue：`#8DA7C2`
10. Success：`#4C8B6A`
11. Error：`#C65A4B`

禁止事项：

1. 纯后台式冷白灰配色
2. 大面积纯黑深底
3. 紫色默认品牌倾向

## 2.3 字体

1. 标题与关键分区：`Noto Serif SC` 或 `Source Han Serif SC`
2. 正文与控件：`IBM Plex Sans`, `PingFang SC`, `Noto Sans SC`
3. 代码与技术配置：等宽字体独立呈现

## 2.4 动效

1. 首屏：分区 staggered reveal，时长控制在 `180ms - 260ms`
2. 抽屉：轻微阻尼感，不做夸张弹簧
3. 素材新增：卡片边框高亮一次，然后回到正常状态
4. 视图切换：Chat 与 Clip 用横向平移或淡入，不用生硬闪烁

## 3. 布局原则

## 3.1 `/video`

目标不是管理后台首页，而是创作入口。

结构：

1. 顶部：品牌、项目搜索、最近活动、快速创建
2. 主区：项目卡片瀑布或栅格
3. 辅区：最近使用模板、最近风格、最近项目

气质要求：

1. 更像创作工作室首页
2. 少表格，多卡片与精选入口

## 3.2 `/video/[projectId]`

桌面端固定为 `中间主舞台 + 右侧资产图谱`，不恢复左边栏。

主结构：

1. 顶栏
   - Breadcrumb
   - 项目名 / Workspace capsule
   - `Checkpoint / YOLO`
   - `Chat / Clip`
   - `Style`
   - `Pro`
2. 中间主舞台
   - Chat 导演台或 Clip Studio
3. 右侧资产图谱
   - 按媒体维度组织
   - 按 Agent 命名 Group 展示
   - Inspector 详情抽屉

移动端：

1. 中间主舞台保留
2. 右侧资产图谱收进 Drawer
3. Clip Studio 允许上下分区，而不是强塞双栏

## 4. Chat 导演台

## 4.1 角色定义

中间 Chat 不是普通消息列表，而是导演台，负责：

1. 解释计划
2. 发起确认
3. 汇报 review
4. 组织素材引用
5. 驱动整个工作流

## 4.2 消息类型

必须形成稳定消息语法：

1. `director_note`
   - 正常解释、建议、创作理由
2. `plan_block`
   - 本轮意图、路径、关键产物、下一步
3. `review_block`
   - 当前结果是否达标、是否需要换路径
4. `material_block`
   - 说明当前引用了哪些素材及其角色
5. `tool_receipt`
   - 工具调用结果与落库情况
6. `alignment_block`
   - checkpoint 首轮确认块

首期实现约定：

1. 消息块通过 Markdown 标题落地，使用精确标题：`### director_note / ### alignment_block / ### plan_block / ### material_block / ### review_block / ### tool_receipt`
2. 前端将这些标题解析为 Ant Design 容器化消息块，而不是裸 Markdown

Markdown 必须达到可读水平：

1. 标题、列表、表格、引用、代码块样式完整
2. 大段文字要有舒适的行高与段距
3. 计划块和 review 块不能只是裸 markdown，需要 Ant Design 容器化

## 4.3 Checkpoint 体验

Checkpoint 模式的首轮不能直接执行，必须至少覆盖：

1. 画风方向
2. 工作流路径
3. 分镜密度
4. 是否需要角色台词脚本
5. 最终交付是镜头组、短片还是粗剪成片

交互要求：

1. 以消息内确认块承载，而不是弹窗打断
2. 可一键接受 Agent 提议，也可自然语言改写
3. 只有在信息足够明确时才开工

## 4.4 输入区

输入区应像导演指令台，而不是单纯 textarea。

需要承载：

1. 当前上下文素材 chips
2. 当前风格参考 chips
3. 模式提示
4. 图片上传入口
5. 清晰的主发送按钮

可增强但不喧宾夺主：

1. 引导性 placeholder
2. 最近可继续动作的轻量提示

## 5. 右侧资产图谱

## 5.1 信息架构

第一层按媒体类型：

1. 图片
2. 视频
3. 脚本 / JSON

第二层按 Agent 命名 Group：

1. 分镜候选
2. 角色立绘
3. 场景空镜
4. 风格参考
5. 动作参考
6. 台词脚本
7. 粗剪方案

目标是让用户理解“这一组素材在创作里扮演什么角色”。

## 5.2 Gallery 规格

1. 图片默认 masonry / grid gallery
2. 视频默认横向预览卡
3. JSON 与脚本默认列表卡，但可打开 Inspector
4. 每张卡必须显示：
   - 标题
   - 角色 badge
   - Group
   - 来源或生成方式的弱提示

## 5.3 Inspector

点开素材后进入 Inspector Drawer，而不是简陋弹窗。

Inspector 至少包含：

1. 大图或视频预览
2. 可读的创作描述
3. 引用关系
4. 来源任务信息
5. 快捷动作

快捷动作规范：

1. `@加入上下文`
2. `设为风格参考`
3. `作为首帧`
4. `作为尾帧`
5. `加入粗剪`
6. `重 roll`

当前实现约定：

1. Asset Atlas 已支持 `设为首帧 / 设为尾帧 / 角色锚点 / 空镜锚点 / 加入粗剪`
2. 语义动作不是一次性聊天指令，而是通过 `PATCH /resources` 写回 `semanticRole`
3. `加入粗剪` 会直接切换到 Clip Studio，并把目标视频插入时间线待保存

## 6. Style 与 Pro

## 6.1 右上角入口

右上角固定两个入口：

1. `Style`
2. `Pro`

不再在主区放大量“工作流定制”按钮。

## 6.2 Style

Style 面板负责：

1. 搜索外部参考
2. 反推风格
3. 查看与切换 Style Profile
4. 将选中结果注入当前工作域

视觉上应更像 moodboard，而不是表单。

## 6.3 Pro

Pro 是高级配置面板，但不暴露源码编辑。

建议分为 5 个 Tab：

1. `Knowledge`
   - 用户知识补充、长期禁忌、偏好
2. `Templates`
   - workflow 模板与默认策略
3. `Memory`
   - memory user、记忆清理、近期提炼结果
4. `Review`
   - checkpoint 强度、自评审开关、默认确认策略
5. `Capabilities`
   - 可用 MCP/Skill 叠层与建议，不直接暴露源码

当前实现约定：

1. `Pro` 已按 `Knowledge / Templates / Memory / Review / Capabilities` 五层抽屉落地
2. `Memory` tab 直接展示长期偏好摘要、路径推荐、剪辑偏好、镜头语言偏好与模型偏好
3. `Capabilities` tab 仅展示绑定的 MCP / Skill / Prompt Compiler layer

## 7. Clip Studio

## 7.1 目标

Clip 不应再是“表单式片段列表”，而要成为专业粗剪台。

## 7.2 心智模型

参考 `openreel-video` 的编辑器布局：

1. `Source Monitor`
   - 查看单素材，设入点/出点
2. `Program Monitor`
   - 预览当前粗剪结果
3. `Timeline`
   - 时间线拖拽排序、裁切、吸附
4. `Inspector`
   - 当前片段参数与转场设置

首期能力红线：

1. 拖拽重排
2. 拖拽裁切
3. 串播预览
4. 自动保存
5. 可恢复上次编辑状态

当前实现约定：

1. `Clip Studio` 已落成 `Source Monitor + Program Monitor + Timeline + Inspector`
2. 自动保存通过 `clip-plan timeline_v2 + editorState` 持久化
3. 若服务器已有 clip plan，则优先恢复；否则回退到本地草稿或现有视频候选起稿
4. `加入粗剪` 的资产动作会把视频直接送入当前时间线，形成 Asset Atlas -> Clip Studio 的闭环
5. 手动保存后会主动写回路径评审与编辑偏好，作为后续路径推荐和上下文组装输入

## 7.3 架构原则

1. 主壳层仍由 Ant Design 负责
2. 时间线画布允许局部自绘
3. 不要求整仓复制 `openreel-video`
4. 优先复用其状态模型与交互原则，再决定是否引入子应用

## 8. 状态设计

## 8.1 空态

1. 无项目：强调创建第一部作品
2. 无工作域：强调“一句话开始”
3. 无素材：强调“Agent 会先规划再生成”
4. 无粗剪：强调“把视频加入粗剪开始拼接”

## 8.2 加载态

1. 中间舞台显示真正与任务有关的加载语义
2. 右侧资产新增时有可见反馈
3. Clip 加载已有 plan 时应提示“已恢复上次剪辑状态”

当前实现约定：

1. 桌面端固定 `中间主舞台 + 右侧资产图谱`
2. 移动端收束为主舞台 + `素材 Drawer`
3. 已人工验证桌面与移动端都能完成 Chat / Clip / 素材切换，不再依赖桌面宽度假设

## 8.3 错误态

每个错误都必须给出：

1. 发生在哪一层
2. 用户下一步能做什么

## 9. Ant Design 落地原则

整个外壳必须建立在 Ant Design 上，避免散乱的半 Tailwind 半原生拼贴感。

优先使用：

1. `App`, `ConfigProvider`, `Layout`, `Flex`, `Splitter`
2. `Card`, `Tabs`, `Segmented`, `Drawer`, `Collapse`
3. `Typography`, `Button`, `Input`, `Select`, `Switch`
4. `Tour`, `Tooltip`, `Alert`, `Message`, `Modal`

允许自定义：

1. 时间线画布
2. Gallery 布局
3. 高级消息块

## 10. 验收标准

1. 用户第一眼就能感知到这是一套专业工具，而不是开发中后台。
2. Checkpoint 模式必须有明确中间确认体验。
3. Chat、资产图谱、Style、Pro、Clip 五者形成统一视觉语言。
4. 高手可以逐步驯化知识、模板和记忆，而不是只能用固定预设。
5. 剪辑台具备接近专业编辑器的粗剪体验。
