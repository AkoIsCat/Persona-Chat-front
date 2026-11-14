"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { characterErrorMessage } from "@/features/character/persona";
import { deleteChatRoom } from "@/features/chat/api";
import { routes } from "@/lib/navigation";

type ChatHeaderProps = {
  roomId: number;
  characterId: number;
  characterName: string;
};

export function ChatHeader({ roomId, characterId, characterName }: ChatHeaderProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const deletingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setAskDelete(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function onDelete() {
    if (deletingRef.current) {
      return;
    }
    deletingRef.current = true;
    setDeleting(true);
    setError("");
    try {
      await deleteChatRoom(roomId);
      router.replace(routes.chats);
    } catch (caught) {
      setError(characterErrorMessage(caught));
      deletingRef.current = false;
      setDeleting(false);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-outline-variant bg-surface-lowest px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Link href={routes.chats} aria-label="채팅 목록으로" className="inline-flex size-10 items-center justify-center text-on-surface">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <Link href={routes.character(String(characterId))} className="flex min-w-0 items-center gap-2">
          <Avatar name={characterName} size="sm" />
          <span className="block truncate text-[15px] font-semibold leading-5">{characterName}</span>
        </Link>
      </div>
      <div ref={menuRef} className="relative">
        <Button
          variant="ghost"
          aria-label="채팅방 메뉴"
          aria-expanded={open}
          className="size-10 min-h-10 px-0"
          disabled={deleting}
          onClick={() => {
            setOpen((current) => !current);
            setAskDelete(false);
            setError("");
          }}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </Button>
        {open ? (
          <div className="absolute right-0 top-11 z-10 w-44 rounded-xl border border-outline-variant bg-surface-lowest p-2 shadow-sm">
            {askDelete ? (
              <div>
                <p className="px-2 py-1 text-[12px] leading-4 text-on-surface-variant">이 채팅방을 삭제할까요?</p>
                <div className="mt-1 flex gap-1">
                  <Button type="button" variant="secondary" className="min-h-9 flex-1 px-2 text-[12px]" disabled={deleting} onClick={() => setAskDelete(false)}>
                    취소
                  </Button>
                  <Button type="button" className="min-h-9 flex-1 px-2 text-[12px]" disabled={deleting} onClick={() => void onDelete()}>
                    {deleting ? "삭제 중" : "삭제"}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-error hover:bg-[#f3f4f6]"
                onClick={() => setAskDelete(true)}
              >
                채팅방 삭제
              </button>
            )}
            {error ? (
              <p role="alert" className="px-2 pt-1 text-[11px] leading-4 text-error">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
