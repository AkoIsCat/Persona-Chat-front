import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { PersonaIntro } from '@/app/(main)/home/PersonaIntro';
import { HomeGreeting } from '@/features/auth/SessionProfile';
import { HomeCharacterSection } from '@/features/character/HomeCharacterSection';
import { RecentChat } from '@/features/chat/RecentChat';
import { routes } from '@/lib/navigation';

export default function HomePage() {
  return (
    <>
      <AppHeader
        action={
          <Link
            href={routes.charactersNew}
            className="inline-flex min-h-8 items-center rounded-lg bg-primary px-3.5 text-[12px] font-semibold text-on-primary"
          >
            + 캐릭터 만들기
          </Link>
        }
      />
      <PageContainer className="flex flex-col gap-6">
        <section>
          <HomeGreeting />
          <p className="mt-1 text-[12px] font-medium leading-4 text-outline">
            나만의 페르소나 AI와 대화를 시작해보세요.
          </p>
        </section>
        <HomeCharacterSection />
        <RecentChat />
        <PersonaIntro />
      </PageContainer>
    </>
  );
}
