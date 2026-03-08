# Case Matrix

这份矩阵回答两个问题：

1. 我们到底测了哪些能力
2. 哪些能力还没被覆盖

## Case Families

### `core_dramaturgy`

测导演语法是否成立：

1. 建场
2. 反应
3. 对白
4. reveal
5. action
6. transition

### `diversity_stress`

测精确控制是否成立：

1. attribute binding
2. spatial relation
3. numeracy
4. motion binding
5. object interaction causality
6. physical plausibility
7. action role binding

## Coverage Table

| case_id | pack | temporal_family | reference_regime | active_overlays | intended_modes | 主要测什么 |
|---|---|---|---|---|---|---|
| `establishing_rain_alley` | core | establishing | weak_ref | `none` | `prompt_only`, `shot_eval` | 建立空间、光源、cut value |
| `static_reaction_window` | core | reaction | first_frame | `none` | `prompt_only`, `shot_eval` | 静镜、微表演、停顿落点 |
| `dialogue_whisper_tracking` | core | dialogue | first_last_frame | `none` | `prompt_only`, `shot_eval` | spoken beat 与运镜兼容 |
| `reveal_talisman` | core | reveal | mixed_refs | `none` | `prompt_only`, `shot_eval` | 信息揭示顺序与揭示落点 |
| `corner_chase_turn` | core | action | first_last_frame | `none` | `prompt_only`, `shot_eval` | 单主动作弧线与主运镜 |
| `empty_shot_transition` | core | transition | weak_ref | `none` | `prompt_only`, `shot_eval`, `sequence_eval` | 呼吸、过桥、地理确认 |
| `three_lanterns_crossing` | diversity | atmospheric_motion | prompt_only_or_scene_ref | `numeracy_control`, `motion_binding` | `prompt_only`, `shot_eval` | 数量稳定与背景运动控制 |
| `blue_coat_red_scarf_key` | diversity | performance_action | first_frame | `attribute_binding`, `object_interaction_causality` | `prompt_only`, `shot_eval` | 颜色/道具绑定与动作顺序 |
| `archway_patrol_cross` | diversity | stealth_tension | static_scene | `spatial_relation_control`, `action_role_binding` | `prompt_only`, `shot_eval` | 左右/前后关系与角色职责 |
| `door_chain_pause` | diversity | causal_micro_action | first_last_frame | `object_interaction_causality` | `prompt_only`, `shot_eval` | 开锁动作链与中间停顿 |
| `puddle_step_reflection` | diversity | physical_micro_action | first_last_frame | `physical_plausibility`, `motion_binding` | `prompt_only`, `shot_eval` | 重量感、溅水、反射时序 |
| `roof_signal_roles` | diversity | dual_subject_action | mixed_refs | `action_role_binding`, `spatial_relation_control` | `prompt_only`, `shot_eval` | 双角色职责与方向稳定 |

## 推荐套件

### `smoke`

适合快速回归：

1. `static_reaction_window`
2. `dialogue_whisper_tracking`
3. `corner_chase_turn`
4. `blue_coat_red_scarf_key`

### `release_gate`

适合一次完整版本回归：

1. `establishing_rain_alley`
2. `static_reaction_window`
3. `dialogue_whisper_tracking`
4. `reveal_talisman`
5. `corner_chase_turn`
6. `empty_shot_transition`
7. `three_lanterns_crossing`
8. `blue_coat_red_scarf_key`
9. `archway_patrol_cross`
10. `door_chain_pause`
11. `puddle_step_reflection`
12. `roof_signal_roles`

### `platform_compare`

至少跑完整 `release_gate`，并增加：

1. A/B 顺序交换
2. 盲 ID
3. jury

## 解释原则

1. `core` 高分但 `diversity` 低分：说明导演语法强，但精确控制不足。
2. `diversity` 高分但 `core` 低分：说明约束强，但镜头戏剧价值和成片意识弱。
3. 两边都高：才有资格讨论是否接近“大师级系统”。
