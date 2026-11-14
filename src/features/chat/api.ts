import { api } from "@/lib/api/client";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessageRecord = {
  id: number;
  role: string;
  content: string;
  created_at: string;
};

export type ChatRoomSummary = {
  id: number;
  character_id: number;
  character_name: string;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type ChatRoomCreated = {
  id: number;
  user_id: number;
  character_id: number;
  title: string | null;
  created_at: string;
};

export type ChatSendResult = {
  user_message: ChatMessageRecord;
  assistant_message: ChatMessageRecord;
};

export function listChatRooms() {
  return api.get<ChatRoomSummary[]>("/chat/rooms").then((rooms) => {
    if (!Array.isArray(rooms)) {
      throw new Error("채팅방 목록 응답 형식이 올바르지 않습니다.");
    }
    return rooms.slice().sort((left, right) => timestamp(right.updated_at) - timestamp(left.updated_at));
  });
}

export async function openCharacterChat(characterId: number) {
  const rooms = await listChatRooms();
  const existing = rooms.find((room) => room.character_id === characterId);
  if (existing) {
    return existing;
  }
  return createChatRoom(characterId);
}

export function createChatRoom(characterId: number) {
  return api.post<ChatRoomCreated>("/chat/rooms", { character_id: characterId });
}

export function listChatMessages(roomId: number) {
  return api.get<ChatMessageRecord[]>(`/chat/rooms/${roomId}/messages`).then((messages) => {
    if (!Array.isArray(messages)) {
      throw new Error("채팅 내역 응답 형식이 올바르지 않습니다.");
    }
    return messages;
  });
}

export function sendChatMessage(roomId: number, message: string) {
  return api.post<ChatSendResult>(`/chat/rooms/${roomId}/messages`, { message });
}

export function deleteChatRoom(roomId: number) {
  return api.delete<{ message: string; room_id: number }>(`/chat/rooms/${roomId}`);
}

function timestamp(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatChatTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export function formatChatDay(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const now = new Date();
  const sameDay =
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate();
  if (sameDay) {
    return "오늘";
  }
  return parsed.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export function formatChatUpdated(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
