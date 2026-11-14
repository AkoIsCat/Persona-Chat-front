import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatChatUpdated, type ChatRoomSummary } from "@/features/chat/api";
import { routes } from "@/lib/navigation";

type ChatRoomCardProps = {
  room: ChatRoomSummary;
};

export function ChatRoomCard({ room }: ChatRoomCardProps) {
  const title = room.title?.trim() ?? "";

  return (
    <Link href={routes.chatRoom(String(room.id))} className="block">
      <Card className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={room.character_name} size="sm" />
          <div className="min-w-0">
            <h2 className="truncate text-[14px] font-semibold leading-5">{room.character_name}</h2>
            {title ? <p className="mt-0.5 truncate text-[12px] leading-4 text-on-surface-variant">{title}</p> : null}
          </div>
        </div>
        <span className="shrink-0 text-[11px] leading-[14px] text-outline">{formatChatUpdated(room.updated_at)}</span>
      </Card>
    </Link>
  );
}
