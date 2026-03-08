# Evaluation Protocol

这份协议规定 `LLM-as-judge` 评测应该怎么跑，避免把一份看似结构化的主观评论误当成“客观测试”。

## 1. 基本立场

1. 默认 `pointwise-first`，先按统一 rubric 独立评每个样本，再做系统级汇总。
2. `pairwise` 不是默认方法，只能用于 close call 或 leaderboard tie-break。
3. serious run 优先使用 `jury`，不要把单一 judge 当成客观真相。
4. Judge 只能依据输入包里的证据打分，不能脑补不存在的视频质量。
5. prompt-only 只评“可控性与执行价值”，不评想象中的最终美术上限。

## 2. 评测等级

### `quick_check`

用于快速 sanity check。

- case 数量：至少 `4`
- judge：允许单一 judge
- 盲评：推荐，但不是硬性要求
- 结果用途：内部调试，不用于宣称系统优劣

### `release_gate`

用于功能迭代后的主回归。

- case 数量：至少 `10`
- case family：至少覆盖 `3` 类
- judge：推荐 `3` 个不同模型家族组成 jury
- 盲评：必须
- pairwise：仅在 close call 时启用

### `cross_platform_compare`

用于平台或系统对比。

- case 数量：至少 `12`
- judge：优先 `jury`
- A/B 顺序：必须交换
- system name：先隐藏，避免品牌 bias
- 若结果受顺序影响明显，直接降 confidence

## 3. 输入包规则

每个评测样本都应提供：

1. `mode`
2. `case_id`
3. `platform_or_system`
4. `task_brief`
5. `references`
6. `artifacts`
7. `constraints`
8. `case_tags`

`case_tags` 至少应包含：

1. `temporal_family`
2. `reference_regime`
3. `overlay_dimensions`

## 4. 盲评与顺序控制

1. 报告阶段之前，system 名称尽量替换为盲 ID。
2. `ab_compare` 至少跑两次：
   - 一次 `A/B`
   - 一次 `B/A`
3. 若只做一次 pairwise，对比结论只能视为低置信度。
4. 单一 pack 内不要把所有同类 case 连续摆放，避免 judge 心智定势。

## 5. Pointwise 先于 Pairwise

推荐流程：

1. 先独立运行 `pointwise`，为每个系统生成单独分数和 failure list。
2. 再在 close call case 上运行 `ab_compare`。
3. 如果 pointwise 和 pairwise 冲突，优先信 pointwise，并在报告中记录冲突。

原因：

1. pairwise 更容易放大措辞、长度和风格偏好。
2. pointwise 更适合发现“哪里坏了”，而不只是“谁赢了”。

## 6. Jury 聚合

如果条件允许，使用至少 `3` 个不同模型或模型家族的 judge。

推荐聚合方式：

1. case 级分数：取 `median`
2. 系统级分数：按 case 权重做加权平均
3. disagreement：记录 `max - min`
4. 如果某个 case 的 panel disagreement 过大，单独标为 `needs_human_review`

不建议：

1. 只取最高分
2. 只取一个 judge 的评论当结论
3. 让同一家族模型充当整个 jury

## 7. Confidence 与证据充分性

Judge 必须同时给出：

1. `confidence`
2. `evidence_sufficiency`
3. `uncertainty_flags`

建议的降权触发器：

1. 单一 judge：降 confidence
2. `prompt_only`：降 confidence，并设置画面质量上限提醒
3. case 少于协议要求：降 confidence
4. 未盲评：降 confidence
5. pairwise 未做顺序交换：降 confidence
6. artifacts 缺失关键字段：降 confidence，并允许 `human_review_recommended=true`

`evidence_sufficiency` 建议取值：

1. `high`：目标、references、artifacts 都充分
2. `medium`：能评主维度，但部分 overlay 无法高置信度判断
3. `low`：只能做粗略结论，不应用于系统对比

## 8. 基础维度与 Overlay

评测分两层：

1. `base dimensions`
   - 所有 case 都要评
2. `overlay dimensions`
   - 仅在 case 明确要求该能力时激活

overlay 的作用：

1. 防止 compositional、numeracy、physics 这类难点被总分掩盖
2. 让系统知道自己究竟是“导演语法强”还是“精确控制强”

## 9. 聚合规则

### 单 case

1. 没有 active overlay：直接按 base weights 计算
2. 有 active overlay：
   - `80` 分来自 base dimensions
   - `20` 分来自 active overlays
   - active overlays 默认均分 `20` 分

### 单 pack

1. 推荐使用 case 分数的算术平均
2. 同时统计：
   - gate fail rate
   - top repeated failure codes
   - overlay 平均分

### 跨 pack

推荐保留分 pack 报告，不要只报一个总分。

如果必须输出总分：

1. `core dramaturgy pack` 占 `60%`
2. `diversity / stress pack` 占 `40%`

## 10. 人工校准

评测系统不是为了替代人，而是为了降低人工成本并提高一致性。

建议：

1. 每次大版本升级后，抽 `2-3` 个 case 做人工复核
2. 若 LLM judge 与人工判断长期偏移，优先修协议和 rubric，而不是强行相信 judge
3. 如果某类 case 一直高分但实际生成总翻车，把该类 case 加进回归集

## 11. 报告最低要求

正式报告至少要写清：

1. 使用了哪个协议等级
2. 是否盲评
3. 是否 jury
4. 是否有 active overlays
5. 是否只是 `prompt-level judgment`
6. 哪些地方证据不足

## 12. 何时不要过度解读

以下情况不应被解读成“系统已经更强”：

1. 只跑了极少量 case
2. 只跑了同一类 aesthetic case
3. 没有 compositional / physics / numeracy stress
4. 只有 pairwise，没有 pointwise
5. 只有单一 judge，没有不确定性说明
