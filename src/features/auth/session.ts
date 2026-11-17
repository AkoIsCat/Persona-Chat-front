import { api, ApiError } from "@/lib/api/client";
import { saveAuthSession, type AuthUser } from "@/lib/auth/token";

type LoginResponse = {
  message: string;
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export function authErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.message.trim()) {
    return error.message;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "요청을 처리하지 못했습니다.";
}

export async function loginWithPassword(email: string, password: string, remember: boolean) {
  const result = await api.post<LoginResponse>("/login", { email, password, remember });
  saveAuthSession(result.access_token, result.user, remember);
  return result.user;
}

export function getCurrentUser() {
  return api.get<{ user_id: number }>("/auth/me");
}

export function updateNickname(nickname: string) {
  return api.patch<AuthUser>("/users/me", { nickname });
}

export function updatePassword(currentPassword: string, newPassword: string) {
  return api.put<{ user_id: number; message: string }>("/users/me/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

export function deleteAccount() {
  return api.delete<{ deleted: boolean; user_id: number }>("/users/me");
}

export function requestPasswordReset(email: string) {
  return api.post<{ message: string }>("/password-reset/request", { email });
}

export function verifyPasswordReset(email: string, code: string) {
  return api.post<{ message: string; reset_token: string }>("/password-reset/verify", { email, code });
}

export function confirmPasswordReset(input: {
  email: string;
  resetToken: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  return api.post<{ message: string }>("/password-reset/confirm", {
    email: input.email,
    reset_token: input.resetToken,
    new_password: input.newPassword,
    new_password_confirm: input.newPasswordConfirm,
  });
}

export async function signupAndLogin(input: { email: string; password: string; nickname: string }) {
  await api.post("/users", input);
  return loginWithPassword(input.email, input.password, true);
}
