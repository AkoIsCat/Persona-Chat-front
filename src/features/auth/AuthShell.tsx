import Link from 'next/link';
import { ServiceIcon } from '@/components/common/ServiceIcon';
import { routes } from '@/lib/navigation';
import { cn } from '@/lib/utils';

type AuthShellProps = {
  mode: 'login' | 'signup';
  children: React.ReactNode;
};

export function AuthShell({ mode, children }: AuthShellProps) {
  return (
    <div className="h-full overflow-x-hidden overflow-y-auto bg-surface-lowest">
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col px-6 pt-[max(12px,env(safe-area-inset-top))]">
          <header className="pt-4 pb-2">
            <div className="mb-3 flex items-center gap-2">
              <ServiceIcon className="size-7 rounded-lg" />
              <span className="text-[18px] font-semibold tracking-tight">
                Persona Chat
              </span>
            </div>
            <h1 className="text-[20px] font-semibold leading-7 tracking-tight">
              당신이 좋아하는 캐릭터와,
              <br />
              <span className="text-primary">이제 직접 대화하세요.</span>
            </h1>
            <p className="mt-2 text-[12px] leading-4 text-on-surface-variant">
              원작 속 캐릭터의 정보를 기반으로 AI가 분석하고, 당신만의 특별한
              페르소나로 다시 태어납니다.
            </p>
          </header>

          <div className="mt-3.5 mb-5 flex items-center gap-3 rounded-2xl border border-outline-variant bg-secondary-container/40 p-3.5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-surface-lowest text-primary">
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </span>
            <div>
              <p className="text-[12px] font-semibold text-on-surface">
                새로운 대화가 기다려요
              </p>
              <p className="text-[11px] leading-3.5 text-on-surface-variant">
                실시간 감정 인터랙션 & 맞춤 페르소나
              </p>
            </div>
          </div>

          <div className="mb-5 flex border-b border-outline-variant">
            <AuthTab href={routes.login} active={mode === 'login'}>
              로그인
            </AuthTab>
            <AuthTab href={routes.signup} active={mode === 'signup'}>
              회원가입
            </AuthTab>
          </div>

          {children}
        </div>

        <footer className="border-t border-outline-variant px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))] text-center text-[12px] leading-4 text-on-surface-variant">
          {mode === 'login' ? (
            <p>
              계정이 없으신가요?
              <Link
                href={routes.signup}
                className="ml-1 font-semibold text-primary"
              >
                회원가입
              </Link>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?
              <Link
                href={routes.login}
                className="ml-1 font-semibold text-primary"
              >
                로그인하기
              </Link>
            </p>
          )}
          <p className="mt-2 text-[10px] leading-3.5 text-outline">
            © 2026 Persona Chat. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

function AuthTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex-1 border-b-2 pb-2.5 text-center text-[14px] leading-5',
        active
          ? 'border-primary font-semibold text-primary'
          : 'border-transparent font-medium text-outline',
      )}
    >
      {children}
    </Link>
  );
}
