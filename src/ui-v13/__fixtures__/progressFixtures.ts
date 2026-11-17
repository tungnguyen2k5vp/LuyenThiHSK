import { ProgressWorkspaceViewModel } from '../views/ProgressWorkspaceView';

export const mockProgressData: ProgressWorkspaceViewModel = {
  level: 'HSK 1',
  currentStreakDays: 5,
  longestStreakDays: 14,
  days: [
    { dayLabel: 'T2', dateFormatted: '13/10', isCompleted: true, isToday: false },
    { dayLabel: 'T3', dateFormatted: '14/10', isCompleted: true, isToday: false },
    { dayLabel: 'T4', dateFormatted: '15/10', isCompleted: true, isToday: false },
    { dayLabel: 'T5', dateFormatted: '16/10', isCompleted: true, isToday: false },
    { dayLabel: 'T6', dateFormatted: '17/10', isCompleted: false, isToday: false },
    { dayLabel: 'T7', dateFormatted: '18/10', isCompleted: true, isToday: false },
    { dayLabel: 'CN', dateFormatted: '19/10', isCompleted: true, isToday: true },
  ],
  vocabCount: {
    learned: 68,
    total: 150,
  },
  grammarCount: {
    learned: 24,
    total: 68,
  },
  practiceAttemptsCount: 12,
  totalStudyMinutes: 420,
};
