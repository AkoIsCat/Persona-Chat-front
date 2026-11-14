"use client";

import { useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { characterErrorMessage } from "@/features/character/persona";
import {
  deleteCharacterMemory,
  formatMemoryTime,
  updateCharacterMemory,
  type CharacterMemory,
  type MemoryUpdate,
} from "@/features/memory/api";
import { MemoryEditDialog } from "@/features/memory/MemoryEditDialog";
import { cn } from "@/lib/utils";
import { memoryTypeLabels, memoryTypes, type MemoryType } from "@/types/memory.types";

type MemoryFilter = "all" | MemoryType | "other";

type MemoryBoardProps = {
  characterId: number;
  characterName: string;
  memories: CharacterMemory[];
  onMemoriesChange: (memories: CharacterMemory[]) => void;
};

function importanceLabel(importance: number) {
  if (importance >= 4) return "중요도 높음";
  if (importance === 3) return "중요도 보통";
  return "중요도 낮음";
}

function memoryTypeKey(value: string | null | undefined): MemoryType | "other" {
  if (value && memoryTypes.includes(value as MemoryType)) {
    return value as MemoryType;
  }
  return "other";
}

function memoryTypeLabel(value: string | null | undefined) {
  const key = memoryTypeKey(value);
  return key === "other" ? "기타" : memoryTypeLabels[key];
}

function sortMemories(memories: CharacterMemory[]) {
  return [...memories].sort((left, right) => {
    if (right.importance !== left.importance) {
      return right.importance - left.importance;
    }
    const updated = new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
    if (updated !== 0) {
      return updated;
    }
    return right.id - left.id;
  });
}

export function MemoryBoard({ characterId, characterName, memories, onMemoriesChange }: MemoryBoardProps) {
  const [filter, setFilter] = useState<MemoryFilter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [askDeleteId, setAskDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const otherCount = memories.filter((memory) => memoryTypeKey(memory.memory_type) === "other").length;
  const visible =
    filter === "all" ? memories : memories.filter((memory) => memoryTypeKey(memory.memory_type) === filter);
  const editing = memories.find((memory) => memory.id === editingId);

  async function onSave(changes: MemoryUpdate) {
    if (!editing || saving) {
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateCharacterMemory(characterId, editing.id, changes);
      onMemoriesChange(sortMemories(memories.map((memory) => (memory.id === updated.id ? updated : memory))));
      setEditingId(null);
    } catch (caught) {
      setSaveError(characterErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(memoryId: number) {
    if (deletingId !== null) {
      return;
    }
    setDeletingId(memoryId);
    setDeleteError("");
    try {
      await deleteCharacterMemory(characterId, memoryId);
      onMemoriesChange(memories.filter((memory) => memory.id !== memoryId));
      setAskDeleteId(null);
    } catch (caught) {
      setDeleteError(characterErrorMessage(caught));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <h2 className="text-[20px] font-semibold leading-7">{characterName}</h2>
      <p className="text-[12px] leading-4 text-outline">
        이 캐릭터와 나눈 대화에서 뽑은 사용자 정보입니다. 다른 캐릭터의 기억과 섞지 않습니다.
      </p>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} label={`전체 ${memories.length}`} onClick={() => setFilter("all")} />
        {memoryTypes.map((type) => (
          <FilterChip
            key={type}
            active={filter === type}
            label={`${memoryTypeLabels[type]} ${memories.filter((memory) => memory.memory_type === type).length}`}
            onClick={() => setFilter(type)}
          />
        ))}
        {otherCount > 0 ? (
          <FilterChip active={filter === "other"} label={`기타 ${otherCount}`} onClick={() => setFilter("other")} />
        ) : null}
      </div>
      {memories.length === 0 ? (
        <EmptyState title="저장된 기억이 없습니다" description="이 캐릭터와 대화하면 장기기억이 여기에 쌓입니다." />
      ) : visible.length === 0 ? (
        <EmptyState title="이 유형의 기억이 없습니다" />
      ) : (
        visible.map((memory) => {
          const updatedLabel = formatMemoryTime(memory.updated_at);
          const createdLabel = formatMemoryTime(memory.created_at);
          return (
            <Card key={memory.id} className="flex flex-col gap-2.5 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge>{memoryTypeLabel(memory.memory_type)}</Badge>
                  {typeof memory.importance === "number" ? (
                    <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[12px] font-medium text-on-surface-variant">
                      {importanceLabel(memory.importance)}
                    </span>
                  ) : null}
                </div>
                {updatedLabel ? <span className="shrink-0 text-[12px] text-outline">{updatedLabel}</span> : null}
              </div>
              <p className="text-[15px] leading-6">“{memory.memory_text}”</p>
              <div className="flex items-center justify-between gap-2 border-t border-outline-variant pt-2">
                <span className="text-[12px] text-outline">{createdLabel ? `생성 ${createdLabel}` : ""}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSaveError("");
                      setEditingId(memory.id);
                    }}
                    aria-label="기억 수정"
                    disabled={deletingId === memory.id}
                    className="size-9 min-h-9 px-0"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDeleteError("");
                      setAskDeleteId(memory.id);
                    }}
                    aria-label="기억 삭제"
                    disabled={deletingId === memory.id}
                    className="size-9 min-h-9 px-0 text-error"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5h6v2m-7 3l.5 9h7l.5-9" />
                    </svg>
                  </Button>
                </div>
              </div>
              {askDeleteId === memory.id ? (
                <div className="rounded-xl border border-outline-variant bg-surface-lowest p-3">
                  <p className="text-[13px] font-medium leading-5">이 기억을 삭제할까요?</p>
                  {deleteError ? (
                    <p role="alert" className="mt-1.5 text-[12px] leading-4 text-error">
                      {deleteError}
                    </p>
                  ) : null}
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      disabled={deletingId === memory.id}
                      onClick={() => setAskDeleteId(null)}
                    >
                      취소
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-error text-white"
                      disabled={deletingId === memory.id}
                      onClick={() => void onDelete(memory.id)}
                    >
                      {deletingId === memory.id ? "삭제 중" : "삭제"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })
      )}
      {editing ? (
        <MemoryEditDialog
          key={editing.id}
          memory={editing}
          saving={saving}
          error={saveError}
          onClose={() => {
            if (!saving) {
              setEditingId(null);
            }
          }}
          onSave={(changes) => void onSave(changes)}
        />
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-[13px] font-medium leading-5",
        active ? "bg-primary text-on-primary" : "border border-outline-variant bg-surface-lowest text-on-surface-variant",
      )}
    >
      {label}
    </button>
  );
}
