const STORAGE_KEY = "persona-chat.access-token";
const USER_KEY = "persona-chat.user";

export type AuthUser = {
  id: number;
  email: string;
  nickname: string;
};

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function getAccessToken() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(STORAGE_KEY);
}

export function saveAccessToken(token: string, remember = true) {
  if (!canUseBrowserStorage()) {
    throw new Error("토큰은 브라우저에서만 저장할 수 있습니다.");
  }

  const value = token.trim();
  if (!value) {
    throw new Error("저장할 토큰이 없습니다.");
  }

  const primary = remember ? window.localStorage : window.sessionStorage;
  const secondary = remember ? window.sessionStorage : window.localStorage;
  secondary.removeItem(STORAGE_KEY);
  primary.setItem(STORAGE_KEY, value);
}

export function saveAuthSession(accessToken: string, user: AuthUser, remember = true) {
  saveAccessToken(accessToken, remember);
  const primary = remember ? window.localStorage : window.sessionStorage;
  const secondary = remember ? window.sessionStorage : window.localStorage;
  secondary.removeItem(USER_KEY);
  primary.setItem(USER_KEY, JSON.stringify(user));
}

export function updateAuthUser(user: AuthUser) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const useSession = window.sessionStorage.getItem(STORAGE_KEY) !== null;
  const primary = useSession ? window.sessionStorage : window.localStorage;
  const secondary = useSession ? window.localStorage : window.sessionStorage;
  secondary.removeItem(USER_KEY);
  primary.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(USER_KEY) ?? window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof parsed.id !== "number" || typeof parsed.email !== "string" || typeof parsed.nickname !== "string") {
      return null;
    }
    return { id: parsed.id, email: parsed.email, nickname: parsed.nickname };
  } catch {
    return null;
  }
}

export function clearAccessToken() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(USER_KEY);
}
