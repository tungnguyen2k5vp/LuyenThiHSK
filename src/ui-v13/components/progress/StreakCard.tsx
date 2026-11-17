import React from 'react';

export interface DayStreak {
  dayLabel: string; // "T2", "T3", "T4", "T5", "T6", "T7", "CN"
  dateFormatted: string;
  isCompleted: boolean;
  isToday: boolean;
}

export interface StreakCardProps {
  currentStreakDays: number;
  longestStreakDays?: number;
  days: DayStreak[];
  className?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreakDays,
  longestStreakDays,
  days,
  className = '',
}) => {
  return (
    <div className={`hsk-streak-container ${className}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--hsk-color-amber-dark)', margin: 0 }}>
            {currentStreakDays} ngày liên tiếp
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)', margin: '4px 0 0' }}>
          {currentStreakDays > 0
            ? 'Bạn đang duy trì nhịp học rất tốt! Tiếp tục phát huy nhé.'
            : 'Hãy hoàn thành một bài học hôm nay để kích hoạt chuỗi ngày học.'}
          {longestStreakDays && ` (Kỷ lục: ${longestStreakDays} ngày)`}
        </p>
      </div>

      <div className="hsk-streak-days-row" aria-label="Lịch sử chuỗi ngày học trong tuần">
        {days.map((d, i) => (
          <div
            key={i}
            className={`hsk-streak-day-dot ${d.isCompleted ? 'is-active' : ''}`}
            title={`${d.dayLabel} (${d.dateFormatted}): ${d.isCompleted ? 'Đã học' : 'Chưa học'}`}
            style={{
              position: 'relative',
              outline: d.isToday ? '2px solid var(--hsk-color-primary)' : 'none',
            }}
          >
            <span>{d.dayLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
