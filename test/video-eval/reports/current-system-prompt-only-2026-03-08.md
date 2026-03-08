# Current System Prompt-Only Report

- 日期：2026-03-08
- 模式：`prompt_only`
- 协议等级：`quick_check`
- 系统：`BEST Video Agent prompt stack`
- case pack：[animation-short-core.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-core.md)
- protocol：[PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md)
- artifacts：[current-system-prompt-only-2026-03-08.artifacts.json](/Users/Clock/BEST-Video-Agent/test/video-eval/reports/current-system-prompt-only-2026-03-08.artifacts.json)

## Protocol Notes

本次是内部 `quick_check`，不是高置信度 release gate。

- `single judge`
- `non-blind`
- `prompt-only`

## Judge Verdict

```json
{
  "mode": "prompt_only",
  "platform_or_system": "BEST Video Agent prompt stack",
  "verdict": {
    "score_100": 84,
    "rating": "strong_pro",
    "confidence": 0.74,
    "evidence_sufficiency": "medium",
    "human_review_recommended": false
  },
  "gates": {
    "minimum_viable": true,
    "clear_subject": true,
    "clear_shot_intent": true,
    "clear_camera_or_static_rule": true,
    "clear_continuity_or_reference_strategy": true,
    "no_major_internal_conflict": true
  }
}
```

## Case Scores

| case_id | score_100 | judgment |
|---|---:|---|
| `establishing_rain_alley` | 85 | establishing 目的、空间与 cut value 清楚，适合做开场建场。 |
| `static_reaction_window` | 89 | 已能稳定保住静镜和微表演，是当前最成熟的一类。 |
| `dialogue_whisper_tracking` | 88 | 对白节奏、连续性和参考职责分配都较强。 |
| `reveal_talisman` | 86 | reveal 结构明确，镜头落点终于停在“发现”上。 |
| `corner_chase_turn` | 82 | 动作方向清楚，但 action shot 的 camera 仍偏保守。 |
| `empty_shot_transition` | 76 | 仍可用，但更像 establishing than transition，转场目的还不够纯。 |

## Findings

### Strengths

1. prompt 已经有稳定的导演语法，不再只是描述词堆。
2. reference-driven shot 会把文字预算转向动作、运镜、节奏和落点，而不是重复描述 look。
3. `static shot` 之类用户明确写出的镜头语言已经能被保住，不会再被系统默认运镜冲掉。
4. 对白场景的节奏意识明显增强，spoken beat 不再轻易被大动作覆盖。
5. continuity、reference role、style/stability 三层控制已经进入强专业级区间。

### Failures

1. `execution_precision`
   现在的 prompt 虽然已经更专业，但仍偏长；还没有收敛到真正“片场短指令”的密度。
2. `purpose_blur`
   空镜转场仍容易被系统往 establishing 方向拉，说明 `transition` 与 `establishing` 的边界还不够稳。
3. `camera_motion_design`
   动作镜头的默认 camera bias 仍偏保守，能保下限，但还没有把动作场面的上限完全打开。

## Recommended Next Move

高优先级：

继续只做一个方向的迭代，而不是再扩结构。最值得补的是 `transition vs establishing` 的意图分离，以及 `action shot` 的受力方向与运镜力度分级。

## How This Was Run

1. 使用 [JUDGE_SYSTEM.md](/Users/Clock/BEST-Video-Agent/test/video-eval/JUDGE_SYSTEM.md) 作为 judge 约束。
2. 使用 [PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md)、[RUBRIC.md](/Users/Clock/BEST-Video-Agent/test/video-eval/RUBRIC.md) 和 [FAILURE_TAXONOMY.md](/Users/Clock/BEST-Video-Agent/test/video-eval/FAILURE_TAXONOMY.md) 打分。
3. 通过本地 `pnpm dlx tsx -e ...` 调用当前 prompt 构建函数，生成 6 个 case 的最终 prompt。
4. 本报告只代表 `prompt-level judgment`，不代表真实视频画面已达到同等分数。
