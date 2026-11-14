import type { MockChatRoom } from "@/types/chat.types";

export const mockChatRooms: MockChatRoom[] = [
  {
    source: "mock",
    id: "room-spider",
    characterId: "spider-man",
    characterName: "스파이더맨",
    preview: "고마워! 너의 도움이 큰 힘이 돼.",
    updatedLabel: "10분 전",
    presenceLabel: "온라인",
    messages: [
      { source: "mock", id: "m1", role: "user", content: "스파이디, 오늘 기분은 어때?", timeLabel: "오후 02:30" },
      { source: "mock", id: "m2", role: "assistant", content: "좋아! 오늘도 뉴욕은 평화롭고, 난 할 일이 많아. 너는 어때?", timeLabel: "오후 02:30" },
      { source: "mock", id: "m3", role: "user", content: "요즘 훈련은 잘 되고 있어?", timeLabel: "오후 02:31" },
      { source: "mock", id: "m4", role: "assistant", content: "응! 웹 스윙 연습이랑 반사 신경 훈련을 열심히 하고 있어. 더 강해져야 사람들을 안전하게 지킬 수 있으니까.", timeLabel: "오후 02:31" },
      { source: "mock", id: "m5", role: "user", content: "고마워! 네가 있어서 든든해.", timeLabel: "오후 02:32" },
      { source: "mock", id: "m6", role: "assistant", content: "고마워! 네 응원이 힘이 돼. 언제든 도움이 필요하면 말해줘!", timeLabel: "오후 02:32" },
    ],
  },
  {
    source: "mock",
    id: "room-harry",
    characterId: "harry-potter",
    characterName: "해리 포터",
    preview: "오늘 호그와트는 조용해.",
    updatedLabel: "1시간 전",
    presenceLabel: "온라인",
    messages: [
      { source: "mock", id: "h1", role: "user", content: "오늘 수업은 어땠어?", timeLabel: "오후 01:10" },
      { source: "mock", id: "h2", role: "assistant", content: "오늘 호그와트는 조용해. 론이랑 복도에서 잠깐 이야기를 나눴어.", timeLabel: "오후 01:11" },
    ],
  },
  {
    source: "mock",
    id: "room-doraemon",
    characterId: "doraemon",
    characterName: "도라에몽",
    preview: "비밀도구는 아껴 써야 해.",
    updatedLabel: "어제",
    presenceLabel: "온라인",
    messages: [
      { source: "mock", id: "d1", role: "user", content: "오늘도 비밀도구 있어?", timeLabel: "오후 08:20" },
      { source: "mock", id: "d2", role: "assistant", content: "비밀도구는 아껴 써야 해. 진짜 필요할 때 꺼내 줄게.", timeLabel: "오후 08:21" },
    ],
  },
];

export function getMockChatRoom(roomId: string) {
  return mockChatRooms.find((room) => room.id === roomId);
}

export function getMockChatRoomByCharacter(characterId: string) {
  return mockChatRooms.find((room) => room.characterId === characterId);
}
