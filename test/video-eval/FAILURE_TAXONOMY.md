# Failure Taxonomy

Judge 在报告中应尽量使用以下 failure code，避免每次都发明新术语。

## `goal_drift`

系统没有真正命中 brief，或者把镜头做成了另一种任务。

## `purpose_blur`

镜头存在，但看不出它为什么存在；dramatic beat 模糊。

## `camera_conflict`

同一个 shot 里出现互相打架的 camera instructions，或者用户已指定静镜/跟拍后又被系统覆盖。

## `action_stack`

一个短镜头里塞入太多动作事件，导致不可控。

## `temporal_flatness`

没有明确的起、承、落，镜头不知道如何开始、如何推进、如何停住。

## `landing_weak`

结尾不具备 cut value，没有落点，也不利于进入下一镜。

## `continuity_gap`

角色、空间、视线、screen direction 或动作承接没有被控制。

## `reference_role_confusion`

style_ref / character_ref / scene_ref / motion_ref / frame refs 的职责混乱。

## `style_drift`

风格方向不稳定，或者风格控制太泛，无法约束结果。

## `negative_dump`

过度依赖负面词清单，没有把稳定目标用正向方式写清。

## `planning_leak`

把 workflow path、内部规划、模型元信息等不该进入生成 prompt 的内容泄漏到最终执行 prompt。

## `editorial_dead_end`

镜头即使生成成功，也缺少成片价值，无法稳妥接入 sequence。

## `dialogue_motion_conflict`

对白、表演、口型节奏与镜头运动互相冲突，导致 spoken scene 不可用。

## `reference_underuse`

明明是 reference-driven shot，但文本仍把预算浪费在重复描述 look，而没有强调 motion/camera/timing/landing。

## `overcompression`

为了追求简短而丢掉关键控制信息，导致 prompt 虽短但不可控。

## `attribute_swap`

角色、颜色、服装、道具等属性绑定不稳，容易串位或丢失。

## `spatial_relation_break`

左右、前后、遮挡或 screen direction 关系不清，镜头推进后更容易翻转。

## `numeracy_drift`

数量约束不稳定，生成过程容易平白增减主体或关键物件。

## `motion_binding_break`

主动作、受力方向、静止对象或动作归属不清，导致“谁在动”变得模糊。

## `action_role_swap`

多主体场景中角色职责互换，或原本应静止/观察的角色被写成执行动作的主体。

## `interaction_causality_break`

道具/机关/环境交互缺少必要中间态，动作顺序和因果链不成立。

## `physics_break`

重量感、惯性、反射、溅水、碰撞等常识边界没有被控制。
