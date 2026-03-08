# Video Eval System

通用的 `LLM-as-judge` 视频评测系统。

目标不是绑定某个模型、某个平台或某一套工作流，而是给任何 agent 一套可复用的评测方法，用来评估：

1. `prompt_only` 质量
2. 单镜头视频结果
3. 多镜头序列结果
4. A/B 对比或回归测试

## 设计原则

1. 平台无关
   不依赖 Runway / Veo / Sora / Kling / Pika / Luma 的私有字段。
2. 证据优先
   Judge 只能根据提供的 prompt、参考、关键帧、视频描述、序列描述打分。
3. 区分可观察事实与推断
   任何分数都必须附 evidence；任何推断都要显式写明是 inference。
4. `pointwise-first`
   先独立打分，再做对比；不要把 pairwise 当成默认真相。
5. `jury-over-single-judge`
   serious run 推荐多模型 panel，单一 judge 只能给较低置信度结论。
6. 基础维度 + overlay
   除了通用导演维度，还要单独测 compositional、numeracy、physics 等 stress 能力。
7. 先判可用，再判伟大
   先过最低可用门槛，再讨论是否接近专业级或大师级。

## 目录

- [JUDGE_SYSTEM.md](/Users/Clock/BEST-Video-Agent/test/video-eval/JUDGE_SYSTEM.md)
- [PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md)
- [RUBRIC.md](/Users/Clock/BEST-Video-Agent/test/video-eval/RUBRIC.md)
- [FAILURE_TAXONOMY.md](/Users/Clock/BEST-Video-Agent/test/video-eval/FAILURE_TAXONOMY.md)
- [CASE_MATRIX.md](/Users/Clock/BEST-Video-Agent/test/video-eval/CASE_MATRIX.md)
- [RESEARCH_BASE.md](/Users/Clock/BEST-Video-Agent/test/video-eval/RESEARCH_BASE.md)
- [cases/animation-short-core.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-core.md)
- [cases/animation-short-diverse.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-diverse.md)
- `reports/`

## 支持的评测模式

### 1. `prompt_only`

在没有实际生成视频时，只评 prompt 和参考装配本身。

看点：

1. 是否有清晰的镜头目的
2. 是否把动作、运镜、节奏、连续性说清
3. 是否避免 planning leak、模型 leak、无效形容词堆砌
4. 是否具有跨平台执行价值

### 2. `shot_eval`

评估单镜头结果。

输入可包含：

1. 原始 brief
2. 最终 prompt
3. 参考资产说明
4. 关键帧描述或视频描述

### 3. `sequence_eval`

评估一个片段序列或粗剪结果。

重点比 `shot_eval` 多两项：

1. shot-to-shot continuity
2. editorial rhythm

### 4. `ab_compare`

比较两个平台、两个系统或两个 prompt 版本。

要求：

1. case 相同
2. reference 条件相同
3. judge 不先看系统名，尽量先盲评

## 标准输入包

每次评测都建议向 judge 提供以下结构：

1. `mode`
2. `platform_or_system`
3. `case_id`
4. `task_brief`
5. `references`
6. `artifacts`
7. `constraints`
8. `case_tags`

`artifacts` 根据模式不同而不同：

1. `prompt_only`：最终 prompt、参考角色映射、可选 compiler snapshot
2. `shot_eval`：最终 prompt、关键帧描述、视频描述、可选首尾帧
3. `sequence_eval`：shot list、每镜描述、粗剪结构、转场说明
4. `ab_compare`：A 包、B 包

`case_tags` 至少应提供：

1. `temporal_family`
2. `reference_regime`
3. `overlay_dimensions`

## Judge 输出要求

Judge 应输出结构化 JSON，字段见 [JUDGE_SYSTEM.md](/Users/Clock/BEST-Video-Agent/test/video-eval/JUDGE_SYSTEM.md)。

至少包含：

1. `mode`
2. `case_id`
3. `protocol`
4. `verdict`
5. `dimension_scores`
6. `overlay_scores`
7. `gates`
8. `top_strengths`
9. `top_failures`
10. `recommended_next_move`

## 运行建议

1. 先阅读 [PROTOCOL.md](/Users/Clock/BEST-Video-Agent/test/video-eval/PROTOCOL.md)，确定这次是 `quick_check`、`release_gate` 还是 `cross_platform_compare`
2. 先用 [cases/animation-short-core.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-core.md) 跑通导演语法
3. 再用 [cases/animation-short-diverse.md](/Users/Clock/BEST-Video-Agent/test/video-eval/cases/animation-short-diverse.md) 跑 compositional / physics stress
4. 用 [CASE_MATRIX.md](/Users/Clock/BEST-Video-Agent/test/video-eval/CASE_MATRIX.md) 检查覆盖面，不要只测一种美学
5. 对同一系统至少保留：
   - 一个 `prompt_only` 基线报告
   - 一个多样性 stress 报告
   - 一个 `ab_compare` 回归报告
6. 若 judge 只能看到 prompt，结论必须写成“prompt-level judgment”，不能冒充最终画面质量结论

## 通过线建议

`prompt_only`：

1. `< 60`：不可用或高度不稳定
2. `60 - 74`：可用，但专业控制不足
3. `75 - 84`：强专业级
4. `85 - 92`：接近大师级
5. `93+`：极少数情况可判为真正顶级

不要轻易给出 `93+`。如果没有真实视频结果，仅凭 prompt，通常不应超过 `90`。

## 从论文吸收的关键约束

1. 参考 [G-Eval](https://arxiv.org/abs/2303.16634)，使用结构化 rubric 和 form-like 输出，而不是自由评论。
2. 参考 [Prometheus](https://arxiv.org/abs/2310.08491)，把 rubric、case、failure taxonomy 分开维护。
3. 参考 [Replacing Judges with Juries](https://arxiv.org/abs/2404.18796)，serious run 优先 jury 聚合。
4. 参考 [The Comparative Trap](https://arxiv.org/abs/2406.12319)，默认 `pointwise-first`，pairwise 只做辅助。
5. 参考 [VBench](https://arxiv.org/abs/2311.17982)、[FETV](https://arxiv.org/abs/2311.01813)、[T2V-CompBench](https://arxiv.org/abs/2407.14505)、[VideoScore](https://arxiv.org/abs/2406.15252)，把 case 设计成“能力覆盖”，而不是只换题材。
