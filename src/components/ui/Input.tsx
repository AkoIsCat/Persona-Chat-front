import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export function Input({ label, id, className, leading, trailing, ...props }: InputProps) {
  const input = (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
          {leading}
        </span>
      ) : null}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-control border border-outline-variant bg-surface-lowest px-3.5 text-[14px] leading-5 text-on-surface outline-none placeholder:text-outline focus:border-primary",
          leading ? "pl-10" : false,
          trailing ? "pr-11" : false,
          className,
        )}
        {...props}
      />
      {trailing ? (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5">{trailing}</span>
      ) : null}
    </div>
  );

  if (!label) {
    return input;
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-[12px] font-medium leading-4 text-on-surface-variant">
      {label}
      {input}
    </label>
  );
}
