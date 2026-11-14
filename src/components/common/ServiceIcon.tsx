import { cn } from "@/lib/utils";

type ServiceIconProps = {
  className?: string;
};

export function ServiceIcon({ className }: ServiceIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icons/service-icon.png" alt="" className={cn("shrink-0 object-cover", className)} />
  );
}
