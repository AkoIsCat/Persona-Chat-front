import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { MyPageContent } from "@/features/mypage/MyPageContent";

export default function MyPage() {
  return (
    <>
      <PageHeader
        title="마이페이지"
        action={
          <Button variant="ghost" pending hidePendingLabel aria-label="알림, 추후 연결" className="size-10 min-h-10 px-0">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
              <path strokeLinecap="round" d="M9.5 17a2.5 2.5 0 005 0" />
            </svg>
          </Button>
        }
      />
      <MyPageContent />
    </>
  );
}
