/**
 * Built-in Skill: video-mgr
 *
 * 标准 SKILL.md 格式（YAML frontmatter + Markdown body）以字符串形式内嵌。
 * 由 builtins/index.ts 统一加载解析。
 */
export const raw = `---
name: video-mgr
description: Generate images and videos via FC (Function Compute) multimodal services. Use when asked to create, generate, or produce images or videos.
tags:
  - core
  - video-core
  - multimodal
  - image
  - video
requires_mcps:
  - video_mgr
---
# 多模态生成服务（video-mgr）

## 工具语义（参数结构见 tool schema）

### generate_image — 文生图（带生命周期管理）

每次调用记录 prompt、URL 和版本历史。同一 key 再次调用会创建新版本而非新图片。生成成功后系统自动写入 domain_resources，无需手动 INSERT。

- \`key\` — 语义唯一标识。命名规范：\`char_{name}_portrait\`、\`scene_{n}_bg\`、\`shot_{scene}_{shot}\`、\`costume_{name}_{ep}\`，其他用描述性英文下划线连接
- \`category\` — 自由命名（如 \`角色立绘\`、\`场景\`、\`分镜\`），决定 UI 资源面板分组
- \`scopeType\` — 项目全局资源用 \`"project"\`，序列级资源用 \`"sequence"\`
- \`scopeId\` — 从上下文取对应的 project_id 或 sequence_id

**重要**：生成前检查 Image Registry，key 已存在且满足需求则无需重复生成。

**示例**：

\\\`\\\`\\\`json
{ "items": [{ "key": "char_alice_portrait", "prompt": "一个穿着蓝色连衣裙的少女站在樱花树下，动漫风格，高清", "category": "角色立绘", "scopeType": "project", "scopeId": "project-uuid-here", "title": "Alice" }] }
\\\`\\\`\\\`

### generate_video — 策略化视频生成/存储

支持策略：

- \`prompt_only\`：仅存储视频 prompt
- \`first_frame\`：首帧图生视频
- \`first_last_frame\`：首尾帧受控图生视频
- \`mixed_refs\`：图/视频混合参考（以图参考为主，视频参考作为语义约束）

无论是否实际生成视频，都会写入 domain_resources（mediaType=video）并保留完整参数快照，便于复盘与再生。

### generate_storyboard_grid — 四宫格/九宫格分镜

输入 \`layout=grid_2x2|grid_3x3\` 和 cell prompts：

1. 每个 cell 自动调用文生图
2. 生成后自动保存网格计划 JSON（type=storyboard_grid）
3. 可作为后续图生视频参考资产

### save_clip_plan — 最简剪辑计划

保存片段排序与转场参数（type=clip_plan）：

1. 片段顺序
2. in/out 秒数
3. 转场（none/cut/fade）

该计划用于后续拼接执行，不等同于重型时间线编辑器。

### Image Registry

上下文自动注入 \`## Image Registry\`，列出当前 session 所有图片的最新状态。

- 用户可能通过 UI 修改 prompt、重新生成或回滚版本，这些操作会以 \`[系统通知]\` 形式出现在对话中
- 看到 \`[系统通知]\` 时，以 Image Registry 中的最新状态为准

`;
