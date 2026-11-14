import {
  analyzeCharacterPersona,
  characterErrorMessage,
  extractCharacterSources,
  getCharacterPersona,
} from "@/features/character/persona";

export type AnalysisStepName = "extract" | "analyze" | "persona";

export type CharacterJob = {
  characterId: number;
  name: string;
  nextStep: AnalysisStepName;
  status: "pending" | "running" | "failed" | "done";
  error: string | null;
  savedCount: number | null;
  handedOff: boolean;
};

const jobs = new Map<number, CharacterJob>();
const inflight = new Map<number, Promise<void>>();
const listeners = new Map<number, Set<() => void>>();

function notify(characterId: number) {
  listeners.get(characterId)?.forEach((listener) => listener());
}

export function beginCharacterJob(characterId: number, name: string) {
  jobs.set(characterId, {
    characterId,
    name,
    nextStep: "extract",
    status: "pending",
    error: null,
    savedCount: null,
    handedOff: false,
  });
  notify(characterId);
}

export function getCharacterJob(characterId: number) {
  return jobs.get(characterId) ?? null;
}

export function subscribeCharacterJob(characterId: number, listener: () => void) {
  const current = listeners.get(characterId) ?? new Set<() => void>();
  current.add(listener);
  listeners.set(characterId, current);
  return () => {
    current.delete(listener);
  };
}

export function markJobHandedOff(characterId: number) {
  const job = jobs.get(characterId);
  if (!job) {
    return;
  }
  job.handedOff = true;
  notify(characterId);
}

export function retryCharacterJob(characterId: number) {
  const job = jobs.get(characterId);
  if (!job || job.status !== "failed") {
    return;
  }
  job.status = "pending";
  job.error = null;
  notify(characterId);
  void runCharacterJob(characterId);
}

export function runCharacterJob(characterId: number) {
  const existing = inflight.get(characterId);
  if (existing) {
    return existing;
  }

  const job = jobs.get(characterId);
  if (!job || job.status === "failed" || job.status === "done" || job.status === "running") {
    return Promise.resolve();
  }

  const promise = executeJob(job).finally(() => {
    inflight.delete(characterId);
  });
  inflight.set(characterId, promise);
  return promise;
}

async function executeJob(job: CharacterJob) {
  job.status = "running";
  job.error = null;
  notify(job.characterId);

  try {
    if (job.nextStep === "extract") {
      const extracted = await extractCharacterSources(job.characterId);
      job.savedCount = extracted.saved_count;
      job.nextStep = "analyze";
      notify(job.characterId);
    }

    if (job.nextStep === "analyze") {
      const analyzed = await analyzeCharacterPersona(job.characterId);
      if (analyzed.is_confirmed !== false) {
        throw new Error("분석 결과가 확정되지 않은 상태가 아닙니다. 최종 확정은 진행하지 않았습니다.");
      }
      job.nextStep = "persona";
      notify(job.characterId);
    }

    if (job.nextStep === "persona") {
      const persona = await getCharacterPersona(job.characterId);
      if (persona.is_confirmed) {
        throw new Error("조회한 페르소나가 이미 확정되어 있습니다. 최종 확정은 진행하지 않았습니다.");
      }
      job.status = "done";
      notify(job.characterId);
    }
  } catch (error) {
    job.status = "failed";
    job.error = characterErrorMessage(error);
    notify(job.characterId);
  }
}
