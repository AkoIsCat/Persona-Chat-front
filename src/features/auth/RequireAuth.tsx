"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceIcon } from "@/components/common/ServiceIcon";
import { getCurrentUser } from "@/features/auth/session";
import { ApiError, isServerUnavailable } from "@/lib/api/client";
import { clearAccessToken, getAccessToken, getAuthUser } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

const WAKE_HINT_MS = 1500;
const WAKE_RETRY_MS = 2500;

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    let active = true;

    async function verify() {
      if (!getAccessToken()) {
        router.replace(routes.login);
        return;
      }

      if (active) {
        setReady(true);
      }

      while (active && getAccessToken()) {
        const slowTimer = window.setTimeout(() => {
          if (active) {
            setWaking(true);
          }
        }, WAKE_HINT_MS);

        try {
          const current = await getCurrentUser();
          window.clearTimeout(slowTimer);
          if (!active) {
            return;
          }

          const stored = getAuthUser();
          if (stored && stored.id !== current.user_id) {
            clearAccessToken();
            router.replace(routes.login);
            return;
          }

          setWaking(false);
          return;
        } catch (error) {
          window.clearTimeout(slowTimer);
          if (!active) {
            return;
          }

          if (!getAccessToken() || (error instanceof ApiError && error.status === 401)) {
            router.replace(routes.login);
            return;
          }

          if (!isServerUnavailable(error)) {
            setWaking(false);
            return;
          }

          setWaking(true);
          await delay(WAKE_RETRY_MS);
        }
      }
    }

    void verify();
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return <BootSplash />;
  }

  return (
    <div className="relative h-full min-h-0">
      {waking ? (
        <p
          role="status"
          className="absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 rounded-xl bg-primary px-3.5 py-2.5 text-center text-[12px] leading-4 text-on-primary shadow-sm"
        >
          서버가 잠들어 있어 깨우는 중입니다. 수십 초 걸릴 수 있어요.
        </p>
      ) : null}
      {children}
    </div>
  );
}

function BootSplash() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <ServiceIcon className="size-16 rounded-[1.25rem]" />
      <p className="text-[14px] leading-5 text-on-surface-variant">앱을 준비하고 있습니다.</p>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
