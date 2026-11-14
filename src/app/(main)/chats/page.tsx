import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatRoomList } from "@/features/chat/ChatRoomList";

export default function ChatsPage() {
  return (
    <>
      <PageHeader title="채팅" />
      <PageContainer className="flex flex-col gap-3">
        <ChatRoomList />
      </PageContainer>
    </>
  );
}
