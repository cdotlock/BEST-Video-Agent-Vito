"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJson } from "@/app/components/client-utils";
import type {
  SequenceSummary,
  DomainResources,
} from "../types";

export interface UseVideoDataReturn {
  sequences: SequenceSummary[];
  isLoadingSequences: boolean;
  isUploading: boolean;
  selectedSequence: SequenceSummary | null;
  selectSequence: (seq: SequenceSummary | null) => void;
  resources: DomainResources | null;
  isLoadingResources: boolean;
  refreshSequences: () => Promise<SequenceSummary[]>;
  refreshResources: () => Promise<void>;
  refreshAll: () => Promise<void>;
  uploadSequence: (sequenceKey: string, sequenceName: string | null, content: string | null) => Promise<void>;
  deleteSequence: (sequenceId: string) => Promise<void>;
  error: string | null;
  setError: (e: string | null) => void;
}

export function useVideoData(projectId: string): UseVideoDataReturn {
  const [sequences, setSequences] = useState<SequenceSummary[]>([]);
  const [isLoadingSequences, setIsLoadingSequences] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<SequenceSummary | null>(null);
  const [resources, setResources] = useState<DomainResources | null>(null);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSequences = useCallback(async (): Promise<SequenceSummary[]> => {
    setIsLoadingSequences(true);
    try {
      const data = await fetchJson<SequenceSummary[]>(
        `/api/video/projects/${encodeURIComponent(projectId)}/sequences`,
      );
      setSequences(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load sequences");
      return [];
    } finally {
      setIsLoadingSequences(false);
    }
  }, [projectId]);

  const refreshResources = useCallback(async () => {
    if (!selectedSequence) {
      console.warn("[refreshResources] SKIPPED — selectedSequence is null");
      setResources(null);
      return;
    }
    console.log(`[refreshResources] fetching for sequence=${selectedSequence.id}`);
    setIsLoadingResources(true);
    try {
      const data = await fetchJson<DomainResources>(
        `/api/video/sequences/${encodeURIComponent(selectedSequence.id)}/resources?projectId=${encodeURIComponent(projectId)}`,
      );
      console.log(`[refreshResources] got: categories=${data.categories.length}`);
      setResources(data);
    } catch (err: unknown) {
      console.error("[refreshResources] FAILED:", err);
      setError(err instanceof Error ? err.message : "Failed to load resources");
    } finally {
      setIsLoadingResources(false);
    }
  }, [selectedSequence, projectId]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshSequences(), refreshResources()]);
  }, [refreshSequences, refreshResources]);

  const selectSequence = useCallback((seq: SequenceSummary | null) => {
    setSelectedSequence(seq);
    setResources(null);
  }, []);

  const uploadSequence = useCallback(
    async (sequenceKey: string, sequenceName: string | null, content: string | null) => {
      setIsUploading(true);
      try {
        await fetchJson(
          `/api/video/projects/${encodeURIComponent(projectId)}/sequences`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sequenceKey, sequenceName, sequenceContent: content }),
          },
        );
        await refreshSequences();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to create sequence");
      } finally {
        setIsUploading(false);
      }
    },
    [projectId, refreshSequences],
  );

  const deleteSequence = useCallback(
    async (sequenceId: string) => {
      try {
        await fetchJson(
          `/api/video/sequences/${encodeURIComponent(sequenceId)}`,
          { method: "DELETE" },
        );
        // Deselect if deleted sequence was selected.
        if (selectedSequence?.id === sequenceId) {
          setSelectedSequence(null);
          setResources(null);
        }
        await refreshSequences();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to delete sequence");
      }
    },
    [selectedSequence, refreshSequences],
  );

  // Load sequences on mount.
  useEffect(() => {
    void refreshSequences();
  }, [refreshSequences]);

  // Load resources when sequence changes.
  useEffect(() => {
    if (selectedSequence) {
      void refreshResources();
    }
  }, [selectedSequence, refreshResources]);

  return {
    sequences,
    isLoadingSequences,
    isUploading,
    selectedSequence,
    selectSequence,
    resources,
    isLoadingResources,
    refreshSequences,
    refreshResources,
    refreshAll,
    uploadSequence,
    deleteSequence,
    error,
    setError,
  };
}
