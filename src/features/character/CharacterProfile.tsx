'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { getMockChatRoomByCharacter } from '@/data/chats';
import { routes } from '@/lib/navigation';
import type { MockCharacter } from '@/types/character.types';

type CharacterProfileProps = {
  character: MockCharacter;
};

export function CharacterProfile({ character }: CharacterProfileProps) {
  const room = getMockChatRoomByCharacter(character.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(character.imageUrl);

  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  function onPhotoChange(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return nextUrl;
    });
  }

  return (
    <div className="flex flex-col items-center gap-5 px-5 py-6">
      <div className="relative">
        <Avatar
          name={character.name}
          src={photoUrl}
          className="size-20 text-[22px]"
        />
        <button
          type="button"
          aria-label="프로필 사진 수정"
          onClick={() => inputRef.current?.click()}
          className="absolute right-0 bottom-0 inline-flex size-7 items-center justify-center rounded-full border border-surface-lowest bg-primary text-on-primary cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            onPhotoChange(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </div>
      <div className="text-center">
        <h2 className="text-[22px] font-semibold leading-7">
          {character.name}
        </h2>
        <p className="mt-2 text-[15px] leading-[22px] text-on-surface-variant">
          “{character.quote}”
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {character.tags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <Link
          href={room ? routes.chatRoom(room.id) : routes.chats}
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-3 text-[14px] font-medium text-on-primary"
        >
          1:1 대화
        </Link>
        <Link
          href={routes.characterMemories(character.id)}
          className="inline-flex min-h-11 items-center justify-center rounded-control border border-outline-variant bg-surface-lowest px-3 text-[14px] font-medium"
        >
          기억 보관함
        </Link>
      </div>
      <p className="text-center text-[12px] leading-4 text-outline">
        태그와 인용 문구는 화면 표시용 임시 데이터입니다. 바꾼 프로필 사진은 이
        화면에만 보이며 저장되지 않습니다.
      </p>
    </div>
  );
}
