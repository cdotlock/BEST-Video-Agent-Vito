# Prompt Migration Plan (From Langfuse Baseline)

## Goal

Use Langfuse snapshot prompts as semantic baseline, then move to internal `skills + memory` prompt pipeline.

## Name Mapping

| Langfuse Prompt | Internal Target |
|---|---|
| `common__style__prompt` / `common__portrait_style__prompt` | `Style Layer` defaults in video context + memory hints |
| `common__gen_scenery_shot__prompt` | internal scene-scaffold prompt template (for empty-shot/storyboard generation) |
| `intro__gen_scene__image_prompt` / `live2d__gen_scene__image_prompt` | internal image-director template (`mode=image`) |
| `intro__gen_scene__video_prompt` / `live2d__gen_scene__video_prompt` | internal video-director template (`mode=video`) |
| `common__md2json` | keep as structured-output schema task in `subagent__run_text` with `outputSchema` |
| `*_image` / `*_video` concrete render prompts | merge into `Task Layer` assembly in agent runtime |

## Implementation Rules

1. Keep runtime dependency-free: no Langfuse provider, no external compile step.
2. Move reusable prompt logic into:
   - built-in skills (`style-search`, `video-memory`, `video-mgr`, `subagent`)
   - memory-driven prompt enrichment (`video_memory__optimize_prompt`)
3. Preserve old prompt intent, but normalize wording for generic (non-novel-only) video workflow.
