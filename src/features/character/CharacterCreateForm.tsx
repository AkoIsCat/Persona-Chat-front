"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { beginCharacterJob } from "@/features/character/characterJob";
import { CharacterSourceInput } from "@/features/character/CharacterSourceInput";
import { characterErrorMessage, createCharacter } from "@/features/character/persona";
import { routes } from "@/lib/navigation";

const nameLimit = 20;
const urlLimit = 3;

function collectUrls(values: string[]) {
  const urls = values.map((value) => value.trim()).filter(Boolean);
  if (urls.length < 1) {
    return { error: "원작 URL을 1개 이상 입력해 주세요." };
  }
  if (urls.length > urlLimit) {
    return { error: "URL은 3개까지 입력할 수 있습니다." };
  }
  if (new Set(urls).size !== urls.length) {
    return { error: "같은 URL을 중복해서 입력할 수 없습니다." };
  }
  for (const url of urls) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "올바른 http 또는 https URL을 입력해 주세요." };
      }
    } catch {
      return { error: "올바른 http 또는 https URL을 입력해 주세요." };
    }
  }
  return { urls };
}

export function CharacterCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [urls, setUrls] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateUrl(index: number, value: string) {
    setUrls((current) => current.map((url, urlIndex) => (urlIndex === index ? value : url)));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nickname = name.trim();
    if (!nickname) {
      setError("캐릭터 이름을 입력해 주세요.");
      return;
    }
    const parsed = collectUrls(urls);
    if ("error" in parsed && parsed.error) {
      setError(parsed.error);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const created = await createCharacter(nickname, parsed.urls ?? []);
      beginCharacterJob(created.id, created.name);
      router.push(routes.characterAnalyzing(String(created.id)));
    } catch (caught) {
      setError(characterErrorMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[12px] font-medium leading-4 text-on-surface-variant">캐릭터 이름</p>
          <p className="text-[12px] leading-4 text-outline">
            {name.length}/{nameLimit}자
          </p>
        </div>
        <Input
          id="character-name"
          value={name}
          maxLength={nameLimit}
          placeholder="캐릭터 이름을 입력해주세요"
          onChange={(event) => setName(event.target.value.slice(0, nameLimit))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium leading-4 text-on-surface-variant">웹 링크 입력 (최대 3개)</p>
        {urls.map((url, index) => (
          <CharacterSourceInput
            key={index}
            id={`character-url-${index}`}
            value={url}
            onChange={(value) => updateUrl(index, value)}
            onRemove={urls.length > 1 ? () => setUrls((current) => current.filter((_, urlIndex) => urlIndex !== index)) : undefined}
          />
        ))}
        {urls.length < urlLimit ? (
          <button
            type="button"
            className="self-start text-[13px] font-medium text-primary"
            onClick={() => setUrls((current) => [...current, ""])}
          >
            웹 링크 추가 ({urls.length}/{urlLimit})
          </button>
        ) : (
          <p className="text-[13px] font-medium text-outline">웹 링크 {urlLimit}/{urlLimit}</p>
        )}
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-lowest p-4">
        <p className="text-[13px] font-semibold leading-[18px]">웹 링크 입력 안내</p>
        <p className="mt-1.5 text-[12px] leading-4 text-on-surface-variant">
          나무위키, 위키, 공식 사이트 등의 URL을 입력해주세요. AI가 해당 자료를 분석하여 캐릭터 정보를 추출합니다.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-[12px] leading-4 text-error">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "생성 중" : "생성하기"}
      </Button>
    </form>
  );
}
