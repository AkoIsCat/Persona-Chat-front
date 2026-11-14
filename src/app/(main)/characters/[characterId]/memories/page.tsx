import { PageHeader } from "@/components/layout/PageHeader";
import { MemoryArchive } from "@/features/memory/MemoryArchive";
import { routes } from "@/lib/navigation";

type MemoriesPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function MemoriesPage({ params }: MemoriesPageProps) {
  const { characterId } = await params;

  return (
    <>
      <PageHeader title="기억 보관함" backHref={routes.character(characterId)} />
      <MemoryArchive characterId={characterId} />
    </>
  );
}
