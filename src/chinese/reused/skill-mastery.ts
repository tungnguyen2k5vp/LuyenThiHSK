import type { LearningSkill, ReviewExerciseType, ReviewMode, ReviewSkillAttempt, SkillMasteryMetric } from "./models";

const skills: LearningSkill[] = ["meaning", "hanziRecall", "pinyin", "listening", "writing", "tone"];

function skillForAttempt(exerciseType: ReviewExerciseType | null, mode: ReviewMode): LearningSkill | null {
  if (mode === "hanzi-recall-pinyin-compose" || exerciseType === "hanzi_to_pinyin") return "pinyin";
  if (exerciseType === "hanzi_to_meaning") return "meaning";
  if (exerciseType === "audio_to_hanzi" || exerciseType === "audio_to_meaning") return "listening";
  if (exerciseType === "writing" || exerciseType === "cloze") return "writing";
  if (exerciseType === "meaning_to_hanzi" || exerciseType === "pinyin_to_hanzi") return "hanziRecall";
  return null;
}

/** Computes a weighted recent window; old logs without an exercise type are ignored safely. */
export function buildSkillMastery(attempts: ReviewSkillAttempt[], windowSize = 40): SkillMasteryMetric[] {
  const ordered = [...attempts]
    .sort((left, right) => right.reviewedAt.localeCompare(left.reviewedAt))
    .slice(0, Math.max(1, windowSize));

  return skills.map((skill) => {
    const relevant = ordered.filter((attempt) => skillForAttempt(attempt.exerciseType, attempt.mode) === skill);
    if (!relevant.length) return { skill, attempts: 0, accuracy: null, status: "no-data" };
    let totalWeight = 0;
    let correctWeight = 0;
    relevant.forEach((attempt, index) => {
      const weight = Math.max(0.45, 1 - index * 0.04);
      totalWeight += weight;
      if (attempt.correct) correctWeight += weight;
    });
    const accuracy = Math.round((correctWeight / totalWeight) * 100);
    return {
      skill,
      attempts: relevant.length,
      accuracy,
      status: relevant.length < 3 ? "building" : accuracy < 65 ? "weak" : accuracy < 82 ? "building" : "strong",
    };
  });
}

export function skillLabel(skill: LearningSkill): string {
  return { meaning: "Nghĩa", hanziRecall: "Nhớ Hán tự", pinyin: "Pinyin", listening: "Nghe", writing: "Viết", tone: "Thanh điệu" }[skill];
}
