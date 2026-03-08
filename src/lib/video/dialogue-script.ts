import { z } from "zod";

export const DialogueLineSchema = z.object({
  character: z.string().min(1),
  line: z.string().min(1),
  emotion: z.string().min(1).optional(),
  durationSec: z.number().positive().optional(),
});

export const DialogueScriptDataSchema = z.object({
  type: z.literal("dialogue_script"),
  key: z.string().min(1),
  sceneGoal: z.string().nullable().optional(),
  lines: z.array(DialogueLineSchema).min(1),
}).passthrough();

export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type DialogueScriptData = z.infer<typeof DialogueScriptDataSchema>;

export function parseDialogueScriptData(data: unknown): DialogueScriptData | null {
  const parsed = DialogueScriptDataSchema.safeParse(data);
  if (!parsed.success) return null;
  return parsed.data;
}

export function buildDialogueContextText(script: DialogueScriptData): string {
  const header = script.sceneGoal?.trim()
    ? `scene_goal=${script.sceneGoal.trim()}`
    : "scene_goal=follow current story beat";
  const lines = script.lines.map((line, index) => {
    const emotion = line.emotion?.trim() ? ` emotion=${line.emotion.trim()}` : "";
    const duration = typeof line.durationSec === "number" ? ` duration=${line.durationSec.toFixed(1)}s` : "";
    return `${index + 1}. ${line.character}: ${line.line}${emotion}${duration}`;
  });
  return [header, ...lines].join("\n");
}

export function summarizeDialogueLines(script: DialogueScriptData): string {
  return script.lines
    .map((line) => `${line.character}: ${line.line}`)
    .join(" / ")
    .slice(0, 320);
}
