# Langfuse Prompt Baseline

- Snapshot date: `2026-03-04`
- Purpose: one-time baseline import from Langfuse for internal prompt refactor.
- Runtime policy: the system **does not** depend on Langfuse at runtime. This folder is offline reference data only.

## Files

- `prompts.page1.json`: prompt list response snapshot (`/api/public/v2/prompts?limit=100&page=1`)
- `prompts.full.json`: full prompt payloads by name (`/api/public/v2/prompts/{name}`)
- `prompt-index.md`: name/version/labels summary for fast review

## Refactor Rule

When rewriting built-in prompt strategy:

1. Use this baseline as semantic source.
2. Move reusable logic into internal skills + memory-driven prompt layering.
3. Do not reintroduce Langfuse MCP/provider/runtime dependency.
