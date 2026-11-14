'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function PersonaIntro() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <section className="relative rounded-xl border border-outline-variant bg-secondary-container/40 p-4 pr-10">
      <button
        type="button"
        aria-label="Persona Chat 안내 닫기"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full text-outline cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <h3 className="text-[12px] font-semibold leading-4">Persona Chat란?</h3>
      <p className="mt-1.5 text-[11px] leading-[16px] text-on-surface-variant">
        좋아하는 캐릭터의 성격과 말투를 학습시켜 자연스럽게 대화할 수 있는 AI
        챗봇 서비스입니다.
      </p>
      <Button
        variant="ghost"
        pending
        className="mt-2 min-h-0 px-0 text-[12px] text-primary"
      >
        사용 방법 알아보기
      </Button>
    </section>
  );
}
