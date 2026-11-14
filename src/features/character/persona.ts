import { api, ApiError } from "@/lib/api/client";

export type PersonaFields = {
  basic_info: string;
  personality: string;
  values_and_beliefs: string;
  goals: string;
  background: string;
  worldview: string;
  speech_style: string;
  behavior_patterns: string;
  summary: string;
};

export type CharacterCreated = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  urls: string[];
};

export type ExtractResult = {
  character_id: number;
  saved_count: number;
  message: string;
};

export type AnalyzeResult = {
  character_id: number;
  persona_id: number;
  persona: PersonaFields;
  is_confirmed: boolean;
  message: string;
};

export type PersonaRecord = {
  character_id: number;
  persona_id: number;
  persona: PersonaFields;
  is_confirmed: boolean;
  model_name: string | null;
  created_at: string;
  updated_at: string;
};

export type CharacterSummary = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export const personaFieldLabels: Array<{ key: keyof PersonaFields; label: string }> = [
  { key: "basic_info", label: "기본 정보" },
  { key: "personality", label: "성격" },
  { key: "values_and_beliefs", label: "가치관" },
  { key: "goals", label: "목표" },
  { key: "background", label: "배경" },
  { key: "worldview", label: "세계관" },
  { key: "speech_style", label: "말투" },
  { key: "behavior_patterns", label: "행동 패턴" },
  { key: "summary", label: "요약" },
];

export function emptyPersona(): PersonaFields {
  return {
    basic_info: "",
    personality: "",
    values_and_beliefs: "",
    goals: "",
    background: "",
    worldview: "",
    speech_style: "",
    behavior_patterns: "",
    summary: "",
  };
}

export function normalizePersona(persona: Partial<PersonaFields> | null | undefined): PersonaFields {
  const empty = emptyPersona();
  if (!persona) {
    return empty;
  }
  return {
    basic_info: persona.basic_info ?? "",
    personality: persona.personality ?? "",
    values_and_beliefs: persona.values_and_beliefs ?? "",
    goals: persona.goals ?? "",
    background: persona.background ?? "",
    worldview: persona.worldview ?? "",
    speech_style: persona.speech_style ?? "",
    behavior_patterns: persona.behavior_patterns ?? "",
    summary: persona.summary ?? "",
  };
}

export function characterErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.message.trim()) {
    return error.message;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "요청을 처리하지 못했습니다.";
}

export function createCharacter(name: string, urls: string[]) {
  return api.post<CharacterCreated>("/characters", { name, urls });
}

export function extractCharacterSources(characterId: number) {
  return api.post<ExtractResult>(`/characters/${characterId}/extract`);
}

export function analyzeCharacterPersona(characterId: number) {
  return api.post<AnalyzeResult>(`/characters/${characterId}/analyze`);
}

export function getCharacterPersona(characterId: number) {
  return api.get<PersonaRecord>(`/characters/${characterId}/persona`);
}

export function updateCharacterPersona(characterId: number, persona: PersonaFields) {
  return api.put<{ character_id: number; persona_id: number; message: string }>(
    `/characters/${characterId}/persona`,
    persona,
  );
}

export function confirmCharacterPersona(characterId: number) {
  return api.post<{ character_id: number; persona_id: number; is_confirmed: boolean; message: string }>(
    `/characters/${characterId}/persona/confirm`,
  );
}

export async function listCharacters() {
  const characters = await api.get<CharacterSummary[]>("/characters");
  if (!Array.isArray(characters)) {
    throw new Error("캐릭터 목록 응답 형식이 올바르지 않습니다.");
  }
  return characters;
}

export async function getCharacterSummary(characterId: number) {
  const characters = await listCharacters();
  return characters.find((character) => character.id === characterId) ?? null;
}

export function deleteCharacter(characterId: number) {
  return api.delete<{ message: string; character_id: number }>(`/characters/${characterId}`);
}

export function uploadCharacterImage(characterId: number, file: File) {
  const body = new FormData();
  body.append("file", file);
  return api.post<{ message: string; character_id: number; image_url: string }>(
    `/characters/${characterId}/image`,
    body,
  );
}
