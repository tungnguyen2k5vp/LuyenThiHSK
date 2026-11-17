import React from 'react';
import { StreakCard, DayStreak } from '../components/progress/StreakCard';
import { ProgressAnalyticsCard } from '../components/progress/ProgressAnalyticsCard';
import { Button } from '../primitives/Button';

export interface ProgressWorkspaceViewModel {
  level: string;
  currentStreakDays: number;
  longestStreakDays?: number;
  days: DayStreak[];
  vocabCount: { learned: number; total: number };
  grammarCount: { learned: number; total: number };
  practiceAttemptsCount: number;
  totalStudyMinutes: number;
}

export interface ProgressWorkspaceViewProps {
  model: ProgressWorkspaceViewModel;
  onBackToToday?: () => void;
  className?: string;
}

export const ProgressWorkspaceView: React.FC<ProgressWorkspaceViewProps> = ({
  model,
  onBackToToday,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: '0 0 0.25rem' }}>
              Tiến Độ Học Tập & Thói Quen ({model.level})
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
              Theo dõi thói quen học tập hàng ngày, tỷ lệ tích lũy từ vựng, ngữ pháp và thời lượng luyện thi.
            </p>
          </div>

          {onBackToToday && (
            <Button variant="outline" size="md" onClick={onBackToToday} leftIcon={<span>🏠</span>}>
              Quay lại Bàn học
            </Button>
          )}
        </div>

        {/* 1. Daily Study Streak */}
        <StreakCard
          currentStreakDays={model.currentStreakDays}
          longestStreakDays={model.longestStreakDays}
          days={model.days}
        />

        {/* 2. Analytical Statistics */}
        <ProgressAnalyticsCard
          vocabCount={model.vocabCount}
          grammarCount={model.grammarCount}
          practiceAttemptsCount={model.practiceAttemptsCount}
          totalStudyMinutes={model.totalStudyMinutes}
        />
      </div>
    </div>
  );
};
