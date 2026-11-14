export type MemoryType =
  | "preference"
  | "personality"
  | "experience"
  | "goal"
  | "relationship"
  | "background";

export const memoryTypeLabels: Record<MemoryType, string> = {
  preference: "취향 및 선호",
  personality: "성격 및 성향",
  experience: "경험 및 일상",
  goal: "목표 및 계획",
  relationship: "주변 사람과의 관계",
  background: "사용자 배경",
};

export const memoryTypes: MemoryType[] = [
  "preference",
  "personality",
  "experience",
  "goal",
  "relationship",
  "background",
];

export type MockMemory = {
  source: "mock";
  id: string;
  characterId: string;
  memoryType: MemoryType;
  content: string;
  /** 백엔드 importance 범위(1~5)에 맞춘 임시 값 */
  importance: number;
  /** 화면 표시용 상대 시각. API 필드 아님 */
  updatedLabel: string;
  /** 화면 표시용 출처 문구. API 필드 아님 */
  sourceLabel: string;
};
