export type ChatRole = "user" | "assistant";

export type MockChatMessage = {
  source: "mock";
  id: string;
  role: ChatRole;
  content: string;
  /** 화면 표시용 시각. 백엔드 created_at 형식이 아님 */
  timeLabel: string;
};

export type MockChatRoom = {
  source: "mock";
  id: string;
  characterId: string;
  characterName: string;
  preview: string;
  updatedLabel: string;
  /** 화면 표시용. 백엔드에 온라인 상태 필드가 없음 */
  presenceLabel: "온라인";
  messages: MockChatMessage[];
};
