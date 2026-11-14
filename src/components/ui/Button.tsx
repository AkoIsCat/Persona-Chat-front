"use client";

import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  pending?: boolean;
  hidePendingLabel?: boolean;
};

const variantClassName = {
  primary: "bg-primary text-on-primary",
  secondary: "border border-outline-variant bg-surface-lowest text-on-surface",
  ghost: "bg-transparent text-on-surface",
};

export function Button({
  variant = "primary",
  pending = false,
  hidePendingLabel = false,
  className,
  children,
  type = "button",
  disabled,
  onClick,
  title,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={pending || disabled || undefined}
      data-pending={pending ? "true" : undefined}
      title={pending ? "추후 연결" : title}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-control px-4 text-[14px] font-medium leading-5 active:scale-[0.98] disabled:cursor-pointer disabled:opacity-50",
        variantClassName[variant],
        pending && "cursor-pointer opacity-70",
        className,
      )}
      {...props}
    >
      {children}
      {pending ? (
        <span className={hidePendingLabel ? "sr-only" : "text-[11px] font-semibold"}>추후 연결</span>
      ) : null}
    </button>
  );
}
