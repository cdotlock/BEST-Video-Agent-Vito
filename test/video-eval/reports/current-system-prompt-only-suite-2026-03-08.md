# Current System Prompt-Only Suite Report

- 日期：2026-03-08
- 模式：`prompt_only`
- 协议等级：`release_gate`（带明显偏差）
- 系统：`BEST Video Agent prompt stack`
- case matrix：[CASE_MATRIX.md](/Users/Clock/BEST-Video-Agent/test/video-eval/CASE_MATRIX.md)
- core report：[current-system-prompt-only-2026-03-08.md](/Users/Clock/BEST-Video-Agent/test/video-eval/reports/current-system-prompt-only-2026-03-08.md)
- diverse report：[current-system-prompt-only-diverse-2026-03-08.md](/Users/Clock/BEST-Video-Agent/test/video-eval/reports/current-system-prompt-only-diverse-2026-03-08.md)

## Protocol Notes

这次 suite 已满足 `10+ case`，但还不算高置信度 release gate，因为存在这些偏差：

- `single judge`
- `non-blind`
- `prompt-only`
- 无 human calibration

所以它的意义是：能比较可靠地告诉我们“系统哪里强、哪里还不够”，但不能拿来宣称跨平台客观领先。

## Verdict

```json
{
  "score_100": 81,
  "rating": "strong_pro",
  "confidence": 0.68,
  "evidence_sufficiency": "medium",
  "human_review_recommended": true
}
```

## Pack Breakdown

| pack | score_100 | read |
|---|---:|---|
| `animation-short-core` | 84 | 导演语法、连续性、对白与静镜控制已经进入强专业级。 |
| `animation-short-diverse` | 77 | compositional、physics、dual-subject 控制能用，但还没到上限打开的程度。 |
| weighted overall | 81 | 系统已经稳定，不再是“偶尔神来之笔”，但还不是 near-master。 |

## What This Means

1. 这套系统已经达到你前面说的那种“稳定做到 0.8 左右”的区间，而不是在 `0.1-0.9` 之间乱跳。
2. 现在最强的不是“画面想象力”，而是稳定的导演语法和 reference control。
3. 现在最弱的不是 UI，不是 workflow，不是 style，而是高约束下的精确控制层。

## Remaining Gap To “Master”

1. `dual-subject continuity`
   多角色 case 还会在压缩时丢信息，这是离大师级最明显的工程短板之一。
2. `physical micro-action`
   物理边界语言还不够专业，不足以稳定保护重量感、惯性、反射和 splash scale。
3. `causal precision`
   某些 micro action 仍被泛化为 reaction/performance，说明 intent taxonomy 还不够细。

## Decision

如果按这套更严格的协议自评，我不会说系统已经“大师级”。

更准确的说法是：

这是一套已经进入 `strong_pro`、并且开始具备“向 near_master 逼近的结构”的系统。

它已经不再粗糙，但还差最后一层精确控制。
