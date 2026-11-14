"use client";

import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import { characterErrorMessage } from "@/features/character/persona";
import { listChatRooms, type ChatRoomSummary } from "@/features/chat/api";
import { ChatRoomCard } from "@/features/chat/ChatRoomCard";

export function ChatRoomList() {
  const [rooms, setRooms] = useState<ChatRoomSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRooms(await listChatRooms());
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !rooms) {
    return <p className="text-[13px] leading-[18px] text-on-surface-variant">채팅 목록을 불러오고 있습니다.</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert" className="text-[12px] leading-4 text-error">
          {error}
        </p>
        <Button type="button" variant="secondary" disabled={loading} onClick={() => void load()}>
          {loading ? "다시 불러오는 중" : "다시 시도"}
        </Button>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return <EmptyState title="대화가 없습니다" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {rooms.map((room) => (
        <ChatRoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
