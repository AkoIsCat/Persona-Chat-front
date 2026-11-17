"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authErrorMessage, signupAndLogin } from "@/features/auth/session";
import { PasswordField } from "@/features/auth/PasswordField";
import { getAccessToken } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [marketing, setMarketing] = useState(false);
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

    const nickname = name.trim();
    const trimmedEmail = email.trim();
    if (!nickname) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (!trimmedEmail) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await signupAndLogin({ email: trimmedEmail, password, nickname });
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
          id="signup-name"
          label="이름"
          placeholder="이름을 입력해주세요"
          value={name}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
          leading={<PersonIcon />}
        />
        <Input
          id="signup-email"
          label="이메일 계정"
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          value={email}
          autoComplete="off"
          onChange={(event) => setEmail(event.target.value)}
          leading={<MailIcon />}
        />
        <PasswordField
          id="signup-password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          id="signup-password-confirm"
          label="비밀번호 확인"
          placeholder="비밀번호를 한 번 더 입력해주세요"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
        />
        <div className="flex flex-col gap-2 pt-1 text-[12px] leading-4 text-on-surface-variant">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span>[선택] 이벤트 및 마케팅 혜택 알림 동의</span>
          </label>
        </div>
        {error ? (
          <p role="alert" className="text-[12px] leading-4 text-error">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={submitting} className="mt-2 w-full rounded-xl py-3.5">
          {submitting ? "가입 중" : "회원가입"}
        </Button>
      </form>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
