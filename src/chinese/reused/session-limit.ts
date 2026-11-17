export function getLearnSessionLimit({
  dailyGoal,
  learnedToday,
  sessionLimit,
  available,
}: {
  dailyGoal: number;
  learnedToday: number;
  sessionLimit: number;
  available: number;
}): { remainingToday: number; wordCount: number } {
  const remainingToday = Math.max(0, Math.trunc(dailyGoal) - Math.max(0, Math.trunc(learnedToday)));
  return {
    remainingToday,
    wordCount: Math.min(Math.max(0, Math.trunc(sessionLimit)), remainingToday, Math.max(0, Math.trunc(available))),
  };
}
