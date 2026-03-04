/**
 * Built-in Skill: video-memory
 */
export const raw = `---
name: video-memory
description: Record and retrieve long-term style preferences for a memory user.
tags:
  - core
  - video-core
  - memory
requires_mcps:
  - video_memory
---
# 长期记忆（video-memory）

默认开启长期记忆。每次风格确认、风格应用、生成反馈都应写入记忆。

## 工具

- \`video_memory__recommend_defaults\`：读取默认偏好（style tokens / providers / prompt hints）
- \`video_memory__recommend_paths\`：基于长期记忆 + 当前目标推荐流程路径（含分镜密度/视频策略/拼接策略）
- \`video_memory__record_feedback\`：记录偏好反馈（支持正负权重）
- \`video_memory__review_path\`：写回流程路径评审结果（score=-2~2）
- \`video_memory__optimize_prompt\`：基于长期记忆优化 prompt，并可自动记录优化事件
- \`video_memory__clear_memory\`：清空某个 memory user 的长期记忆

## 建议用法

1. 初始化前先读 \`recommend_defaults\`，把结果用于默认查询词和风格约束
2. 进入生成阶段前调用 \`recommend_paths\`，优先使用 Top 推荐路径
3. 生成前先调 \`optimize_prompt\`，把 memory 中沉淀的 prompt 偏好拼入当前任务
4. 用户确认风格后调用 \`record_feedback\`（eventType=style_profile_saved）
5. 用户应用风格档案后调用 \`record_feedback\`（eventType=style_profile_applied）
6. 阶段结束调用 \`review_path\` 写回路径效果（eventType=workflow_path_review）
7. 用户明确不满意时用负权重记录（strength < 0）
`;
