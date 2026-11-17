"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/features/auth/PasswordField";
import {
  authErrorMessage,
  confirmPasswordReset,
  requestPasswordReset,
  verifyPasswordReset,
} from "@/features/auth/session";
import { routes } from "@/lib/navigation";

type Step = "email" | "code" | "password" | "done";

export function PasswordResetForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const trimmed = email.trim();
    if (!trimmed) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const result = await requestPasswordReset(trimmed);
      setEmail(trimmed);
      setNotice(result.message);
      setStep("code");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("인증번호 6자리를 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await verifyPasswordReset(email, code);
      setResetToken(result.reset_token);
      setNotice("");
      setStep("password");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function onConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await confirmPasswordReset({
        email,
        resetToken,
        newPassword: password,
        newPasswordConfirm: passwordConfirm,
      });
      setNotice(result.message);
      setStep("done");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-3.5">
      <h2 className="text-[16px] font-semibold leading-6">비밀번호 찾기</h2>
      {step === "email" ? (
        <form className="flex flex-col gap-3.5" onSubmit={(event) => void onRequest(event)}>
          <Input
            id="reset-email"
            label="가입한 이메일"
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            value={email}
            autoComplete="off"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "요청 중" : "인증번호 받기"}
          </Button>
        </form>
      ) : null}
      {step === "code" ? (
        <form className="flex flex-col gap-3.5" onSubmit={(event) => void onVerify(event)}>
          <Input
            id="reset-code"
            label="인증번호"
            inputMode="numeric"
            placeholder="6자리 숫자"
            value={code}
            autoComplete="one-time-code"
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "확인 중" : "인증번호 확인"}
          </Button>
          <Button type="button" variant="secondary" disabled={submitting} onClick={() => void onRequest({ preventDefault() {} } as React.FormEvent<HTMLFormElement>)}>
            인증번호 다시 받기
          </Button>
        </form>
      ) : null}
      {step === "password" ? (
        <form className="flex flex-col gap-3.5" onSubmit={(event) => void onConfirm(event)}>
          <PasswordField id="reset-password" label="새 비밀번호" placeholder="8자 이상" value={password} onChange={setPassword} />
          <PasswordField
            id="reset-password-confirm"
            label="새 비밀번호 확인"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "변경 중" : "비밀번호 변경"}
          </Button>
        </form>
      ) : null}
      {step === "done" ? (
        <Button type="button" className="w-full" onClick={() => router.push(routes.login)}>
          로그인 화면으로
        </Button>
      ) : null}
      {notice ? <p className="text-[12px] leading-4 text-primary">{notice}</p> : null}
      {error ? (
        <p role="alert" className="text-[12px] leading-4 text-error">
          {error}
        </p>
      ) : null}
      {step !== "done" ? (
        <Link href={routes.login} className="text-center text-[12px] font-medium text-primary">
          로그인으로 돌아가기
        </Link>
      ) : null}
    </div>
  );
}
