import { toLocalDateKey } from "./calendar.ts";

export type DailyActivityRecord = {
  date: string;
  reviewed: number;
  newWords: number;
};

export type StudyHeatmapDay = DailyActivityRecord & {
  activity: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function dayAtOffset(now: Date, offset: number): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
}

/** Builds a local-calendar heatmap from actual completed learning actions. */
export function buildStudyHeatmap(
  records: DailyActivityRecord[],
  now = new Date(),
  days = 28,
): StudyHeatmapDay[] {
  const count = Math.max(1, Math.trunc(days));
  const activityByDate = new Map(
    records.map((record) => [
      record.date,
      Math.max(0, Math.trunc(record.reviewed)) + Math.max(0, Math.trunc(record.newWords)),
    ]),
  );
  const values = Array.from({ length: count }, (_, index) => {
    const date = toLocalDateKey(dayAtOffset(now, index - count + 1));
    const source = records.find((record) => record.date === date);
    return {
      date,
      reviewed: source?.reviewed ?? 0,
      newWords: source?.newWords ?? 0,
      activity: activityByDate.get(date) ?? 0,
    };
  });
  const peak = Math.max(0, ...values.map((item) => item.activity));
  return values.map((item) => ({
    ...item,
    level: item.activity === 0 || peak === 0
      ? 0
      : Math.min(4, Math.max(1, Math.ceil((item.activity / peak) * 4))) as 1 | 2 | 3 | 4,
  }));
}
