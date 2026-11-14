import { cn } from "@/lib/utils";

export type AnalysisStep = {
  title: string;
  description: string;
  status: "done" | "active" | "waiting";
};

type CharacterAnalysisProgressProps = {
  steps: AnalysisStep[];
};

export function CharacterAnalysisProgress({ steps }: CharacterAnalysisProgressProps) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-3 rounded-xl border border-outline-variant bg-surface-lowest p-3">
          <span
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
              step.status === "done" && "bg-primary text-on-primary",
              step.status === "active" && "border border-primary text-primary",
              step.status === "waiting" && "border border-outline-variant text-outline",
            )}
          >
            {index + 1}
          </span>
          <div>
            <p className="text-[14px] font-medium leading-5">{step.title}</p>
            <p className="mt-0.5 text-[12px] leading-4 text-on-surface-variant">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
