import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CharacterCreateForm } from "@/features/character/CharacterCreateForm";
import { routes } from "@/lib/navigation";

export default function NewCharacterPage() {
  return (
    <>
      <PageHeader title="새로운 캐릭터 만들기" backHref={routes.home} />
      <PageContainer className="flex flex-col gap-4">
        <p className="text-[13px] font-medium text-outline">자료 입력</p>
        <CharacterCreateForm />
      </PageContainer>
    </>
  );
}
