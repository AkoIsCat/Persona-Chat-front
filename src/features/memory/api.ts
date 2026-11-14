import { api } from "@/lib/api/client";

export type CharacterMemory = {
  id: number;
  memory_text: string;
  memory_type: string | null;
  importance: number;
  created_at: string;
  updated_at: string;
};

export type MemoryUpdate = {
  memory_text?: string;
  memory_type?: string;
  importance?: number;
};

export async function listCharacterMemories(characterId: number) {
  const memories = await api.get<CharacterMemory[]>(`/characters/${characterId}/memories`);
  if (!Array.isArray(memories)) {
    throw new Error("기억 목록 응답 형식이 올바르지 않습니다.");
  }
  return memories;
}

export function updateCharacterMemory(characterId: number, memoryId: number, changes: MemoryUpdate) {
  return api.patch<CharacterMemory>(`/characters/${characterId}/memories/${memoryId}`, changes);
}

export function deleteCharacterMemory(characterId: number, memoryId: number) {
  return api.delete<{ message: string; memory_id: number }>(`/characters/${characterId}/memories/${memoryId}`);
}

export function formatMemoryTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
