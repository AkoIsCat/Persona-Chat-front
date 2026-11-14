export type PersonaReview = {
  personality: string;
  speechStyle: string;
  background: string;
  /** 화면 표시용. 백엔드 페르소나 필드가 아님 */
  abilities: string;
  /** 화면 표시용. 백엔드 페르소나 필드가 아님 */
  relationships: string;
};

export type MockCharacter = {
  source: "mock";
  id: string;
  name: string;
  description: string;
  imageUrl: null;
  lastChatLabel: string;
  /** 화면 표시용. 백엔드 응답 필드가 아님 */
  quote: string;
  /** 화면 표시용. 백엔드 응답 필드가 아님 */
  tags: string[];
  personaReview: PersonaReview;
};
