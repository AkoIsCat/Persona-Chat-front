"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authErrorMessage, loginWithPassword } from "@/features/auth/session";
import { PasswordField } from "@/features/auth/PasswordField";
import { getAccessToken } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getAccessToken()) {
      router.replace(routes.home);
    }
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await loginWithPassword(trimmedEmail, password, remember);
      router.replace(routes.home);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
        <Input
          id="login-email"
          label="이메일 계정"
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          value={email}
          autoComplete="off"
          onChange={(event) => setEmail(event.target.value)}
          leading={<MailIcon />}
        />
        <PasswordField
          id="login-password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={setPassword}
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-[12px] leading-4 text-on-surface-variant">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 accent-primary"
            />
            로그인 상태 유지
          </label>
          <Link href={routes.passwordReset} className="text-[12px] leading-4 text-outline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>
        {error ? (
          <p role="alert" className="text-[12px] leading-4 text-error">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={submitting} className="mt-2 w-full rounded-xl py-3.5">
          {submitting ? "로그인 중" : "로그인"}
        </Button>
      </form>
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
