import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionTitle({ title, action, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-2.5 flex items-center justify-between", className)}>
      <h2 className="text-[15px] font-semibold leading-[22px] text-on-surface">{title}</h2>
      {action}
    </div>
  );
}
