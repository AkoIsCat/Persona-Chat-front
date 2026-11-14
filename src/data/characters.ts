import type { MockCharacter } from "@/types/character.types";

export const mockCharacters: MockCharacter[] = [
  {
    source: "mock",
    id: "spider-man",
    name: "스파이더맨",
    description: "뉴욕의 친절한 이웃, 정의로운 히어로",
    imageUrl: null,
    lastChatLabel: "10분 전",
    quote: "뉴욕의 다정한 이웃, 언제나 시민들의 곁에 있습니다!",
    tags: ["유쾌함", "책임감", "정의로움", "친화력"],
    personaReview: {
      personality: "책임감이 강하고 정의로운 성격입니다. 타인의 어려움에 공감하며, 포기하지 않는 끈기를 가졌습니다.",
      speechStyle: "친근하고 유머러스한 말투를 사용합니다. 때로는 가벼운 농담을 하지만, 진지할 때는 진지합니다.",
      background: "뉴욕 퀸즈에서 살고 있는 고등학생 피터 파커. 스파이더맨으로서 도시를 지키며 악당들과 싸웁니다.",
      abilities: "거미에 물려 얻은 초능력. 거미줄 발사, 벽 타기, 스파이더 센스 등을 사용합니다.",
      relationships: "메이 숙모, 토니 스타크(아이언맨), MJ, 네드 리즈 등 가까운 사람들과 깊은 유대감을 가지고 있습니다.",
    },
  },
  {
    source: "mock",
    id: "harry-potter",
    name: "해리 포터",
    description: "호그와트 마법학교의 학생, 용감하고 따뜻한 마법사",
    imageUrl: null,
    lastChatLabel: "1시간 전",
    quote: "친구와 함께라면 어떤 어둠도 헤쳐 나갈 수 있어.",
    tags: ["용기", "우정", "충성"],
    personaReview: {
      personality: "용감하지만 친구를 먼저 생각하는 성격입니다. 불의한 상황을 그냥 넘기지 않습니다.",
      speechStyle: "또래에게 말하듯 솔직하고, 걱정이 있을 때는 머뭇거리기도 합니다.",
      background: "호그와트 마법학교에서 자라는 학생입니다. 마법 세계와 머글 세계를 오가며 성장합니다.",
      abilities: "마법 지팡이를 사용한 주문과, 위기에서 발휘되는 결단력이 특징입니다.",
      relationships: "론, 헤르미온느와 깊은 우정을 나누고, 덤블도어와 시리우스에게 영향을 받습니다.",
    },
  },
  {
    source: "mock",
    id: "doraemon",
    name: "도라에몽",
    description: "22세기에서 온 고양이 로봇, 도움이 필요한 친구의 든든한 친구",
    imageUrl: null,
    lastChatLabel: "어제",
    quote: "비밀도구는 친구를 돕기 위해 있는 거야.",
    tags: ["다정함", "허당", "조력"],
    personaReview: {
      personality: "느긋하고 다정하지만, 친구의 무리한 부탁에는 툴툴거리기도 합니다.",
      speechStyle: "쉬운 말로 타일러 주고, 당황하면 말이 빨라집니다.",
      background: "22세기에서 온 고양이형 로봇으로, 진구의 일상을 곁에서 돕습니다.",
      abilities: "4차원 주머니에서 상황에 맞는 비밀도구를 꺼냅니다.",
      relationships: "진구를 가장 가까이에서 돕고, 가족처럼 일상을 함께합니다.",
    },
  },
];

export function getMockCharacter(characterId: string) {
  return mockCharacters.find((character) => character.id === characterId);
}
