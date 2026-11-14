"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/Button";
import { characterErrorMessage } from "@/features/character/persona";
import { listChatRooms, type ChatRoomSummary } from "@/features/chat/api";
import { ChatRoomCard } from "@/features/chat/ChatRoomCard";
import { routes } from "@/lib/navigation";

export function RecentChat() {
  const [room, setRoom] = useState<ChatRoomSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rooms = await listChatRooms();
      setRoom(rooms[0] ?? null);
      setEmpty(rooms.length === 0);
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section>
      <SectionTitle
        title="최근 대화"
        action={
          <Link href={routes.chats} className="text-[12px] font-medium text-outline">
            전체 보기
          </Link>
        }
      />
      {loading && !room && !empty ? (
        <p className="text-[13px] leading-[18px] text-on-surface-variant">최근 대화를 불러오고 있습니다.</p>
      ) : null}
      {error ? (
        <div className="flex flex-col gap-3">
          <p role="alert" className="text-[12px] leading-4 text-error">
            {error}
          </p>
          <Button type="button" variant="secondary" disabled={loading} onClick={() => void load()}>
            {loading ? "다시 불러오는 중" : "다시 시도"}
          </Button>
        </div>
      ) : null}
      {!error && empty ? <EmptyState title="대화가 없습니다" /> : null}
      {!error && room ? <ChatRoomCard room={room} /> : null}
    </section>
  );
}
