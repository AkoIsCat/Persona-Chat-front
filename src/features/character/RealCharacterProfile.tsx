"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  characterErrorMessage,
  deleteCharacter,
  getCharacterPersona,
  getCharacterSummary,
  normalizePersona,
  uploadCharacterImage,
  type CharacterSummary,
  type PersonaFields,
} from "@/features/character/persona";
import { openCharacterChat } from "@/features/chat/api";
import { ApiError } from "@/lib/api/client";
import { routes } from "@/lib/navigation";

type RealCharacterProfileProps = {
  characterId: string;
};

export function RealCharacterProfile({ characterId }: RealCharacterProfileProps) {
  const router = useRouter();
  const numericId = Number(characterId);
  const [character, setCharacter] = useState<CharacterSummary | null>(null);
  const [persona, setPersona] = useState<PersonaFields | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openingChat, setOpeningChat] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const openingChatRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setMissing(true);
      setLoading(false);
      return;
    }

    let active = true;
    void (async () => {
      try {
        const summary = await getCharacterSummary(numericId);
        if (!active) {
          return;
        }
        if (!summary) {
          setMissing(true);
          return;
        }
        setCharacter(summary);
        try {
          const record = await getCharacterPersona(numericId);
          if (!active) {
            return;
          }
          setPersona(normalizePersona(record.persona));
          setConfirmed(record.is_confirmed);
        } catch (caught) {
          if (!active) {
            return;
          }
          if (caught instanceof ApiError && caught.status === 404) {
            setPersona(null);
          } else {
            throw caught;
          }
        }
      } catch (caught) {
        if (active) {
          setError(characterErrorMessage(caught));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [numericId]);

  async function onOpenChat() {
    if (openingChatRef.current || deleting || !character) {
      return;
    }
    openingChatRef.current = true;
    setOpeningChat(true);
    setError("");
    try {
      const room = await openCharacterChat(character.id);
      router.push(routes.chatRoom(String(room.id)));
    } catch (caught) {
      setError(characterErrorMessage(caught));
      openingChatRef.current = false;
      setOpeningChat(false);
    }
  }

  async function onImageSelected(file: File | undefined) {
    if (!file || !character || uploadingImage || deleting) {
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowed = extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp";
    if (!allowed) {
      setError("JPG, PNG, WebP 이미지만 올릴 수 있습니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploadingImage(true);
    setError("");
    try {
      const result = await uploadCharacterImage(character.id, file);
      setCharacter({ ...character, image_url: result.image_url });
    } catch (caught) {
      setError(characterErrorMessage(caught));
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }

  async function onDelete() {
    if (deleting || !character) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await deleteCharacter(character.id);
      router.replace(routes.home);
    } catch (caught) {
      setError(characterErrorMessage(caught));
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="px-5 py-6 text-[13px] text-on-surface-variant">캐릭터 정보를 불러오고 있습니다.</p>;
  }

  if (missing) {
    return (
      <div className="px-5 py-5">
        <EmptyState title="캐릭터를 찾을 수 없습니다" description="삭제되었거나 접근할 수 없는 캐릭터입니다." />
      </div>
    );
  }

  if (error && !character) {
    return (
      <div className="px-5 py-5">
        <EmptyState title="캐릭터를 불러오지 못했습니다" description={error} />
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-6">
      <Avatar name={character.name} src={character.image_url} className="size-20 text-[22px]" />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        onChange={(event) => void onImageSelected(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="ghost"
        className="min-h-0 px-0 text-[13px] text-primary"
        disabled={uploadingImage || deleting}
        onClick={() => imageInputRef.current?.click()}
      >
        {uploadingImage ? "이미지 올리는 중" : "이미지 변경"}
      </Button>
      <div className="text-center">
        <h2 className="text-[22px] font-semibold leading-7">{character.name}</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-on-surface-variant">
          {persona?.summary || character.description || "설명이 없습니다."}
        </p>
      </div>
      <p className="text-[12px] leading-4 text-outline">
        {persona ? (confirmed ? "페르소나가 최종 확정되었습니다." : "페르소나가 아직 확정되지 않았습니다.") : "저장된 페르소나가 없습니다."}
      </p>
      <div className="grid w-full grid-cols-2 gap-2">
        <Button type="button" className="w-full" disabled={openingChat || deleting} onClick={() => void onOpenChat()}>
          {openingChat ? "대화 준비 중" : "1:1 대화"}
        </Button>
        <Link
          href={routes.characterMemories(characterId)}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-outline-variant bg-surface-lowest px-3 text-[14px] font-medium"
        >
          기억 보관함
        </Link>
      </div>
      {persona && !confirmed ? (
        <Link href={routes.characterReview(characterId)} className="text-[13px] font-medium text-primary">
          페르소나 검토로 이동
        </Link>
      ) : null}
      {askDelete ? (
        <div className="w-full rounded-xl border border-outline-variant bg-surface-lowest p-4">
          <p className="text-[13px] font-medium leading-5">이 캐릭터를 삭제할까요?</p>
          <p className="mt-1.5 text-[12px] leading-4 text-on-surface-variant">
            페르소나, 원작 자료, 기억, 대화가 함께 삭제되며 복원할 수 없습니다.
          </p>
          <div className="mt-3 flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" disabled={deleting} onClick={() => setAskDelete(false)}>
              취소
            </Button>
            <Button type="button" className="flex-1" disabled={deleting} onClick={() => void onDelete()}>
              {deleting ? "삭제 중" : "삭제"}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="secondary" className="w-full text-error" disabled={deleting} onClick={() => setAskDelete(true)}>
          캐릭터 삭제
        </Button>
      )}
      {error ? (
        <p role="alert" className="text-center text-[12px] leading-4 text-error">
          {error}
        </p>
      ) : null}
      <p className="text-center text-[12px] leading-4 text-outline">기억 보관함은 아직 연결되지 않았습니다.</p>
    </div>
  );
}
