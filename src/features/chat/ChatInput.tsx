"use client";

import { Button } from "@/components/ui/Button";

const messageLimit = 5000;

type ChatInputProps = {
  value: string;
  sending: boolean;
  error: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, sending, error, onChange, onSubmit }: ChatInputProps) {
  return (
    <form
      className="shrink-0 border-t border-outline-variant bg-surface-lowest px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!sending) {
          onSubmit();
        }
      }}
    >
      <div className="flex items-center gap-2">
        <input
          value={value}
          maxLength={messageLimit}
          disabled={sending}
          onChange={(event) => onChange(event.target.value)}
          placeholder="메시지를 입력하세요..."
          className="h-11 min-w-0 flex-1 rounded-full border border-outline-variant bg-frame px-4 text-[14px] leading-5 text-on-surface outline-none placeholder:text-outline focus:border-primary disabled:opacity-60"
        />
        <Button
          type="submit"
          disabled={sending}
          aria-label={sending ? "전송 중" : "전송"}
          className="size-10 min-h-10 rounded-full px-0"
        >
          <svg viewBox="0 0 24 24" className="size-4 translate-x-0.5" fill="currentColor" aria-hidden="true">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-1 text-center text-[11px] leading-[14px] text-error">
          {error}
        </p>
      ) : (
        <p className="mt-1 text-center text-[11px] leading-[14px] text-outline">{value.length}/{messageLimit}</p>
      )}
    </form>
  );
}
