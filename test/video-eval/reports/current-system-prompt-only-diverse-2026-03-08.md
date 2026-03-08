# Current System Prompt-Only Diverse Report

- 日期：2026-03-08
- 模式：`prompt_only`
- 协议等级：`quick_check`
- 系统：`BEST Video Agent prompt stack`
- case pack：[animation-short-diverse.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-diverse.md)
- protocol：[PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md)
- artifacts：[current-system-prompt-only-diverse-2026-03-08.artifacts.json](/Users/Clock/BEST-Video-Agent/test/video-eval/reports/current-system-prompt-only-diverse-2026-03-08.artifacts.json)

## Protocol Notes

本次是内部 `quick_check`，不是高置信度 release gate。

- `single judge`
- `non-blind`
- `prompt-only`
- 无 human calibration

因此结果主要用来发现系统短板，而不是宣称跨平台绝对优劣。

## Judge Verdict

```json
{
  "mode": "prompt_only",
  "case_id": "animation-short-diverse",
  "platform_or_system": "BEST Video Agent prompt stack",
  "verdict": {
    "score_100": 77,
    "rating": "strong_pro",
    "confidence": 0.71,
    "evidence_sufficiency": "medium",
    "human_review_recommended": true
  }
}
```

## Case Scores

| case_id | score_100 | judgment |
|---|---:|---|
| `three_lanterns_crossing` | 79 | 数量、静止主体和过桥用途都能表达出来，但数量稳定仍缺少更硬的 guard。 |
| `blue_coat_red_scarf_key` | 81 | 属性绑定最好的一例，动作顺序也清楚，但还不是专门的 binding grammar。 |
| `archway_patrol_cross` | 80 | 静镜、左右关系和巡逻方向基本成立，是多主体空间控制里最稳的一类。 |
| `door_chain_pause` | 76 | 能写出动作链，但意图仍被拉向 reaction，causal micro action 的识别还不够纯。 |
| `puddle_step_reflection` | 74 | 物理边界有基础描述，但重量感、水花尺度和倒影时序还不够硬。 |
| `roof_signal_roles` | 72 | 双角色 brief 本身写得清楚，但 continuity 压缩会丢掉第二角色，职责绑定风险最大。 |

## Findings

### Strengths

1. 复杂 stress case 依然能保持导演语法，而不是退回“堆很多形容词”的旧路子。
2. `static shot`、首帧驱动、首尾帧驱动、mixed refs 等执行模式都还算清晰。
3. attribute、spatial、numeracy 这类难点至少能进入最终 prompt，不会在编译阶段直接丢失。

### Failures

1. `action_role_swap`
   `roof_signal_roles` 暴露了 motion-first continuity 的真实短板：双角色 case 会被压缩成单角色 continuity。
2. `physics_break`
   `puddle_step_reflection` 证明现有语法还不擅长写“重量感、倒影、水花尺度”这种物理微边界。
3. `purpose_blur`
   `door_chain_pause` 这类 causal micro action 仍会被系统理解成一般 reaction/performance。

## Overlay Summary

| overlay | score_5 | read |
|---|---:|---|
| `attribute_binding` | 3.7 | 已能表达，但缺少专门的 binding guard。 |
| `spatial_relation_control` | 3.3 | 静镜下较稳，双主体时会下降。 |
| `numeracy_control` | 3.2 | 数量能写清，但不够抗漂移。 |
| `motion_binding` | 3.1 | 单主体还行，物理微动作偏弱。 |
| `action_role_binding` | 2.8 | 当前最值得警惕的 overlay。 |
| `object_interaction_causality` | 3.2 | 能写顺序，但对中间态的保护还弱。 |
| `physical_plausibility` | 2.7 | 目前最弱，说明上限还没完全打开。 |

## Recommended Next Move

高优先级：

不要继续扩更多 prompt 结构。最值钱的是三件事：

1. 补双角色 continuity 压缩，不要再只保留第一角色。
2. 给物理微动作补一层更明确的 motion/physics language。
3. 把 `causal micro action` 从泛 performance/reaction 中分出来。

## How This Was Run

1. 使用 [PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md) 的 `quick_check` 规则。
2. 使用 [JUDGE_SYSTEM.md](/Users/Clock/BEST-Video-Agent/test/video-eval/JUDGE_SYSTEM.md)、[RUBRIC.md](/Users/Clock/BEST-Video-Agent/test/video-eval/RUBRIC.md) 和 [FAILURE_TAXONOMY.md](/Users/Clock/BEST-Video-Agent/test/video-eval/FAILURE_TAXONOMY.md) 做评估。
3. 通过本地 `pnpm dlx tsx -e ...` 调用当前 prompt 构建函数，生成 6 个 diverse case 的最终 prompt。
4. 本报告只代表 `prompt-level judgment`，不代表真实视频画面已达到同等分数。
