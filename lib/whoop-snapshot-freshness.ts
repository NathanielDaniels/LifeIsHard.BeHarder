import type { WhoopCycle, WhoopRecovery, WhoopSleep, WhoopWorkout } from '@/types/whoop';

const REQUIRED_SOURCES = ['recovery', 'sleep'] as const;

type RequiredSource = (typeof REQUIRED_SOURCES)[number];

export interface SnapshotSourceSelection {
  recovery: WhoopRecovery | null;
  cycle: WhoopCycle | null;
  workout: WhoopWorkout | null;
  sleep: WhoopSleep | null;
  missingRequiredSources: RequiredSource[];
}

export interface SnapshotSourceInput {
  date: string;
  recoveries: WhoopRecovery[];
  cycles: WhoopCycle[];
  workouts: WhoopWorkout[];
  sleeps: WhoopSleep[];
}

export function toDateString(isoString: string): string {
  return isoString.split('T')[0];
}

export function toLocalDateString(isoString: string, timezoneOffset?: string): string {
  if (!timezoneOffset) return toDateString(isoString);
  const dt = new Date(isoString);
  const match = timezoneOffset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return toDateString(isoString);
  const sign = match[1] === '+' ? 1 : -1;
  const offsetMinutes = sign * (parseInt(match[2]) * 60 + parseInt(match[3]));
  const local = new Date(dt.getTime() + offsetMinutes * 60000);
  return local.toISOString().split('T')[0];
}

function recoveryDate(recovery: WhoopRecovery): string | null {
  return recovery.created_at ? toDateString(recovery.created_at) : null;
}

function cycleDate(cycle: WhoopCycle): string | null {
  return cycle.start ? toLocalDateString(cycle.start, cycle.timezone_offset) : null;
}

function sleepDate(sleep: WhoopSleep): string | null {
  return sleep.end ? toLocalDateString(sleep.end, sleep.timezone_offset) : null;
}

function newestFirst<T extends { updated_at?: string; created_at?: string }>(records: T[]): T[] {
  return [...records].sort((a, b) => {
    const aTime = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
    const bTime = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
    return bTime - aTime;
  });
}

export function findRecoveryForDate(
  recoveries: WhoopRecovery[],
  date: string,
  sleep?: WhoopSleep | null,
): WhoopRecovery | null {
  const scored = newestFirst(recoveries).filter((recovery) => (
    recovery.score_state === 'SCORED'
    && recovery.score != null
  ));

  if (sleep?.id) {
    const recoveryForSleep = scored.find((recovery) => recovery.sleep_id === sleep.id);
    if (recoveryForSleep) return recoveryForSleep;
  }

  return scored.find((recovery) => recoveryDate(recovery) === date) ?? null;
}

export function findCycleForDate(cycles: WhoopCycle[], date: string): WhoopCycle | null {
  return newestFirst(cycles).find((cycle) => (
    cycle.score_state === 'SCORED'
    && cycle.score != null
    && cycleDate(cycle) === date
  )) ?? null;
}

export function findSleepForDate(sleeps: WhoopSleep[], date: string): WhoopSleep | null {
  return newestFirst(sleeps).find((sleep) => (
    !sleep.nap
    && sleep.score_state === 'SCORED'
    && sleep.score != null
    && sleepDate(sleep) === date
  )) ?? null;
}

export function selectSnapshotSourcesForDate(input: SnapshotSourceInput): SnapshotSourceSelection {
  const sleep = findSleepForDate(input.sleeps, input.date);
  const recovery = findRecoveryForDate(input.recoveries, input.date, sleep);

  const missingRequiredSources: RequiredSource[] = [];
  if (!recovery) missingRequiredSources.push('recovery');
  if (!sleep) missingRequiredSources.push('sleep');

  return {
    recovery,
    cycle: findCycleForDate(input.cycles, input.date),
    workout: null,
    sleep,
    missingRequiredSources,
  };
}
