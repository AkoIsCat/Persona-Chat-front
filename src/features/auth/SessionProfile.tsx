"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { clearAccessToken, getAuthUser, type AuthUser } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

export function SessionProfile({ user: providedUser }: { user?: AuthUser | null }) {
  const [storedUser, setStoredUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (providedUser === undefined) {
      setStoredUser(getAuthUser());
    }
  }, [providedUser]);

  const user = providedUser === undefined ? storedUser : providedUser;

  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex size-16 items-center justify-center rounded-full border border-outline-variant bg-secondary-container text-[20px] font-semibold text-primary">
        {user?.nickname.slice(0, 1) ?? ""}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[18px] font-semibold leading-6">{user ? `${user.nickname} 님` : ""}</p>
        <p className="mt-0.5 truncate text-[13px] leading-5 text-on-surface-variant">{user?.email ?? ""}</p>
      </div>
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="min-h-9 px-2 text-[13px] text-outline"
      onClick={() => {
        clearAccessToken();
        router.replace(routes.login);
      }}
    >
      로그아웃
    </Button>
  );
}

export function HomeGreeting() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    setNickname(getAuthUser()?.nickname ?? "");
  }, []);

  return <h2 className="mt-3 text-[20px] font-semibold leading-7">안녕하세요, {nickname} 님 👋</h2>;
}
