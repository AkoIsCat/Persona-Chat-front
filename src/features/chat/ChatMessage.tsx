import { Avatar } from "@/components/ui/Avatar";
import { formatChatTime, type ChatMessageRecord } from "@/features/chat/api";
import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: ChatMessageRecord;
  characterName: string;
};

export function ChatMessage({ message, characterName }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timeLabel = formatChatTime(message.created_at);

  if (message.role === "system") {
    return <p className="text-center text-[12px] leading-4 text-outline">{message.content}</p>;
  }

  return (
    <div className={cn("flex items-end gap-1.5", isUser ? "justify-end pl-10" : "justify-start pr-8")}>
      {isUser ? null : <Avatar name={characterName} size="sm" className="size-9" />}
      {isUser ? <time className="mb-0.5 shrink-0 text-[10px] leading-[14px] text-outline">{timeLabel}</time> : null}
      <p
        className={cn(
          "max-w-[80%] px-4 py-2.5 text-[14px] leading-6",
          isUser
            ? "rounded-tl-[1.125rem] rounded-tr-[0.35rem] rounded-br-[1.125rem] rounded-bl-[1.125rem] bg-primary text-on-primary"
            : "rounded-tl-[0.35rem] rounded-tr-[1.125rem] rounded-br-[1.125rem] rounded-bl-[1.125rem] bg-[#f3f4f6] text-on-surface",
        )}
      >
        {message.content}
      </p>
      {isUser ? null : <time className="mb-0.5 shrink-0 text-[10px] leading-[14px] text-outline">{timeLabel}</time>}
    </div>
  );
}
