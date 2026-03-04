# 短期目标

> 唯一规划文件。所有条目完成前不得开发新功能。
> 完成后删除该条目并提交。新需求追加到末尾。

- [x] Phase A: 自进化多路径视频能力（先文档后实现）
  - [x] A1. PRD 增补：自进化路径引擎、分镜拼图（4/9宫格）、首帧/首尾帧生视频、图/视频混合参考、多段视频拼接
  - [x] A2. MCP/Skills 原子化实现：新增路径规划/评审、分镜拼图、多参考生图/生视频、拼接方案工具
  - [x] A3. 记忆与流程进化：路径推荐 + 路径评审写回长期记忆
  - [x] A4. API playbook/useCase 同步

- [x] Phase B: UIUX 全量重塑（先文档后实现）
  - [x] B1. UIUX 文档重写为可落地规格（信息架构、状态、文案、交互细节、移动端、验收标准）
  - [x] B2. `/video` 与 `/video/[projectId]` 全量改版为白色高可用工作台
  - [x] B3. 新手引导（首次上手 4 步）与空态/错误引导完善
  - [x] B4. 最简单剪辑功能（多视频片段排序、时长/转场、保存拼接方案）
  - [x] B5. README 更新：详述本版本能力与使用流程

- [x] Phase C: 移除 Langfuse 依赖并内置化 Prompt 优化
  - [x] C1. 清理 Langfuse MCP/provider/skills 的默认加载与文案耦合
  - [x] C2. 用内置 `video_memory` 提供 prompt 优化与记录能力（不依赖外部 prompt 平台）
  - [x] C3. 同步更新 `.env.example` 与 `docs/api-playbook.md` / `docs/PRD.md`
  - [x] C4. 一次性拉取 Langfuse 现有 prompt 快照，沉淀到 docs 基线供后续内置 prompt 改造
