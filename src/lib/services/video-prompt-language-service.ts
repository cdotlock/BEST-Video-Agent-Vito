function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }
  return output;
}

export function truncatePromptText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const sliced = value.slice(0, maxLength);
  const boundary = Math.max(
    sliced.lastIndexOf(" "),
    sliced.lastIndexOf(","),
    sliced.lastIndexOf("，"),
    sliced.lastIndexOf(";"),
    sliced.lastIndexOf("；"),
  );
  const cutoff = boundary >= Math.floor(maxLength * 0.6) ? boundary : maxLength;
  return `${sliced.slice(0, cutoff).trimEnd()}...`;
}

export function normalizePromptFragment(value: string): string {
  return normalizeWhitespace(value).replace(/[。.!?；;：:,，]+$/u, "");
}

export function compactPromptLine(input: {
  label: string;
  values: Array<string | null | undefined>;
  maxLength?: number;
}): string {
  const parts = dedupe(
    input.values
      .map((value) => (typeof value === "string" ? normalizePromptFragment(value) : ""))
      .filter((value) => value.length > 0),
  );
  if (parts.length === 0) return "";
  const maxLength = input.maxLength ?? 260;
  return `${input.label}：${truncatePromptText(parts.join("；"), maxLength)}。`;
}

export function compressDialogueContext(value: string | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  const lines = normalized
    .split(/\r?\n/u)
    .map((line) => normalizeWhitespace(line))
    .filter((line) => line.length > 0);

  const sceneGoal = lines.find((line) => line.startsWith("scene_goal="));
  const dialogueLines = lines
    .filter((line) => /^\d+\.\s/u.test(line))
    .slice(0, 3)
    .map((line) => truncatePromptText(line.replace(/^\d+\.\s/u, ""), 96));

  const parts = [
    sceneGoal ? truncatePromptText(sceneGoal, 96) : null,
    dialogueLines.length > 0 ? `dialogue=${dialogueLines.join(" | ")}` : null,
  ].filter((part): part is string => part !== null);

  if (parts.length === 0) {
    return truncatePromptText(normalizeWhitespace(normalized), 220);
  }

  return truncatePromptText(parts.join("; "), 320);
}
