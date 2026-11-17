import { toLocalDateKey } from './calendar';

/** Split completed seconds across local midnight, not the eventual write time. */
export function splitStudySeconds(start: number, end: number): { date: string; seconds: number }[] {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];
  let remaining = Math.floor((end - start) / 1000);
  let cursor = start;
  const buckets: { date: string; seconds: number }[] = [];
  while (remaining > 0) {
    const date = new Date(cursor);
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
    const seconds = Math.min(remaining, Math.max(1, Math.ceil((midnight - cursor) / 1000)));
    buckets.push({ date: toLocalDateKey(date), seconds });
    cursor += seconds * 1000;
    remaining -= seconds;
  }
  return buckets;
}

export class StudyTimeTracker {
  private since: number | null = null;
  private readonly pending = new Map<string, number>();
  private writing = false;
  constructor(private readonly clock: () => number, private readonly write: (date: string, seconds: number) => Promise<void>) {}
  private collect() {
    if (this.since === null) return;
    const now = this.clock();
    if (now < this.since) { this.since = now; return; }
    let total = 0;
    for (const bucket of splitStudySeconds(this.since, now)) {
      this.pending.set(bucket.date, (this.pending.get(bucket.date) ?? 0) + bucket.seconds);
      total += bucket.seconds;
    }
    this.since += total * 1000;
  }
  setActive(active: boolean) {
    this.collect();
    this.since = active ? this.since ?? this.clock() : null;
  }
  async flush(): Promise<void> {
    this.collect();
    if (this.writing || !this.pending.size) return;
    this.writing = true;
    const entries = [...this.pending];
    this.pending.clear();
    let index = 0;
    try {
      for (; index < entries.length; index++) {
        const [date, seconds] = entries[index]!;
        await this.write(date, seconds);
      }
    } catch {
      // Retry on the next timer/foreground event, never spin on a locked/full DB.
      for (; index < entries.length; index++) {
        const [date, seconds] = entries[index]!;
        this.pending.set(date, (this.pending.get(date) ?? 0) + seconds);
      }
    } finally { this.writing = false; }
  }
}
