"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/Button";
import { CharacterList } from "@/features/character/CharacterList";
import { characterErrorMessage, listCharacters, type CharacterSummary } from "@/features/character/persona";

export function HomeCharacterSection() {
  const [characters, setCharacters] = useState<CharacterSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCharacters(await listCharacters());
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section>
      <SectionTitle title="내 캐릭터" />
      {loading && !characters ? (
        <p className="text-[13px] leading-[18px] text-on-surface-variant">캐릭터 목록을 불러오고 있습니다.</p>
      ) : null}
      {error ? (
        <div className="flex flex-col gap-3">
          <p role="alert" className="text-[12px] leading-4 text-error">
            {error}
          </p>
          <Button type="button" variant="secondary" disabled={loading} onClick={() => void load()}>
            {loading ? "다시 불러오는 중" : "다시 시도"}
          </Button>
        </div>
      ) : null}
      {!error && characters && characters.length === 0 ? (
        <EmptyState title="아직 만든 캐릭터가 없습니다." description="오른쪽 위의 캐릭터 만들기로 추가할 수 있습니다." />
      ) : null}
      {!error && characters && characters.length > 0 ? <CharacterList characters={characters} /> : null}
    </section>
  );
}
