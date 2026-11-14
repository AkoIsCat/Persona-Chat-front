"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { characterErrorMessage, getCharacterSummary } from "@/features/character/persona";
import { listCharacterMemories, type CharacterMemory } from "@/features/memory/api";
import { MemoryBoard } from "@/features/memory/MemoryBoard";

type MemoryArchiveProps = {
  characterId: string;
};

export function MemoryArchive({ characterId }: MemoryArchiveProps) {
  const numericId = Number(characterId);
  const [characterName, setCharacterName] = useState("");
  const [memories, setMemories] = useState<CharacterMemory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError("캐릭터를 찾을 수 없습니다.");
      setMemories(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [character, nextMemories] = await Promise.all([
        getCharacterSummary(numericId),
        listCharacterMemories(numericId),
      ]);
      if (!character) {
        setError("캐릭터를 찾을 수 없습니다.");
        setMemories(null);
        return;
      }
      setCharacterName(character.name);
      setMemories(nextMemories);
    } catch (caught) {
      setMemories(null);
      setError(characterErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !memories) {
    return <p className="px-5 py-6 text-[13px] leading-[18px] text-on-surface-variant">기억을 불러오고 있습니다.</p>;
  }

  if (error || !memories) {
    return (
      <div className="flex flex-col gap-3 px-5 py-6">
        <p role="alert" className="text-[12px] leading-4 text-error">
          {error || "기억을 불러오지 못했습니다."}
        </p>
        <Button type="button" variant="secondary" disabled={loading} onClick={() => void load()}>
          {loading ? "다시 불러오는 중" : "다시 시도"}
        </Button>
      </div>
    );
  }

  return (
    <MemoryBoard
      characterId={numericId}
      characterName={characterName}
      memories={memories}
      onMemoriesChange={setMemories}
    />
  );
}
