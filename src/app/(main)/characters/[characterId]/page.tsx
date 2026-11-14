import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { getMockCharacter } from "@/data/characters";
import { CharacterProfile } from "@/features/character/CharacterProfile";
import { RealCharacterProfile } from "@/features/character/RealCharacterProfile";
import { routes } from "@/lib/navigation";

type CharacterPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { characterId } = await params;
  const character = getMockCharacter(characterId);

  return (
    <>
      <PageHeader title={character?.name ?? "캐릭터 프로필"} backHref={routes.home} />
      {character ? (
        <div className="px-5 pt-4">
          <Badge>임시 데이터</Badge>
          <CharacterProfile character={character} />
        </div>
      ) : /^\d+$/.test(characterId) ? (
        <RealCharacterProfile characterId={characterId} />
      ) : (
        <div className="px-5 py-5">
          <EmptyState title="캐릭터를 찾지 못했습니다" />
        </div>
      )}
    </>
  );
}
