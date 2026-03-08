# Animation Short Core Cases

这是一套平台无关的动画短片核心 case pack。

目标不是覆盖所有题材，而是覆盖最常见、最能拉开系统水平差距的 shot type。

## Case 1: `establishing_rain_alley`

- 类型：`prompt_only | shot_eval`
- temporal_family：`establishing`
- reference_regime：`weak_ref`
- overlays：`none`
- brief：
  雨夜旧城巷口的 establishing shot。要先建立空间地理、光源方向和压抑气氛，再让观众知道主角即将从画面边缘进入。
- 必须做到：
  - 空间可读
  - 光源清晰
  - 留出角色入镜空间
  - 结尾可切到角色镜头
- 典型失败：
  - 只是一张漂亮背景图
  - 气氛有了，但空间不可剪

## Case 2: `static_reaction_window`

- 类型：`prompt_only | shot_eval`
- temporal_family：`reaction`
- reference_regime：`first_frame`
- overlays：`none`
- brief：
  主角站在窗前，发现线索后短暂停住。固定镜头，只有呼吸、眼神和雨痕变化。重点是 reaction，而不是大动作。
- 必须做到：
  - 静镜不被破坏
  - 微表演清晰
  - 有可剪的停顿落点
- 典型失败：
  - 系统偷偷加入慢推或跟拍
  - 表演被背景或天气特效抢走

## Case 3: `dialogue_whisper_tracking`

- 类型：`prompt_only | shot_eval`
- temporal_family：`dialogue`
- reference_regime：`first_last_frame`
- overlays：`none`
- brief：
  主角低声说“先别出声”，压住呼吸缓慢前探。镜头应服从对白节奏，不能用大动作盖住 spoken beat。
- 必须做到：
  - 对白节奏优先
  - 口型、停顿、镜头推进兼容
  - 动作和视线有明确落点
- 典型失败：
  - 动作太多
  - 镜头比台词更抢戏

## Case 4: `reveal_talisman`

- 类型：`prompt_only | shot_eval`
- temporal_family：`reveal`
- reference_regime：`mixed_refs`
- overlays：`none`
- brief：
  角色在昏暗房间里慢慢发现一枚发光护符。镜头重点在 reveal，不在动作复杂度。
- 必须做到：
  - 信息揭示有顺序
  - 落点停在“发现”上
  - 光线帮助叙事
- 典型失败：
  - 一开始就把信息全交代完
  - reveal 没有真正的戏剧停点

## Case 5: `corner_chase_turn`

- 类型：`prompt_only | shot_eval`
- temporal_family：`action`
- reference_regime：`first_last_frame`
- overlays：`none`
- brief：
  主角拐过巷角追上目标。短镜头里只允许一个主动作弧线和一个主 camera move。
- 必须做到：
  - 力线清晰
  - 受力和收势明确
  - 镜头不乱
- 典型失败：
  - 连招式动作堆叠
  - 镜头和动作互相抢方向

## Case 6: `empty_shot_transition`

- 类型：`prompt_only | shot_eval | sequence_eval`
- temporal_family：`transition`
- reference_regime：`weak_ref`
- overlays：`none`
- brief：
  用一个空镜承接前后两场戏。重点不是美，而是给 sequence 提供呼吸、地理确认和情绪过桥。
- 必须做到：
  - 空镜承担转场功能
  - 环境信息为前后镜服务
  - 节奏平顺，可接剪
- 典型失败：
  - 只是空镜，但没有叙事功能
  - 转场镜头过度抢戏

## 使用建议

第一次评测一个系统时，建议至少跑：

1. `static_reaction_window`
2. `dialogue_whisper_tracking`
3. `corner_chase_turn`

这三个 case 基本能把“微表演控制”“对白控制”“动作控制”三条主线测出来。
