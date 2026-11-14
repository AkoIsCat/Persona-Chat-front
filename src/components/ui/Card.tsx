import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"article">;

export function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-outline-variant bg-surface-lowest p-3",
        className,
      )}
      {...props}
    />
  );
}
