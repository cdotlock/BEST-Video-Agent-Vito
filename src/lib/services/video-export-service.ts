import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { z } from "zod";
import type {
  ClipAudioTrackInput,
  ClipPlanItemInput,
  ClipTransition,
} from "@/lib/services/video-composition-service";

const FfprobeOutputSchema = z.object({
  streams: z.array(
    z.object({
      codec_type: z.string().optional(),
    }),
  ).optional(),
});

interface NormalizedClipInput {
  id: string;
  title: string;
  url: string;
  durationSec: number;
  inSec: number;
  transition: ClipTransition;
  audioEnabled: boolean;
  audioVolume: number;
}

interface NormalizedAudioTrackInput {
  id: string;
  title: string;
  url: string;
  startSec: number;
  sourceInSec: number;
  durationSec: number;
  volume: number;
}

interface TransitionSpec {
  ffmpegName: string;
  durationSec: number;
}

export interface ExportClipPlanInput {
  planName: string;
  clips: ClipPlanItemInput[];
  audioTracks?: ClipAudioTrackInput[];
}

export interface ExportClipPlanResult {
  buffer: Buffer;
  durationSec: number;
  fileName: string;
  mimeType: "video/mp4";
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function clipDurationSec(clip: { inSec: number; outSec: number }): number {
  return Number(Math.max(0, clip.outSec - clip.inSec).toFixed(3));
}

function transitionSpecFor(transition: ClipTransition): TransitionSpec {
  switch (transition) {
    case "fade":
      return { ffmpegName: "fade", durationSec: 0.42 };
    case "dissolve":
      return { ffmpegName: "dissolve", durationSec: 0.5 };
    case "wipe_left":
      return { ffmpegName: "wipeleft", durationSec: 0.48 };
    case "fade_black":
      return { ffmpegName: "fadeblack", durationSec: 0.55 };
    case "cut":
    case "none":
    default:
      return { ffmpegName: "fade", durationSec: 0.001 };
  }
}

function boundedTransitionDuration(
  transition: ClipTransition,
  previousClipDurationSec: number,
  nextClipDurationSec: number,
): number {
  const spec = transitionSpecFor(transition);
  if (spec.durationSec <= 0.001) return 0.001;
  return Number(
    clamp(
      spec.durationSec,
      0.001,
      Math.max(
        0.001,
        Math.min(previousClipDurationSec * 0.45, nextClipDurationSec * 0.45),
      ),
    ).toFixed(3),
  );
}

function sanitizeFileName(input: string): string {
  const normalized = input
    .trim()
    .replace(/[^\w\u4e00-\u9fa5.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized.length > 0 ? normalized : "clip-export";
}

function formatSeconds(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function runBinary(binary: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ["ignore", "pipe", "pipe"] });
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdoutChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    child.stderr.on("data", (chunk: Buffer | string) => {
      stderrChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    child.on("error", (error) => {
      const code = typeof error === "object"
        && error !== null
        && "code" in error
        && typeof error.code === "string"
        ? error.code
        : null;
      if (code === "ENOENT") {
        reject(new Error(`缺少运行时依赖：${binary}`));
        return;
      }
      reject(error);
    });
    child.on("close", (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8");
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      const details = stderr.trim().split("\n").slice(-8).join("\n");
      reject(new Error(details.length > 0 ? details : `${binary} exited with code ${code ?? -1}`));
    });
  });
}

async function probeHasAudio(url: string): Promise<boolean> {
  try {
    const { stdout } = await runBinary("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "stream=codec_type",
      "-of",
      "json",
      url,
    ]);
    const parsed = FfprobeOutputSchema.parse(JSON.parse(stdout));
    return (parsed.streams ?? []).some((stream) => stream.codec_type === "audio");
  } catch {
    return false;
  }
}

function normalizeClipInputs(clips: ClipPlanItemInput[]): NormalizedClipInput[] {
  return clips.map((clip, index) => {
    if (!clip.url) {
      throw new Error(`片段 #${index + 1} 缺少可导出的视频 URL。`);
    }
    const durationSec = clipDurationSec(clip);
    if (durationSec <= 0) {
      throw new Error(`片段 #${index + 1} 的时长无效。`);
    }
    return {
      id: clip.id?.trim() || `clip_${index + 1}`,
      title: clip.title?.trim() || `片段 ${index + 1}`,
      url: clip.url,
      durationSec,
      inSec: clip.inSec,
      transition: clip.transition,
      audioEnabled: clip.audioEnabled ?? true,
      audioVolume: clamp(clip.audioVolume ?? 100, 0, 200),
    };
  });
}

function normalizeAudioTrackInputs(audioTracks: ClipAudioTrackInput[]): NormalizedAudioTrackInput[] {
  return audioTracks
    .filter((track) => !track.muted && (track.url?.trim().length ?? 0) > 0)
    .map((track, index) => {
      const sourceInSec = clamp(track.sourceInSec, 0, Number.MAX_SAFE_INTEGER);
      const sourceOutSec = clamp(track.sourceOutSec, sourceInSec, Number.MAX_SAFE_INTEGER);
      const durationSec = Number((sourceOutSec - sourceInSec).toFixed(3));
      if (!track.url) {
        throw new Error(`音频轨 #${index + 1} 缺少 URL。`);
      }
      if (durationSec <= 0) {
        throw new Error(`音频轨 #${index + 1} 的时长无效。`);
      }
      return {
        id: track.id?.trim() || `audio_${index + 1}`,
        title: track.title?.trim() || `音频轨 ${index + 1}`,
        url: track.url,
        startSec: clamp(track.startSec, 0, Number.MAX_SAFE_INTEGER),
        sourceInSec,
        durationSec,
        volume: clamp(track.volume ?? 100, 0, 200),
      };
    });
}

export async function exportClipPlanToMp4(
  input: ExportClipPlanInput,
): Promise<ExportClipPlanResult> {
  const clips = normalizeClipInputs(input.clips);
  if (clips.length === 0) {
    throw new Error("请先至少保留一个可导出的视频片段。");
  }

  const audioTracks = normalizeAudioTrackInputs(input.audioTracks ?? []);
  const [clipAudioFlags, audioTrackFlags] = await Promise.all([
    Promise.all(clips.map(async (clip) => probeHasAudio(clip.url))),
    Promise.all(audioTracks.map(async (track) => probeHasAudio(track.url))),
  ]);

  const validAudioTracks = audioTracks.filter((_, index) => audioTrackFlags[index]);
  const hasClipAudio = clips.some((clip, index) => clip.audioEnabled && clip.audioVolume > 0 && clipAudioFlags[index]);

  const tempDir = await mkdtemp(path.join(tmpdir(), "clip-export-"));
  const outputPath = path.join(tempDir, `${randomUUID()}.mp4`);

  try {
    const inputArgs: string[] = [];
    for (const clip of clips) {
      inputArgs.push("-ss", formatSeconds(clip.inSec));
      inputArgs.push("-t", formatSeconds(clip.durationSec));
      inputArgs.push("-i", clip.url);
    }
    for (const track of validAudioTracks) {
      inputArgs.push("-ss", formatSeconds(track.sourceInSec));
      inputArgs.push("-t", formatSeconds(track.durationSec));
      inputArgs.push("-i", track.url);
    }

    const filterParts: string[] = [];
    const pairTransitionDurations: number[] = [];

    clips.forEach((clip, index) => {
      filterParts.push(
        `[${index}:v]scale=1280:720:force_original_aspect_ratio=decrease,` +
          "pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=30,format=yuv420p,setpts=PTS-STARTPTS" +
          `[v${index}]`,
      );
    });

    let currentVideoLabel = "v0";
    let outputDurationSec = clips[0]?.durationSec ?? 0;
    for (let index = 1; index < clips.length; index += 1) {
      const previousClip = clips[index - 1];
      const currentClip = clips[index];
      if (!previousClip || !currentClip) continue;
      const spec = transitionSpecFor(currentClip.transition);
      const overlap = boundedTransitionDuration(
        currentClip.transition,
        previousClip.durationSec,
        currentClip.durationSec,
      );
      pairTransitionDurations.push(overlap);
      const offset = Number(Math.max(outputDurationSec - overlap, 0).toFixed(3));
      filterParts.push(
        `[${currentVideoLabel}][v${index}]xfade=transition=${spec.ffmpegName}:duration=${formatSeconds(overlap)}:offset=${formatSeconds(offset)}` +
          `[vx${index}]`,
      );
      currentVideoLabel = `vx${index}`;
      outputDurationSec = Number((outputDurationSec + currentClip.durationSec - overlap).toFixed(3));
    }

    let clipAudioLabel: string | null = null;
    if (hasClipAudio) {
      clips.forEach((clip, index) => {
        if (clip.audioEnabled && clip.audioVolume > 0 && clipAudioFlags[index]) {
          filterParts.push(
            `[${index}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${(clip.audioVolume / 100).toFixed(3)}[ca${index}]`,
          );
          return;
        }
        filterParts.push(
          `anullsrc=r=48000:cl=stereo,atrim=duration=${formatSeconds(clip.durationSec)}[ca${index}]`,
        );
      });

      clipAudioLabel = "ca0";
      for (let index = 1; index < clips.length; index += 1) {
        const overlap = pairTransitionDurations[index - 1] ?? 0.001;
        if (overlap > 0.01) {
          filterParts.push(
            `[${clipAudioLabel}][ca${index}]acrossfade=d=${formatSeconds(overlap)}:c1=tri:c2=tri[cam${index}]`,
          );
        } else {
          filterParts.push(
            `[${clipAudioLabel}][ca${index}]concat=n=2:v=0:a=1[cam${index}]`,
          );
        }
        clipAudioLabel = `cam${index}`;
      }
    }

    const mixedAudioLabels: string[] = [];
    if (clipAudioLabel) {
      mixedAudioLabels.push(clipAudioLabel);
    }

    validAudioTracks.forEach((track, index) => {
      const inputIndex = clips.length + index;
      const delayMs = Math.max(0, Math.round(track.startSec * 1000));
      filterParts.push(
        `[${inputIndex}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${(track.volume / 100).toFixed(3)},` +
          `adelay=${delayMs}|${delayMs}[bg${index}]`,
      );
      mixedAudioLabels.push(`bg${index}`);
    });

    let finalAudioLabel: string | null = null;
    if (mixedAudioLabels.length === 1) {
      finalAudioLabel = mixedAudioLabels[0] ?? null;
    } else if (mixedAudioLabels.length > 1) {
      finalAudioLabel = "aout";
      filterParts.push(
        `${mixedAudioLabels.map((label) => `[${label}]`).join("")}amix=inputs=${mixedAudioLabels.length}:duration=longest:normalize=0[aout]`,
      );
    }

    const ffmpegArgs = [
      "-y",
      ...inputArgs,
      "-filter_complex",
      filterParts.join(";"),
      "-map",
      `[${currentVideoLabel}]`,
      ...(finalAudioLabel ? ["-map", `[${finalAudioLabel}]`] : ["-an"]),
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      ...(finalAudioLabel
        ? [
            "-c:a",
            "aac",
            "-ar",
            "48000",
            "-b:a",
            "192k",
            "-shortest",
          ]
        : []),
      "-movflags",
      "+faststart",
      outputPath,
    ];

    await runBinary("ffmpeg", ffmpegArgs);
    const buffer = await readFile(outputPath);

    return {
      buffer,
      durationSec: outputDurationSec,
      fileName: `${sanitizeFileName(input.planName)}.mp4`,
      mimeType: "video/mp4",
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
