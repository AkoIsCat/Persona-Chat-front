"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/features/auth/PasswordField";
import { LogoutButton, SessionProfile } from "@/features/auth/SessionProfile";
import { authErrorMessage, deleteAccount, updateNickname, updatePassword } from "@/features/auth/session";
import { listChatRooms } from "@/features/chat/api";
import { characterErrorMessage, listCharacters } from "@/features/character/persona";
import { listCharacterMemories } from "@/features/memory/api";
import { clearAccessToken, getAuthUser, updateAuthUser, type AuthUser } from "@/lib/auth/token";
import { routes } from "@/lib/navigation";

type PageStats = {
  characters: number;
  rooms: number;
  memories: number;
};

export function MyPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getAuthUser();
    setUser(stored);
    setNickname(stored?.nickname ?? "");
  }, []);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [savingNickname, setSavingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [stats, setStats] = useState<PageStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    setStats(null);
    try {
      const [characters, rooms] = await Promise.all([listCharacters(), listChatRooms()]);
      const memoryLists = await Promise.all(
        characters.map((character) => listCharacterMemories(character.id)),
      );
      setStats({
        characters: characters.length,
        rooms: rooms.length,
        memories: memoryLists.reduce((total, memories) => total + memories.length, 0),
      });
    } catch (caught) {
      setStats(null);
      setStatsError(statsErrorMessage(caught));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const statItems = [
    { label: "내 캐릭터", value: stats?.characters },
    { label: "진행 중 대화", value: stats?.rooms },
    { label: "저장된 기억", value: stats?.memories },
  ];

  async function onSaveNickname() {
    const nextNickname = nickname.trim();
    if (!nextNickname || nextNickname.length > 50) {
      setNicknameError("닉네임은 1자 이상 50자 이하여야 합니다.");
      return;
    }
    if (savingNickname) {
      return;
    }
    setSavingNickname(true);
    setNicknameError("");
    try {
      const updated = await updateNickname(nextNickname);
      updateAuthUser(updated);
      setUser(updated);
      setNickname(updated.nickname);
      setProfileOpen(false);
    } catch (caught) {
      setNicknameError(authErrorMessage(caught));
    } finally {
      setSavingNickname(false);
    }
  }

  async function onSavePassword() {
    if (!currentPassword.trim()) {
      setPasswordError("기존 비밀번호를 입력해 주세요.");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      setPasswordError("새 비밀번호는 8자 이상 128자 이하여야 합니다.");
      return;
    }
    if (savingPassword) {
      return;
    }
    setSavingPassword(true);
    setPasswordError("");
    setPasswordMessage("");
    try {
      const result = await updatePassword(currentPassword, newPassword);
      setPasswordMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordOpen(false);
    } catch (caught) {
      setPasswordError(authErrorMessage(caught));
    } finally {
      setSavingPassword(false);
    }
  }

  async function onDeleteAccount() {
    if (deleting) {
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
      clearAccessToken();
      router.replace(routes.login);
    } catch (caught) {
      setDeleteError(authErrorMessage(caught));
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-5">
      <Card className="flex flex-col gap-4 p-5">
        <SessionProfile user={user} />
        {statsError ? (
          <div className="flex flex-col gap-3 border-t border-outline-variant pt-3">
            <p role="alert" className="text-[12px] leading-4 text-error">
              {statsError}
            </p>
            <Button type="button" variant="secondary" disabled={statsLoading} onClick={() => void loadStats()}>
              {statsLoading ? "다시 불러오는 중" : "다시 시도"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 border-t border-outline-variant pt-3" aria-busy={statsLoading}>
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center rounded-xl bg-[#f3f4f6] px-1 py-2">
                <span className="text-[18px] font-semibold leading-6">{statsLoading || stat.value === undefined ? "…" : stat.value}</span>
                <span className="mt-1 text-center text-[12px] leading-4 text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="px-1 text-[12px] font-semibold text-outline">계정 설정</h2>
        <Card className="overflow-hidden p-0">
          <Button
            variant="ghost"
            className="h-auto min-h-14 w-full justify-between rounded-none border-b border-outline-variant px-4 py-3 text-left"
            onClick={() => {
              setNickname(user?.nickname ?? "");
              setNicknameError("");
              setProfileOpen((open) => !open);
            }}
          >
            <span className="text-[15px] font-medium">프로필 정보 수정</span>
          </Button>
          {profileOpen ? (
            <div className="flex flex-col gap-3 border-b border-outline-variant px-4 py-4">
              <Input id="nickname" label="닉네임" value={nickname} disabled={savingNickname} onChange={(event) => setNickname(event.target.value)} />
              {nicknameError ? <p className="text-[12px] leading-4 text-error">{nicknameError}</p> : null}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" disabled={savingNickname} onClick={() => setProfileOpen(false)}>
                  취소
                </Button>
                <Button className="flex-1" disabled={savingNickname} onClick={() => void onSaveNickname()}>
                  {savingNickname ? "저장 중" : "저장"}
                </Button>
              </div>
            </div>
          ) : null}
          <Button
            variant="ghost"
            className="h-auto min-h-14 w-full justify-between rounded-none px-4 py-3 text-left"
            onClick={() => {
              setPasswordError("");
              setPasswordOpen((open) => !open);
            }}
          >
            <span className="text-[15px] font-medium">비밀번호 변경</span>
          </Button>
          {passwordOpen ? (
            <div className="flex flex-col gap-3 px-4 py-4">
              <PasswordField id="current-password" label="기존 비밀번호" placeholder="기존 비밀번호" value={currentPassword} disabled={savingPassword} onChange={setCurrentPassword} />
              <PasswordField id="new-password" label="새 비밀번호" placeholder="8자 이상" value={newPassword} disabled={savingPassword} onChange={setNewPassword} />
              {passwordError ? <p className="text-[12px] leading-4 text-error">{passwordError}</p> : null}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" disabled={savingPassword} onClick={() => setPasswordOpen(false)}>
                  취소
                </Button>
                <Button className="flex-1" disabled={savingPassword} onClick={() => void onSavePassword()}>
                  {savingPassword ? "변경 중" : "변경"}
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
        {passwordMessage ? <p className="px-1 text-[12px] leading-4 text-primary">{passwordMessage}</p> : null}
      </section>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex items-center justify-center gap-4">
          <LogoutButton />
          <span className="text-outline-variant" aria-hidden="true">|</span>
          <Button variant="ghost" className="min-h-9 px-2 text-[13px] text-error" disabled={deleting} onClick={() => setAskDelete(true)}>
            회원 탈퇴
          </Button>
        </div>
        {askDelete ? (
          <Card className="w-full p-4">
            <p className="text-[13px] font-medium leading-5">계정을 탈퇴할까요?</p>
            <p className="mt-1.5 text-[12px] leading-4 text-on-surface-variant">계정과 연결된 데이터가 함께 삭제됩니다.</p>
            {deleteError ? <p className="mt-2 text-[12px] leading-4 text-error">{deleteError}</p> : null}
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" className="flex-1" disabled={deleting} onClick={() => setAskDelete(false)}>
                취소
              </Button>
              <Button className="flex-1 bg-error text-white" disabled={deleting} onClick={() => void onDeleteAccount()}>
                {deleting ? "탈퇴 중" : "탈퇴"}
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function statsErrorMessage(error: unknown) {
  const message = characterErrorMessage(error);
  if (message === "Network Error") {
    return "통계를 불러오지 못했습니다.";
  }
  return message;
}
