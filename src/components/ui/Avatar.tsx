import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const sizeClassName = {
  sm: "size-10 text-[13px]",
  md: "size-12 text-[15px]",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initial = name.trim().slice(0, 1);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn(
          "shrink-0 rounded-full border border-outline-variant object-cover",
          sizeClassName[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-outline-variant bg-secondary-container font-semibold text-primary",
        sizeClassName[size],
        className,
      )}
    >
      {initial}
    </span>
  );
}
