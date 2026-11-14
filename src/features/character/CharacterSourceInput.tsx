import { Input } from "@/components/ui/Input";

type CharacterSourceInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
};

export function CharacterSourceInput({ id, value, onChange, onRemove }: CharacterSourceInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <Input
          id={id}
          type="url"
          placeholder="https://"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {onRemove ? (
        <button type="button" className="shrink-0 text-[12px] font-medium text-outline" onClick={onRemove}>
          삭제
        </button>
      ) : null}
    </div>
  );
}
