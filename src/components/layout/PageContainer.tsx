import { cn } from "@/lib/utils";

type PageContainerProps = React.ComponentProps<"div">;

export function PageContainer({ className, ...props }: PageContainerProps) {
  return <div className={cn("px-5 py-5", className)} {...props} />;
}
