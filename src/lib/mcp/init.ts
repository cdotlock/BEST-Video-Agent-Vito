import { registry } from "./registry";
import { skillsMcp } from "./static/skills-mcp";
import { mcpManagerMcp } from "./static/mcp-manager";
import { uiMcp } from "./static/ui";
import { memoryMcp } from "./static/memory";
import { subagentMcp } from "./static/subagent";
import { bizDbReady } from "@/lib/biz-db";

/**
 * Register core MCP providers + system dependencies.
 * Core: skills + mcp_manager + ui + memory — always active, protected.
 * System dependency: subagent — used by prompt-specialized or multimodal skills.
 * Business MCPs (biz_db, oss, video_mgr, etc.) are loaded on-demand via mcp_manager__load.
 * Safe to call multiple times — only runs once (guarded by registry.initialized).
 */
export async function initMcp(): Promise<void> {
  if (registry.initialized) return;
  registry.initialized = true;

  // Ensure the biz database exists before any tools can use it
  await bizDbReady;

  // Core providers — always active, protected from custom override
  registry.register(skillsMcp);
  registry.register(mcpManagerMcp);
  registry.register(uiMcp);
  registry.register(memoryMcp);

  registry.protect(skillsMcp.name);
  registry.protect(mcpManagerMcp.name);
  registry.protect(uiMcp.name);
  registry.protect(memoryMcp.name);

  // System dependency — auto-loaded on startup
  registry.register(subagentMcp);
}
