import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span">;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-secondary-container px-2 py-0.5 text-[11px] font-semibold leading-[14px] text-primary",
        className,
      )}
      {...props}
    />
  );
}
