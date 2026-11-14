import Link from "next/link";
import { ServiceIcon } from "@/components/common/ServiceIcon";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/navigation";

const features = [
  {
    title: "링크 하나로 손쉬운 캐릭터 생성",
    description: "위키나 웹 문서 링크만 넣으면 AI가 자동 분석",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656l-1.414 1.414a4 4 0 01-5.656-5.656l1.414-1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 010-5.656l1.414-1.414a4 4 0 015.656 5.656l-1.414 1.414" />
      </svg>
    ),
  },
  {
    title: "자연스럽고 생생한 1:1 대화",
    description: "친근한 말풍선과 말투로 이어지는 대화",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "대화 내용을 기억하는 장기기억",
    description: "나의 취향과 일상 정보를 보관함에 담아 기억해요",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function StartPage() {
  return (
    <main className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-surface-lowest px-6 pt-12 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <header className="flex flex-col items-center pt-6 text-center">
        <ServiceIcon className="mb-6 size-16 rounded-[1.25rem]" />
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-medium text-on-surface-variant">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          AI 페르소나 롤플레잉 메신저
        </p>
        <h1 className="text-[26px] font-semibold leading-snug tracking-tight">
          내가 좋아하는 캐릭터와
          <br />
          <span className="text-primary">진짜 친구처럼</span> 대화하세요
        </h1>
        <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-on-surface-variant">
          원작 속 캐릭터 정보를 AI가 스스로 분석하여 성격과 말투가 살아있는 나만의 페르소나를 만듭니다.
        </p>
      </header>

      <section className="my-auto flex flex-col gap-3 py-6">
        {features.map((feature) => (
          <article key={feature.title} className="flex items-center gap-3.5 rounded-2xl border border-outline-variant bg-frame p-3.5">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-surface-lowest text-primary">
              {feature.icon}
            </span>
            <div className="min-w-0 text-left">
              <h2 className="text-[14px] font-semibold leading-5">{feature.title}</h2>
              <p className="mt-0.5 truncate text-[12px] leading-4 text-on-surface-variant">{feature.description}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="flex flex-col gap-3 pt-2">
        <Link
          href={routes.signup}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[16px] font-semibold text-on-primary active:scale-[0.98]"
        >
          지금 시작하기
        </Link>
        <Link
          href={routes.login}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#f3f4f6] px-5 text-[15px] font-semibold text-on-surface active:scale-[0.98]"
        >
          이미 계정이 있나요? 로그인하기
        </Link>
        <p className="mt-1 text-center text-[11px] leading-4 text-outline">
          시작 시{" "}
          <Button variant="ghost" pending hidePendingLabel className="inline min-h-0 px-0 text-[11px] font-normal text-outline underline">
            이용약관
          </Button>{" "}
          및{" "}
          <Button variant="ghost" pending hidePendingLabel className="inline min-h-0 px-0 text-[11px] font-normal text-outline underline">
            개인정보처리방침
          </Button>
          에 동의하게 됩니다.
        </p>
      </footer>
    </main>
  );
}
