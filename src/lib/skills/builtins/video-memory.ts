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
- \`video_memory__record_feedback\`：记录偏好反馈（支持正负权重）
- \`video_memory__clear_memory\`：清空某个 memory user 的长期记忆

## 建议用法

1. 初始化前先读 \`recommend_defaults\`，把结果用于默认查询词和风格约束
2. 用户确认风格后调用 \`record_feedback\`（eventType=style_profile_saved）
3. 用户应用风格档案后调用 \`record_feedback\`（eventType=style_profile_applied）
4. 用户明确不满意时用负权重记录（strength < 0）
`;
