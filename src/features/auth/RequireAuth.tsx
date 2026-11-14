"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/features/auth/session";
import { clearAccessToken, getAccessToken, getAuthUser } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!getAccessToken()) {
        router.replace(routes.login);
        return;
      }

      try {
        const current = await getCurrentUser();
        const stored = getAuthUser();
        if (stored && stored.id !== current.user_id) {
          clearAccessToken();
          router.replace(routes.login);
          return;
        }
        if (active) {
          setAllowed(true);
        }
      } catch {
        if (!active) {
          return;
        }
        if (!getAccessToken()) {
          router.replace(routes.login);
          return;
        }
        setAllowed(true);
      }
    }

    void verify();
    return () => {
      active = false;
    };
  }, [router]);

  if (!allowed) {
    return null;
  }

  return children;
}
