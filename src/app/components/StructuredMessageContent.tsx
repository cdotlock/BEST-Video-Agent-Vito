"use client";

import {
  AuditOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  DeploymentUnitOutlined,
  FileSearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import { MarkdownContent } from "./MarkdownContent";

type StructuredBlockType =
  | "director_note"
  | "alignment_block"
  | "plan_block"
  | "material_block"
  | "review_block"
  | "tool_receipt";

interface StructuredSegment {
  type: "markdown" | "block";
  blockType?: StructuredBlockType;
  title?: string | null;
  content: string;
}

const BLOCK_CONFIG: Record<
  StructuredBlockType,
  {
    label: string;
    tagColor: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  director_note: {
    label: "Director Note",
    tagColor: "gold",
    className: "director-block director-block--note",
    icon: <CompassOutlined />,
  },
  alignment_block: {
    label: "Alignment",
    tagColor: "orange",
    className: "director-block director-block--alignment",
    icon: <DeploymentUnitOutlined />,
  },
  plan_block: {
    label: "Plan",
    tagColor: "green",
    className: "director-block director-block--plan",
    icon: <CheckCircleOutlined />,
  },
  material_block: {
    label: "Materials",
    tagColor: "blue",
    className: "director-block director-block--material",
    icon: <FileSearchOutlined />,
  },
  review_block: {
    label: "Review",
    tagColor: "cyan",
    className: "director-block director-block--review",
    icon: <AuditOutlined />,
  },
  tool_receipt: {
    label: "Tool Receipt",
    tagColor: "default",
    className: "director-block director-block--receipt",
    icon: <ToolOutlined />,
  },
};

function parseStructuredHeading(
  line: string,
): { blockType: StructuredBlockType; title: string | null } | null {
  const match = line.trim().match(
    /^#{1,6}\s*(director_note|alignment_block|plan_block|material_block|review_block|tool_receipt)\b(?:\s*[-:：]\s*(.+))?$/i,
  );
  if (!match) return null;
  const candidate = match[1]?.toLowerCase();
  if (
    candidate !== "director_note"
    && candidate !== "alignment_block"
    && candidate !== "plan_block"
    && candidate !== "material_block"
    && candidate !== "review_block"
    && candidate !== "tool_receipt"
  ) {
    return null;
  }
  const title = match[2]?.trim();
  return {
    blockType: candidate,
    title: title && title.length > 0 ? title : null,
  };
}

function parseStructuredSegments(content: string): StructuredSegment[] {
  const lines = content.split(/\r?\n/);
  const segments: StructuredSegment[] = [];
  let currentType: "markdown" | "block" | null = null;
  let currentBlockType: StructuredBlockType | undefined;
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentType) return;
    const text = currentLines.join("\n").trim();
    if (!text) {
      currentType = null;
      currentBlockType = undefined;
      currentTitle = null;
      currentLines = [];
      return;
    }
    segments.push({
      type: currentType,
      blockType: currentBlockType,
      title: currentTitle,
      content: text,
    });
    currentType = null;
    currentBlockType = undefined;
    currentTitle = null;
    currentLines = [];
  };

  for (const line of lines) {
    const heading = parseStructuredHeading(line);
    if (heading) {
      flush();
      currentType = "block";
      currentBlockType = heading.blockType;
      currentTitle = heading.title;
      continue;
    }

    if (!currentType) {
      currentType = "markdown";
      currentBlockType = undefined;
      currentTitle = null;
    }
    currentLines.push(line);
  }

  flush();
  return segments;
}

export interface StructuredMessageContentProps {
  content: string;
}

export function StructuredMessageContent({
  content,
}: StructuredMessageContentProps) {
  const segments = parseStructuredSegments(content);
  const hasBlocks = segments.some((segment) => segment.type === "block");

  if (!hasBlocks) {
    return (
      <MarkdownContent
        content={content}
        className="text-[13px] leading-7 text-[var(--af-text)]"
      />
    );
  }

  return (
    <div className="space-y-3">
      {segments.map((segment, index) => {
        if (segment.type === "markdown" || !segment.blockType) {
          return (
            <MarkdownContent
              key={`markdown-${index}`}
              content={segment.content}
              className="text-[13px] leading-7 text-[var(--af-text)]"
            />
          );
        }

        const config = BLOCK_CONFIG[segment.blockType];
        return (
          <Card
            key={`${segment.blockType}-${index}`}
            size="small"
            className={config.className}
            styles={{ body: { padding: 14 } }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Tag color={config.tagColor} icon={config.icon} style={{ margin: 0 }}>
                  {config.label}
                </Tag>
                {segment.title ? (
                  <Typography.Text className="truncate text-[12px] text-[var(--af-muted)]">
                    {segment.title}
                  </Typography.Text>
                ) : null}
              </div>
            </div>
            <MarkdownContent
              content={segment.content}
              className="text-[13px] leading-7 text-[var(--af-text)]"
            />
          </Card>
        );
      })}
    </div>
  );
}
