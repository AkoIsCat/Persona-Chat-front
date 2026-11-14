"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { characterErrorMessage } from "@/features/character/persona";
import { listChatMessages, listChatRooms, sendChatMessage, type ChatMessageRecord, type ChatRoomSummary } from "@/features/chat/api";
import { ChatHeader } from "@/features/chat/ChatHeader";
import { ChatInput } from "@/features/chat/ChatInput";
import { ChatMessageList } from "@/features/chat/ChatMessageList";
import { TypingIndicator } from "@/features/chat/TypingIndicator";
import { ApiError } from "@/lib/api/client";
import { routes } from "@/lib/navigation";

const messageLimit = 5000;

type ChatThreadProps = {
  roomId: string;
};

export function ChatThread({ roomId }: ChatThreadProps) {
  const numericId = Number(roomId);
  const validId = Number.isInteger(numericId) && numericId > 0;
  const [room, setRoom] = useState<ChatRoomSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const sendingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!validId) {
      setMissing(true);
      setLoading(false);
      return;
    }

    let active = true;
    void (async () => {
      try {
        const [rooms, history] = await Promise.all([listChatRooms(), listChatMessages(numericId)]);
        if (!active) {
          return;
        }
        const current = rooms.find((item) => item.id === numericId) ?? null;
        if (!current) {
          setMissing(true);
          return;
        }
        setRoom(current);
        setMessages(history);
      } catch (caught) {
        if (!active) {
          return;
        }
        if (caught instanceof ApiError && caught.status === 404) {
          setMissing(true);
          return;
        }
        setError(characterErrorMessage(caught));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [numericId, validId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  async function onSubmit() {
    if (sendingRef.current || !room || !messages) {
      return;
    }
    const message = draft.trim();
    if (!message) {
      setSendError("메시지를 입력해 주세요.");
      return;
    }
    if (message.length > messageLimit) {
      setSendError("메시지는 5,000자까지 보낼 수 있습니다.");
      return;
    }

    const knownIds = new Set(messages.map((item) => item.id));
    const optimisticId = -Date.now();
    const optimistic: ChatMessageRecord = {
      id: optimisticId,
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    };

    sendingRef.current = true;
    setSending(true);
    setSendError("");
    setDraft("");
    setMessages((current) => [...(current ?? []), optimistic]);
    try {
      const result = await sendChatMessage(room.id, message);
      setMessages((current) => {
        const kept = (current ?? []).filter(
          (item) => item.id !== optimisticId && item.id !== result.user_message.id && item.id !== result.assistant_message.id,
        );
        return [...kept, result.user_message, result.assistant_message];
      });
    } catch (caught) {
      let saved = false;
      try {
        const history = await listChatMessages(room.id);
        saved = history.some((item) => item.role === "user" && item.content === message && !knownIds.has(item.id));
        setMessages(history);
      } catch {
        setMessages((current) => (current ?? []).filter((item) => item.id !== optimisticId));
      }
      if (!saved) {
        setDraft(message);
      }
      setSendError(saved ? "응답을 표시하지 못했습니다. 저장된 대화를 다시 불러왔습니다." : characterErrorMessage(caught));
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  if (loading) {
    return <p className="px-5 py-6 text-[13px] text-on-surface-variant">대화를 불러오고 있습니다.</p>;
  }

  if (missing) {
    return (
      <div className="px-5 py-5">
        <EmptyState title="채팅방을 찾을 수 없습니다" description="삭제되었거나 접근할 수 없는 대화입니다." />
        <Link href={routes.chats} className="mt-4 inline-block text-[13px] font-medium text-primary">
          채팅 목록으로
        </Link>
      </div>
    );
  }

  if (error || !room || !messages) {
    return (
      <div className="px-5 py-5">
        <EmptyState title="대화를 불러오지 못했습니다" description={error || undefined} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-lowest">
      <ChatHeader roomId={room.id} characterId={room.character_id} characterName={room.character_name} />
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {messages.length === 0 ? (
          <div className="px-4 py-6">
            <EmptyState title="아직 메시지가 없습니다" />
          </div>
        ) : (
          <ChatMessageList characterName={room.character_name} messages={messages} />
        )}
        {sending ? <TypingIndicator characterName={room.character_name} /> : null}
        <div ref={bottomRef} />
      </div>
      <ChatInput value={draft} sending={sending} error={sendError} onChange={setDraft} onSubmit={() => void onSubmit()} />
    </div>
  );
}
