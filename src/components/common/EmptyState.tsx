type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant px-4 py-8 text-center">
      <p className="text-[15px] font-medium leading-[22px] text-on-surface">{title}</p>
      {description ? (
        <p className="mt-1 text-[13px] leading-[18px] text-on-surface-variant">{description}</p>
      ) : null}
    </div>
  );
}
