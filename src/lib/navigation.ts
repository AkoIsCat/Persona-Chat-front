export const routes = {
  start: "/",
  login: "/login",
  signup: "/signup",
  home: "/home",
  charactersNew: "/characters/new",
  character: (characterId: string) => `/characters/${characterId}`,
  characterAnalyzing: (characterId: string) => `/characters/${characterId}/analyzing`,
  characterReview: (characterId: string) => `/characters/${characterId}/review`,
  characterMemories: (characterId: string) => `/characters/${characterId}/memories`,
  chats: "/chats",
  chatRoom: (roomId: string) => `/chats/${roomId}`,
  mypage: "/mypage",
} as const;

export function isChatRoomPath(pathname: string) {
  return /^\/chats\/[^/]+$/.test(pathname);
}
