import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { CharacterSummary } from "@/features/character/persona";
import { routes } from "@/lib/navigation";

type CharacterCardProps = {
  character: CharacterSummary;
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link href={routes.character(String(character.id))} className="block">
      <Card className="flex items-center gap-3">
        <Avatar name={character.name} src={character.image_url} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold leading-5">{character.name}</h3>
          <p className="mt-0.5 truncate text-[11px] leading-[14px] text-on-surface-variant">
            {character.description?.trim() || "설명이 없습니다."}
          </p>
        </div>
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-outline" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Card>
    </Link>
  );
}
