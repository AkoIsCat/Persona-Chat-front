import { formatChatDay, type ChatMessageRecord } from "@/features/chat/api";
import { ChatMessage } from "@/features/chat/ChatMessage";

type ChatMessageListProps = {
  characterName: string;
  messages: ChatMessageRecord[];
};

export function ChatMessageList({ characterName, messages }: ChatMessageListProps) {
  let previousDay = "";

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {messages.map((message) => {
        const day = formatChatDay(message.created_at);
        const showDay = day !== "" && day !== previousDay;
        previousDay = day || previousDay;
        return (
          <div key={message.id} className="flex flex-col gap-4">
            {showDay ? (
              <div className="flex justify-center">
                <span className="rounded-full bg-[#f3f4f6] px-3.5 py-1 text-[11px] font-medium text-outline">{day}</span>
              </div>
            ) : null}
            <ChatMessage message={message} characterName={characterName} />
          </div>
        );
      })}
    </div>
  );
}
