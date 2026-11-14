"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  getCharacterJob,
  markJobHandedOff,
  retryCharacterJob,
  runCharacterJob,
  subscribeCharacterJob,
  type CharacterJob,
} from "@/features/character/characterJob";
import { CharacterAnalysisProgress, type AnalysisStep } from "@/features/character/CharacterAnalysisProgress";
import { routes } from "@/lib/navigation";

type CharacterAnalysisRunnerProps = {
  characterId: string;
};

function stepStatus(job: CharacterJob, step: CharacterJob["nextStep"], order: CharacterJob["nextStep"][]) {
  const current = order.indexOf(job.nextStep);
  const target = order.indexOf(step);
  if (job.status === "done" || current > target) {
    return "done" as const;
  }
  if (current === target && (job.status === "running" || job.status === "failed" || job.status === "pending")) {
    return job.status === "running" ? ("active" as const) : ("waiting" as const);
  }
  return "waiting" as const;
}

function buildSteps(job: CharacterJob): AnalysisStep[] {
  const order: CharacterJob["nextStep"][] = ["extract", "analyze", "persona"];
  const extractStatus = stepStatus(job, "extract", order);
  const analyzeStatus = stepStatus(job, "analyze", order);
  const personaStatus = stepStatus(job, "persona", order);

  return [
    {
      title: "원작 자료 추출",
      description:
        job.status === "failed" && job.nextStep === "extract"
          ? "원작 자료 추출에 실패했습니다."
          : extractStatus === "done"
            ? `자료 ${job.savedCount ?? 0}건을 저장했습니다.`
            : extractStatus === "active"
              ? "원작 자료를 추출하고 있습니다."
              : "추출 대기",
      status: job.status === "failed" && job.nextStep === "extract" ? "active" : extractStatus,
    },
    {
      title: "페르소나 분석",
      description:
        job.status === "failed" && job.nextStep === "analyze"
          ? "페르소나 분석에 실패했습니다."
          : analyzeStatus === "done"
            ? "분석 결과를 저장했습니다. 아직 최종 확정 전입니다."
            : analyzeStatus === "active"
              ? "페르소나를 분석하고 있습니다."
              : "분석 대기",
      status: job.status === "failed" && job.nextStep === "analyze" ? "active" : analyzeStatus,
    },
    {
      title: "분석 결과 조회",
      description:
        job.status === "failed" && job.nextStep === "persona"
          ? "페르소나 조회에 실패했습니다."
          : personaStatus === "done"
            ? "검토 화면으로 이동합니다."
            : personaStatus === "active"
              ? "저장된 페르소나를 불러오고 있습니다."
              : "조회 대기",
      status: job.status === "failed" && job.nextStep === "persona" ? "active" : personaStatus,
    },
  ];
}

export function CharacterAnalysisRunner({ characterId }: CharacterAnalysisRunnerProps) {
  const router = useRouter();
  const numericId = Number(characterId);
  const validId = Number.isInteger(numericId) && numericId > 0;
  const [job, setJob] = useState<CharacterJob | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!validId) {
      setReady(true);
      return;
    }

    const publish = () => {
      const current = getCharacterJob(numericId);
      setJob(current ? { ...current } : null);
    };
    publish();
    setReady(true);
    const unsubscribe = subscribeCharacterJob(numericId, publish);
    void runCharacterJob(numericId);
    return unsubscribe;
  }, [numericId, validId]);

  useEffect(() => {
    if (job?.status !== "running") {
      return;
    }

    const onLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [job?.status]);

  useEffect(() => {
    if (job?.status === "done" && !job.handedOff) {
      markJobHandedOff(numericId);
      router.replace(routes.characterReview(String(numericId)));
    }
  }, [job?.handedOff, job?.status, numericId, router]);

  if (!ready) {
    return null;
  }

  if (!validId || !job) {
    return (
      <EmptyState
        title="진행 중인 분석을 찾을 수 없습니다"
        description="분석 중에는 새로고침하거나 화면을 벗어나지 말아 주세요. 중단된 작업은 이어서 진행하지 않습니다."
      />
    );
  }

  if (job.status === "done") {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState title="분석이 완료되었습니다" description="최종 확정 전 검토 화면에서 결과를 확인합니다." />
        <Link
          href={routes.characterReview(String(numericId))}
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-[14px] font-medium text-on-primary"
        >
          검토 화면으로 이동
        </Link>
      </div>
    );
  }

  const running = job.status === "running" || job.status === "pending";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[18px] font-semibold leading-6">{job.name} 분석 중</p>
        <p className="mt-2 text-[13px] leading-[18px] text-on-surface-variant">
          {job.status === "failed"
            ? "이 단계에서 실패했습니다. 다시 시도하거나 분석을 중단할 수 있습니다."
            : job.nextStep === "extract"
              ? "원작 자료를 추출하고 있습니다."
              : job.nextStep === "analyze"
                ? "페르소나를 분석하고 있습니다."
                : "분석 결과를 확인하고 있습니다."}
        </p>
      </div>
      <CharacterAnalysisProgress steps={buildSteps(job)} />
      {running ? (
        <p className="text-[12px] leading-4 text-outline">
          자료 추출과 분석이 끝날 때까지 새로고침하거나 이 화면을 벗어나지 말아 주세요. 문서 길이에 따라 시간이 걸릴 수 있습니다.
        </p>
      ) : null}
      {job.status === "failed" && job.error ? (
        <div className="flex flex-col gap-3">
          <p role="alert" className="text-[12px] leading-4 text-error">
            {job.error}
          </p>
          <Button type="button" onClick={() => retryCharacterJob(numericId)}>
            다시 시도
          </Button>
          <Link href={routes.charactersNew} className="text-center text-[13px] font-medium text-outline">
            분석을 중단하고 돌아가기
          </Link>
        </div>
      ) : null}
    </div>
  );
}
