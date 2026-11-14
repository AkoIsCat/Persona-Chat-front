import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { RequireAuth } from "@/features/auth/RequireAuth";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth>
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">{children}</div>
        <BottomNavigation />
      </div>
    </RequireAuth>
  );
}
