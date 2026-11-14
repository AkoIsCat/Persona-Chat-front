import { Avatar } from "@/components/ui/Avatar";

type TypingIndicatorProps = {
  characterName: string;
};

export function TypingIndicator({ characterName }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 pb-3" aria-label="답변을 작성하고 있습니다">
      <Avatar name={characterName} size="sm" className="size-9" />
      <div className="flex items-center gap-1 rounded-tl-[0.35rem] rounded-tr-[1.125rem] rounded-br-[1.125rem] rounded-bl-[1.125rem] bg-[#f3f4f6] px-4 py-3">
        <span className="size-1.5 rounded-full bg-outline" />
        <span className="size-1.5 rounded-full bg-outline" />
        <span className="size-1.5 rounded-full bg-outline" />
      </div>
    </div>
  );
}
