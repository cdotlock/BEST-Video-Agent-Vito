# Rubric

统一使用 `0-5` 单维度打分，再换算成 `100` 分制。

## 维度

### 1. `goal_fidelity`

问题：

1. 是否真正命中 brief 的任务目标
2. 是否理解该镜头/片段为什么存在

打分锚点：

1. `0`：明显跑题
2. `3`：大体命中，但意图仍模糊
3. `5`：目标、功能和交付物都非常清晰

### 2. `shot_intent`

问题：

1. 是否有单一明确的镜头目的
2. 是否知道这是 establishing / performance / reaction / reveal / transition / action 中的哪一类

打分锚点：

1. `0`：没有明确镜头目的
2. `3`：隐约有，但不够稳定
3. `5`：镜头意图清晰且具有戏剧功能

### 3. `camera_motion_design`

问题：

1. 是否说清 camera language
2. 动作与运镜是否兼容
3. 若用户已指定镜头语言，系统是否尊重

打分锚点：

1. `0`：无镜头语言或明显冲突
2. `3`：基本可用，但还偏泛
3. `5`：镜头运动、动作弧线、落点高度一致

### 4. `temporal_progression`

问题：

1. 是否存在清晰的起、承、落
2. 是否知道镜头如何结束，是否具备 cut value

打分锚点：

1. `0`：时间推进混乱
2. `3`：存在基本推进
3. `5`：节奏推进清晰，结尾具备剪辑价值

### 5. `continuity_reference_control`

问题：

1. 是否说清连续性锚点
2. 是否正确分配 reference roles
3. 对 reference-driven shot，是否把文本预算留给真正该由文本负责的部分

打分锚点：

1. `0`：连续性与参考策略混乱
2. `3`：有锚点但不够精炼
3. `5`：连续性和参考分工都清晰可执行

### 6. `style_stability_control`

问题：

1. 是否有稳定、可执行的风格控制
2. 是否用正向稳定约束，而非只堆负面词

打分锚点：

1. `0`：风格和稳定性无控制
2. `3`：有控制但还偏粗
3. `5`：风格统一、稳定边界明确、无明显冲突

### 7. `editorial_value`

问题：

1. 这个镜头/结果是否真的可剪
2. 是否给前后镜头留下连接空间

打分锚点：

1. `0`：几乎无成片价值
2. `3`：能用，但很普通
3. `5`：明显有专业剪辑价值

### 8. `execution_precision`

问题：

1. prompt 是否短而有效
2. 是否有 planning leak / model leak / 废话 / 冲突
3. 是否对平台具有较强可迁移性

打分锚点：

1. `0`：冗长、冲突、难执行
2. `3`：可执行，但仍有杂质
3. `5`：密度高、几乎无废话、执行意图明确

## Overlay 维度

overlay 只在 case 明确要求该能力时激活。

### 1. `attribute_binding`

问题：

1. 角色、服装、颜色、道具属性是否绑定正确
2. 关键属性在动作过程中是否容易漂移

打分锚点：

1. `0`：属性经常交换或丢失
2. `3`：大体可控，但复杂动作下有风险
3. `5`：属性绑定明确，执行边界清晰

### 2. `spatial_relation_control`

问题：

1. 左右、前后、遮挡、层次关系是否清晰
2. 空间关系在镜头推进中是否稳定

打分锚点：

1. `0`：空间关系模糊或容易翻转
2. `3`：基本可读，但稳定性一般
3. `5`：空间关系明确，镜头变化下仍可控

### 3. `numeracy_control`

问题：

1. 人物/物体数量是否明确
2. 数量在镜头推进中是否容易漂移

打分锚点：

1. `0`：数量约束几乎没被表达
2. `3`：数量有写，但保护不够
3. `5`：数量、位置和优先级都很清楚

### 4. `motion_binding`

问题：

1. 谁动、谁不动、动到哪里是否明确
2. 动势是否和场景/镜头语言绑定

打分锚点：

1. `0`：动作主体与动势不清
2. `3`：主动作能看懂，但边界一般
3. `5`：动作归属、方向、幅度、落点都清晰

### 5. `action_role_binding`

问题：

1. 多主体场景里，每个角色的职责是否稳定
2. 是否避免角色动作和视线职责互换

打分锚点：

1. `0`：角色职责极易混淆
2. `3`：主次大致明确
3. `5`：多主体关系稳定，职责清楚

### 6. `object_interaction_causality`

问题：

1. 人物与道具/机关的交互顺序是否清楚
2. 是否具备因果和接触逻辑

打分锚点：

1. `0`：动作顺序不成立
2. `3`：基本成立，但容易略过关键中间态
3. `5`：动作链完整，因果顺序可执行

### 7. `physical_plausibility`

问题：

1. 力量、惯性、反射、溅水、重心这类常识边界是否被尊重
2. prompt 是否给模型留出了合理物理解释空间

打分锚点：

1. `0`：明显违背常识或根本没控制
2. `3`：有一定约束，但还不够可靠
3. `5`：边界明确，符合常识且便于执行

## 模式权重

### `prompt_only`

- `goal_fidelity`: 15
- `shot_intent`: 15
- `camera_motion_design`: 15
- `temporal_progression`: 10
- `continuity_reference_control`: 15
- `style_stability_control`: 10
- `editorial_value`: 10
- `execution_precision`: 10

### `shot_eval`

- `goal_fidelity`: 15
- `shot_intent`: 15
- `camera_motion_design`: 20
- `temporal_progression`: 10
- `continuity_reference_control`: 15
- `style_stability_control`: 10
- `editorial_value`: 10
- `execution_precision`: 5

### `sequence_eval`

- `goal_fidelity`: 15
- `shot_intent`: 10
- `camera_motion_design`: 15
- `temporal_progression`: 15
- `continuity_reference_control`: 20
- `style_stability_control`: 10
- `editorial_value`: 10
- `execution_precision`: 5

## Overlay 权重规则

1. 若没有 active overlays，直接使用上面的 base weights。
2. 若有 active overlays：
   - `80` 分给 base dimensions
   - `20` 分给 active overlays
3. base weights 按比例缩放到 `80`
4. active overlays 默认均分 `20`
5. 若某个 case 明确声明 overlay 主次，可在 case metadata 中自定义 overlay 分配

示例：

一个 `prompt_only` case 激活了 `numeracy_control` 和 `motion_binding`。

1. base weights 各自乘以 `0.8`
2. `numeracy_control = 10`
3. `motion_binding = 10`

## 最低通过门槛

以下 gate 任一失败，都不应给出 `strong_pro` 以上评级：

1. `clear_subject`
2. `clear_shot_intent`
3. `clear_camera_or_static_rule`
4. `clear_continuity_or_reference_strategy`
5. `no_major_internal_conflict`

另外：

1. 任一 active overlay 若低于 `2/5`，最终评级不应超过 `usable`
2. active overlay 平均分若低于 `3/5`，最终评级不应超过 `strong_pro`
3. `prompt_only` 在没有真实视频时，通常不应超过 `near_master`

## 评语原则

Judge 的结论优先顺序：

1. 先写失败点
2. 再写 strengths
3. 最后才给总评

如果没有发现严重问题，也必须说明 residual risk。
