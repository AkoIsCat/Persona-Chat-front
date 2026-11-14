import { ChatThread } from "@/features/chat/ChatThread";

type ChatRoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = await params;
  return <ChatThread roomId={roomId} />;
}
