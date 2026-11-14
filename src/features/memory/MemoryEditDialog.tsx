"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { CharacterMemory, MemoryUpdate } from "@/features/memory/api";
import { memoryTypeLabels, memoryTypes, type MemoryType } from "@/types/memory.types";

type MemoryEditDialogProps = {
  memory: CharacterMemory;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (changes: MemoryUpdate) => void;
};

function isKnownType(value: string): value is MemoryType {
  return memoryTypes.includes(value as MemoryType);
}

export function MemoryEditDialog({ memory, saving, error, onClose, onSave }: MemoryEditDialogProps) {
  const [draft, setDraft] = useState(memory.memory_text);
  const [memoryType, setMemoryType] = useState(memory.memory_type ?? "");
  const [importance, setImportance] = useState(String(memory.importance));
  const [localError, setLocalError] = useState("");
  const currentType = memory.memory_type ?? "";
  const typeOptions = [
    ...(!currentType || !isKnownType(currentType) ? [{ value: currentType, label: "기타" }] : []),
    ...memoryTypes.map((type) => ({ value: type, label: memoryTypeLabels[type] })),
  ];

  function save() {
    const memoryText = draft.trim();
    if (!memoryText) {
      setLocalError("기억 내용을 입력해 주세요.");
      return;
    }
    const nextImportance = Number(importance);
    if (!Number.isInteger(nextImportance) || nextImportance < 1 || nextImportance > 5) {
      setLocalError("중요도는 1부터 5 사이여야 합니다.");
      return;
    }

    const changes: MemoryUpdate = {};
    if (memoryText !== memory.memory_text) {
      changes.memory_text = memoryText;
    }
    if (memoryType !== currentType && memoryType) {
      changes.memory_type = memoryType;
    }
    if (nextImportance !== memory.importance) {
      changes.importance = nextImportance;
    }
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }
    setLocalError("");
    onSave(changes);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 min-[768px]:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-edit-title"
        className="w-full rounded-2xl bg-surface-lowest p-5 shadow-xl min-[768px]:w-[420px]"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="memory-edit-title" className="text-[17px] font-semibold leading-6">
            기억 편집하기
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            disabled={saving}
            className="inline-flex size-9 items-center justify-center text-outline disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Textarea id="memory-draft" label="기억 내용" rows={3} value={draft} disabled={saving} onChange={(event) => setDraft(event.target.value)} />
          <label className="flex flex-col gap-1.5 text-[14px] font-medium leading-5" htmlFor="memory-type">
            기억 유형
            <select
              id="memory-type"
              value={memoryType}
              disabled={saving}
              onChange={(event) => setMemoryType(event.target.value)}
              className="min-h-11 rounded-control border border-outline-variant bg-surface-lowest px-3.5 text-[15px] outline-none focus:border-primary"
            >
              {typeOptions.map((option) => (
                <option key={option.value || "other"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[14px] font-medium leading-5" htmlFor="memory-importance">
            중요도
            <select
              id="memory-importance"
              value={importance}
              disabled={saving}
              onChange={(event) => setImportance(event.target.value)}
              className="min-h-11 rounded-control border border-outline-variant bg-surface-lowest px-3.5 text-[15px] outline-none focus:border-primary"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
        </div>
        {localError || error ? (
          <p role="alert" className="mt-2 text-[12px] leading-4 text-error">
            {localError || error}
          </p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            취소
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "저장 중" : "저장하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
