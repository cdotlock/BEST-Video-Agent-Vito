# Research Base

这份文件只记录真正影响本评测系统设计的论文结论。

## 1. G-Eval

- 论文：[G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment](https://arxiv.org/abs/2303.16634)
- 关键结论：
  - 用 `CoT + form-filling` 的结构化评分方式，比随意打分更接近人工评审。
  - 评分必须拆成维度，而不是只问一个总分。
  - LLM judge 可能偏向 LLM 风格文本，因此不能盲信总分。
- 我们采用的设计：
  - 统一使用结构化 rubric
  - judge 输出 JSON
  - 每个维度都要求 `evidence + inference`

## 2. Prometheus

- 论文：[Prometheus: Inducing Fine-grained Evaluation Capability in Language Models](https://arxiv.org/abs/2310.08491)
- 关键结论：
  - 明确 rubric 和参考材料时，judge 的稳定性明显更高。
  - “可自定义、细粒度标准”很关键。
- 我们采用的设计：
  - 不做单一总评 prompt
  - 把 rubric、failure taxonomy、case pack 分开维护
  - judge 默认按定制标准评，不按“主观喜好”评

## 3. Replacing Judges with Juries

- 论文：[Replacing Judges with Juries: Evaluating LLM Generations with a Panel of Diverse Models](https://arxiv.org/abs/2404.18796)
- 关键结论：
  - 单一 judge 容易带来 model-family bias
  - 多模型 panel 往往比单一大模型 judge 更稳、更便宜
- 我们采用的设计：
  - 推荐 `jury` 模式：至少 3 个不同模型/家族的 judge
  - 最终分数使用 `median` 而不是单一 judge 分
  - 若 panel 不可用，必须降 confidence

## 4. The Comparative Trap

- 论文：[The Comparative Trap: Pairwise Comparisons Amplifies Biased Preferences of LLM Evaluators](https://arxiv.org/abs/2406.12319)
- 关键结论：
  - 直接 pairwise 容易放大 verbosity bias、style bias 等表层偏差
  - pointwise 评估更稳
- 我们采用的设计：
  - 默认 `pointwise-first`
  - pairwise 只作为 close-call tie-breaker 或 leaderboard 工具
  - A/B 对比需要做顺序交换，不允许只比一次

## 5. Judging the Judges

- 论文：[Judging the Judges: Evaluating Alignment and Vulnerabilities in LLMs-as-Judges](https://arxiv.org/abs/2406.12624)
- 关键结论：
  - judge 对 prompt 复杂度、长度和评分尺度敏感
  - 高 percent agreement 不代表真的对齐人类
- 我们采用的设计：
  - 限制 judge 输出格式
  - 引入 `confidence`、`evidence_sufficiency`、`human_review_recommended`
  - 不把单个百分比或单次评分当成客观真相

## 6. Investigating Non-Transitivity in LLM-as-a-Judge

- 论文：[Investigating Non-Transitivity in LLM-as-a-Judge](https://arxiv.org/abs/2502.14074)
- 关键结论：
  - pairwise preference 可能不满足传递性
  - round-robin + Bradley-Terry 比单一 baseline 更稳
- 我们采用的设计：
  - leaderboard 或多系统比较时，优先 round-robin
  - close A/B 不能只看一次 pairwise
  - 若顺序交换后结论翻转，直接降 confidence

## 7. VBench

- 论文：[VBench: Comprehensive Benchmark Suite for Video Generative Models](https://arxiv.org/abs/2311.17982)
- 关键结论：
  - 视频质量应拆成分层、解耦维度
  - 好 benchmark 要让系统知道自己究竟在哪个维度弱
- 我们采用的设计：
  - 评测维度拆成独立项
  - case pack 按能力覆盖，而不是只堆不同题材

## 8. FETV

- 论文：[FETV: A Benchmark for Fine-Grained Evaluation of Open-Domain Text-to-Video Generation](https://arxiv.org/abs/2311.01813)
- 关键结论：
  - prompt 集必须覆盖 `major content / attributes / complexity / temporal categories`
  - 自动指标与人类并不天然对齐
- 我们采用的设计：
  - case pack 增加复杂度与时间结构标签
  - 区分静镜、转场、reveal、dialogue、action 等 temporal types

## 9. T2V-CompBench

- 论文：[T2V-CompBench: A Comprehensive Benchmark for Compositional Text-to-video Generation](https://arxiv.org/abs/2407.14505)
- 关键结论：
  - 组合性能力不能被总分掩盖
  - attribute binding、spatial relationship、motion binding、object interaction、numeracy 必须单独测
- 我们采用的设计：
  - case matrix 单列组合性 case
  - judge 报告里允许明确标记 compositional failures

## 10. VideoScore

- 论文：[VideoScore: Building Automatic Metrics to Simulate Fine-grained Human Feedback for Video Generation](https://arxiv.org/abs/2406.15252)
- 关键结论：
  - 视频评测至少要看：视觉质量、时间一致性、动态程度、文本对齐、事实/常识一致性
  - 细粒度 human feedback 比单一“整体观感”更有用
- 我们采用的设计：
  - rubric 显式覆盖 temporal consistency、editorial value、style stability
  - diversified case pack 会补 physics/commonsense 与 compositional cases

## 结论

本系统的核心方法论是：

1. `rubric-based`
2. `pointwise-first`
3. `jury-over-single-judge`
4. `evidence-required`
5. `diverse-case-matrix`
6. `human-calibrated-when-possible`

如果某次评测违背了上面任一条，就不应被视为高置信度结论。
