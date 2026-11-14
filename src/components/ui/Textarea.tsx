import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
};

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  const textarea = (
    <textarea
      id={id}
      className={cn(
        "min-h-11 w-full resize-none rounded-control border border-outline-variant bg-surface-lowest px-3.5 py-3 text-[15px] leading-[22px] text-on-surface outline-none placeholder:text-outline focus:border-primary",
        className,
      )}
      {...props}
    />
  );

  if (!label) {
    return textarea;
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-[14px] font-medium leading-5 text-on-surface">
      {label}
      {textarea}
    </label>
  );
}
