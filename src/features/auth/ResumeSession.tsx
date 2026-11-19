"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

export function ResumeSession() {
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) {
      router.replace(routes.home);
    }
  }, [router]);

  return null;
}
