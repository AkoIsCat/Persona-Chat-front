import Link from "next/link";

type PageHeaderProps = {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, backHref, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-outline-variant bg-frame/95 px-5 py-3 backdrop-blur-md">
      {backHref ? (
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="inline-flex size-10 items-center justify-center rounded-control text-on-surface"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : null}
      <h1 className="min-w-0 flex-1 truncate text-[18px] font-semibold leading-6">{title}</h1>
      {action}
    </header>
  );
}
