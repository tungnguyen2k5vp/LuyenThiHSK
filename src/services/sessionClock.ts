export function remainingSessionSeconds(deadlineAt: string, now = Date.now()): number {
  const deadline = Date.parse(deadlineAt);
  return Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
}

export function attemptDurationSeconds(startedAt: string, finishedAt: string, maximumSeconds?: number): number {
  const elapsed = Math.max(0, Math.floor((Date.parse(finishedAt) - Date.parse(startedAt)) / 1000));
  if (!Number.isFinite(elapsed)) return 0;
  return maximumSeconds === undefined ? elapsed : Math.min(elapsed, maximumSeconds);
}
