import { ServiceIcon } from '@/components/common/ServiceIcon';

type AppHeaderProps = {
  title?: string;
  action?: React.ReactNode;
};

export function AppHeader({ title = 'Persona Chat', action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-outline-variant bg-frame/95 px-5 py-3 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2">
        <ServiceIcon className="size-8 rounded-lg" />
        <h1 className="truncate text-[18px] font-semibold leading-6 tracking-tight">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
