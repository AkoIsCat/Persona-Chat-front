import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CharacterAnalysisRunner } from "@/features/character/CharacterAnalysisRunner";
import { routes } from "@/lib/navigation";

type AnalyzingPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function AnalyzingPage({ params }: AnalyzingPageProps) {
  const { characterId } = await params;

  return (
    <>
      <PageHeader title="캐릭터 분석" backHref={routes.charactersNew} />
      <PageContainer className="flex flex-col gap-4">
        <CharacterAnalysisRunner characterId={characterId} />
      </PageContainer>
    </>
  );
}
