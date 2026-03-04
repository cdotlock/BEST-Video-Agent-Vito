import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types";
import {
  type McpProvider,
  type ToolContext,
  qualifyToolName,
  parseToolName,
} from "./types";
import { sessionMcpTracker } from "./session-tracker";

/**
 * MCP Registry — global singleton.
 * Aggregates tools from all registered McpProviders (static + dynamic)
 * and dispatches tool calls.
 */
class McpRegistry {
  private providers = new Map<string, McpProvider>();
  private protectedNames = new Set<string>();
  initialized = false;

  private toAllowedSet(context?: ToolContext): Set<string> | null {
    if (!context?.allowedMcpNames || context.allowedMcpNames.length === 0) {
      return null;
    }
    return new Set(context.allowedMcpNames);
  }

  private isVisibleForContext(
    providerName: string,
    context?: ToolContext,
    allowed?: Set<string> | null,
  ): boolean {
    if (allowed && !allowed.has(providerName)) return false;
    if (context?.sessionId && !sessionMcpTracker.isVisible(context.sessionId, providerName)) {
      return false;
    }
    return true;
  }

  register(provider: McpProvider): void {
    if (this.providers.has(provider.name)) {
      throw new Error(`MCP provider "${provider.name}" already registered`);
    }
    this.providers.set(provider.name, provider);
  }

  /** Mark a provider name as protected (cannot be replaced or unregistered by custom code). */
  protect(name: string): void {
    this.protectedNames.add(name);
  }

  /** Check if a provider name is protected (core or catalog). */
  isProtected(name: string): boolean {
    return this.protectedNames.has(name);
  }

  unregister(name: string): void {
    if (this.protectedNames.has(name)) {
      throw new Error(`Cannot unregister protected MCP provider "${name}"`);
    }
    this.providers.delete(name);
  }

  /** Replace (or register) a provider by name. Cannot replace protected providers. */
  replace(provider: McpProvider): void {
    if (this.protectedNames.has(provider.name)) {
      throw new Error(`Cannot replace protected MCP provider "${provider.name}"`);
    }
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): McpProvider | undefined {
    return this.providers.get(name);
  }

  listProviders(): McpProvider[] {
    return [...this.providers.values()];
  }

  /**
   * Collect all tools from every provider.
   * Tool names are qualified: `providerName__toolName`.
   */
  async listAllTools(context?: ToolContext): Promise<Tool[]> {
    const allowed = this.toAllowedSet(context);
    const all: Tool[] = [];
    for (const provider of this.providers.values()) {
      if (!this.isVisibleForContext(provider.name, context, allowed)) continue;
      const tools = await provider.listTools();
      for (const tool of tools) {
        all.push({
          ...tool,
          name: qualifyToolName(provider.name, tool.name),
        });
      }
    }
    return all;
  }

  /**
   * Dispatch a tool call by its fully-qualified name.
   */
  async callTool(
    fullToolName: string,
    args: Record<string, unknown>,
    context?: ToolContext,
  ): Promise<CallToolResult> {
    const [providerName, toolName] = parseToolName(fullToolName);
    const provider = this.providers.get(providerName);
    if (!provider) {
      return {
        content: [{ type: "text", text: `Unknown MCP provider: ${providerName}` }],
        isError: true,
      };
    }
    const allowed = this.toAllowedSet(context);
    if (!this.isVisibleForContext(providerName, context, allowed)) {
      return {
        content: [{ type: "text", text: `MCP provider "${providerName}" is not available in this context` }],
        isError: true,
      };
    }
    try {
      return await provider.callTool(toolName, args, context);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Tool error: ${message}` }],
        isError: true,
      };
    }
  }
}

// Global singleton (survives HMR in Next.js dev)
const globalForRegistry = globalThis as unknown as {
  mcpRegistry: McpRegistry | undefined;
};

export const registry =
  globalForRegistry.mcpRegistry ?? new McpRegistry();

globalForRegistry.mcpRegistry = registry;
