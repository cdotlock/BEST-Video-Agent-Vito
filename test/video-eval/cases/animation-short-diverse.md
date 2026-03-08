# Animation Short Diverse Cases

这套 case pack 不追求“更多题材”，而是专门补那些容易被美术风格掩盖的控制能力。

## Case 1: `three_lanterns_crossing`

- 类型：`prompt_only | shot_eval`
- temporal_family：`atmospheric_motion`
- reference_regime：`prompt_only_or_scene_ref`
- overlays：`numeracy_control`, `motion_binding`
- brief：
  主角站在屋檐下保持不动，身后街道上恰好有三只纸灯笼从右向左缓慢漂过，深度层次要分明，但主角不参与动作。
- 必须做到：
  - 恰好三只灯笼
  - 主角保持静止
  - 灯笼运动方向统一
  - 前后景层次清楚
- 典型失败：
  - 灯笼数量漂移
  - 主角跟着一起动
  - 运动方向混乱

## Case 2: `blue_coat_red_scarf_key`

- 类型：`prompt_only | shot_eval`
- temporal_family：`performance_action`
- reference_regime：`first_frame`
- overlays：`attribute_binding`, `object_interaction_causality`
- brief：
  穿蓝色雨衣、系红围巾的少女把一枚黄铜钥匙藏进左手，再顺势塞进外套口袋。镜头重点是属性绑定和动作顺序，不是华丽运镜。
- 必须做到：
  - 蓝雨衣、红围巾、黄铜钥匙不能串位
  - `左手` 信息明确
  - 钥匙先入手，再入袋
  - 运镜克制
- 典型失败：
  - 颜色与道具绑定漂移
  - 左右手混乱
  - 钥匙凭空消失

## Case 3: `archway_patrol_cross`

- 类型：`prompt_only | shot_eval`
- temporal_family：`stealth_tension`
- reference_regime：`static_scene`
- overlays：`spatial_relation_control`, `action_role_binding`
- brief：
  主角贴在石拱门左侧阴影里不动，守卫提着灯从画面前景右向左巡过。固定镜头，重点是空间关系和角色职责不能互换。
- 必须做到：
  - 主角始终在左侧阴影
  - 守卫在前景右向左经过
  - 固定镜头不被破坏
  - 两人职责不互换
- 典型失败：
  - 左右关系翻转
  - 主角被写成移动主体
  - 守卫与主角层次混乱

## Case 4: `door_chain_pause`

- 类型：`prompt_only | shot_eval`
- temporal_family：`causal_micro_action`
- reference_regime：`first_last_frame`
- overlays：`object_interaction_causality`
- brief：
  角色轻轻抬起门链，停一拍听门外动静，再把门推开一条缝。镜头只允许一个主动作链，不要加额外事件。
- 必须做到：
  - 动作顺序明确
  - 中间停顿可读
  - 推门只开一条缝
  - 没有第二条动作主线
- 典型失败：
  - 省略门链中间态
  - 停顿消失
  - 动作链被拆散

## Case 5: `puddle_step_reflection`

- 类型：`prompt_only | shot_eval`
- temporal_family：`physical_micro_action`
- reference_regime：`first_last_frame`
- overlays：`physical_plausibility`, `motion_binding`
- brief：
  靴子试探性踩进一小片浅水，溅起很小的水花，倒影短暂破碎后重新稳定。重点是重量感、反射和细小动作的物理边界。
- 必须做到：
  - 受力轻重明确
  - 水花幅度合理
  - 倒影先破再稳
  - 动作落点干净
- 典型失败：
  - 水花规模夸张
  - 倒影逻辑缺失
  - 动作像漂浮而不是踩踏

## Case 6: `roof_signal_roles`

- 类型：`prompt_only | shot_eval`
- temporal_family：`dual_subject_action`
- reference_regime：`mixed_refs`
- overlays：`action_role_binding`, `spatial_relation_control`
- brief：
  屋顶上，信使半跪点亮信号焰火，另一名望风者保持站立并始终朝向反方向巷口警戒。重点是双角色职责稳定，而不是镜头炫技。
- 必须做到：
  - 一个角色半跪点火
  - 另一角色站立警戒
  - 朝向关系稳定
  - 不抢镜、不换职责
- 典型失败：
  - 双角色动作互换
  - 两人同时做同一种事
  - 空间关系变糊
