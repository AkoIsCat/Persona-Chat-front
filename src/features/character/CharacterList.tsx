import { CharacterCard } from "@/features/character/CharacterCard";
import type { CharacterSummary } from "@/features/character/persona";

type CharacterListProps = {
  characters: CharacterSummary[];
};

export function CharacterList({ characters }: CharacterListProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
