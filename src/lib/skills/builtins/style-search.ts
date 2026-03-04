/**
 * Built-in Skill: style-search
 */
export const raw = `---
name: style-search
description: Search public gallery references and reverse-engineer reusable style profiles before generation.
tags:
  - core
  - video-core
  - style
  - image
requires_mcps:
  - style_search
---
# 风格初始化（style-search）

在开始生成前，优先完成这条链路：

1. 
\`style_search__search_images\` 搜索公共图库参考图（Unsplash / Pexels / Pixabay）
2. 挑选 3-8 张最贴合目标风格的图
3. \`style_search__analyze_references\` 反推 style tokens + 正负 prompt，并保存为 profile
4. 后续所有图像/视频生成都复用该 profile 的风格约束

## 执行策略

- 如果是 \`Checkpoint\` 模式：先给出候选图 + 反推摘要，等待用户确认后再进入大规模生成
- 如果是 \`YOLO\` 模式：直接完成搜索 + 反推 + profile 保存，然后继续推进生成，不做中间确认

## 参数建议

- \`search_images.query\`：风格词 + 内容词 + 镜头词，例如：
  - \`cinematic cyberpunk rainy street night\`
  - \`minimal japanese interior soft daylight\`
- \`analyze_references.profileName\`：用可复用命名（如 \`brand_launch_clean_v1\`）
- \`analyze_references.creativeGoal\`：写清最终用途（广告片头、分镜图、角色设定）

## 输出要求

调用 \`analyze_references\` 后，在回复里明确给出：

- style tokens（5-10 个）
- positive prompt
- negative prompt
- 是否已保存 profile（profile id）

后续使用 \`video_mgr\` 生成时，把 style prompt 作为稳定约束拼进每条 prompt。
`;
