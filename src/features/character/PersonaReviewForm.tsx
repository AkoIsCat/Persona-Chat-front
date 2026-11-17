"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Textarea } from "@/components/ui/Textarea";
import { getCharacterJob } from "@/features/character/characterJob";
import {
  characterErrorMessage,
  confirmCharacterPersona,
  getCharacterPersona,
  getCharacterSummary,
  normalizePersona,
  personaFieldLabels,
  searchSupplementalPersona,
  updateCharacterPersona,
  type PersonaFields,
} from "@/features/character/persona";
import { routes } from "@/lib/navigation";

type PersonaReviewFormProps = {
  characterId: string;
};

export function PersonaReviewForm({ characterId }: PersonaReviewFormProps) {
  const router = useRouter();
  const numericId = Number(characterId);
  const validId = Number.isInteger(numericId) && numericId > 0;
  const [persona, setPersona] = useState<PersonaFields | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [askConfirm, setAskConfirm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!validId) {
      setLoading(false);
      setError("캐릭터를 찾을 수 없습니다.");
      return;
    }

    let active = true;
    setName(getCharacterJob(numericId)?.name ?? "");
    void (async () => {
      try {
        const [record, summary] = await Promise.all([
          getCharacterPersona(numericId),
          getCharacterSummary(numericId),
        ]);
        if (!active) {
          return;
        }
        setPersona(normalizePersona(record.persona));
        setConfirmed(record.is_confirmed);
        if (summary?.name) {
          setName(summary.name);
        }
      } catch (caught) {
        if (active) {
          setError(characterErrorMessage(caught));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [numericId, validId]);

  function updateField(key: keyof PersonaFields, value: string) {
    setPersona((current) => (current ? { ...current, [key]: value } : current));
    setNotice("");
  }

  async function onSearch() {
    if (!persona || saving || searching || confirming || confirmed) {
      return;
    }
    setSearching(true);
    setError("");
    setNotice("");
    try {
      const result = await searchSupplementalPersona(numericId);
      setPersona(normalizePersona(result.persona));
      setConfirmed(result.is_confirmed);
      setNotice(result.message);
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setSearching(false);
    }
  }

  async function onSave() {
    if (!persona || saving || searching || confirming || confirmed) {
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateCharacterPersona(numericId, persona);
      const latest = await getCharacterPersona(numericId);
      setPersona(normalizePersona(latest.persona));
      setConfirmed(latest.is_confirmed);
      setNotice("수정한 페르소나를 저장했습니다.");
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function onConfirm() {
    if (!persona || saving || searching || confirming || confirmed) {
      return;
    }
    setConfirming(true);
    setError("");
    setNotice("");
    try {
      const result = await confirmCharacterPersona(numericId);
      if (!result.is_confirmed) {
        setError("확정 응답을 확인하지 못했습니다.");
        setConfirming(false);
        return;
      }
      router.push(routes.character(String(numericId)));
    } catch (caught) {
      setError(characterErrorMessage(caught));
      setConfirming(false);
    }
  }

  if (loading) {
    return <p className="text-[13px] leading-[18px] text-on-surface-variant">페르소나를 불러오고 있습니다.</p>;
  }

  if (!persona) {
    return <EmptyState title="페르소나를 불러오지 못했습니다" description={error || undefined} />;
  }

  const busy = saving || searching || confirming;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] leading-[18px] text-on-surface-variant">
        {name ? `${name}의 ` : ""}분석 결과를 확인하고 필요한 항목을 수정해 주세요. 최종 확정 전에는 채팅할 수 없습니다.
      </p>
      <p className="text-[12px] leading-4 text-outline">{confirmed ? "최종 확정된 페르소나입니다." : "아직 최종 확정 전입니다."}</p>
      {personaFieldLabels.map((field) => (
        <Textarea
          key={field.key}
          id={`review-${field.key}`}
          label={field.label}
          value={persona[field.key]}
          rows={4}
          readOnly={confirmed}
          onChange={(event) => updateField(field.key, event.target.value)}
        />
      ))}
      {confirmed ? null : (
        <Button type="button" variant="secondary" className="w-full" disabled={busy} onClick={() => void onSearch()}>
          {searching ? "검색 중" : "추가 데이터 검색"}
        </Button>
      )}
      {notice ? <p className="text-[12px] leading-4 text-primary">{notice}</p> : null}
      {error ? (
        <p role="alert" className="text-[12px] leading-4 text-error">
          {error}
        </p>
      ) : null}
      {confirmed ? (
        <Link
          href={routes.character(characterId)}
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-[14px] font-medium text-on-primary"
        >
          캐릭터 상세
        </Link>
      ) : askConfirm ? (
        <div className="rounded-xl border border-outline-variant bg-surface-lowest p-4">
          <p className="text-[13px] font-medium leading-5">최종 확정하면 이 페르소나는 다시 수정할 수 없습니다.</p>
          <div className="mt-3 flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" disabled={busy} onClick={() => setAskConfirm(false)}>
              취소
            </Button>
            <Button type="button" className="flex-1" disabled={busy} onClick={onConfirm}>
              {confirming ? "확정 중" : "확정"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button type="button" variant="secondary" className="w-full" disabled={busy} onClick={onSave}>
            {saving ? "저장 중" : "저장"}
          </Button>
          <div className="flex gap-2">
            <Link
              href={routes.characterAnalyzing(characterId)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control border border-outline-variant bg-surface-lowest px-4 text-[14px] font-medium"
            >
              이전 단계
            </Link>
            <Button type="button" className="flex-1" disabled={busy} onClick={() => setAskConfirm(true)}>
              이대로 확정하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
