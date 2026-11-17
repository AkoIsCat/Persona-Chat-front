import { PageHeader } from "@/components/layout/PageHeader";
import { MyPageContent } from "@/features/mypage/MyPageContent";

export default function MyPage() {
  return (
    <>
      <PageHeader title="마이페이지" />
      <MyPageContent />
    </>
  );
}
