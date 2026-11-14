"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUnauthorizedHandler } from "@/lib/api/client";
import { routes } from "@/lib/navigation";

export function AuthSession() {
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      router.replace(routes.login);
    });

    return () => setUnauthorizedHandler(null);
  }, [router]);

  return null;
}
