import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { PersonaReviewForm } from "@/features/character/PersonaReviewForm";
import { routes } from "@/lib/navigation";

type ReviewPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { characterId } = await params;

  return (
    <>
      <PageHeader title="분석 결과" backHref={routes.characterAnalyzing(characterId)} />
      <PageContainer className="flex flex-col gap-4">
        <p className="text-[13px] font-medium text-outline">검토 및 수정</p>
        <PersonaReviewForm characterId={characterId} />
      </PageContainer>
    </>
  );
}
