import React from 'react';

export interface ProgressAnalyticsCardProps {
  vocabCount: { learned: number; total: number };
  grammarCount: { learned: number; total: number };
  practiceAttemptsCount: number;
  totalStudyMinutes: number;
  className?: string;
}

export const ProgressAnalyticsCard: React.FC<ProgressAnalyticsCardProps> = ({
  vocabCount,
  grammarCount,
  practiceAttemptsCount,
  totalStudyMinutes,
  className = '',
}) => {
  const vocabPercent = vocabCount.total > 0 ? Math.round((vocabCount.learned / vocabCount.total) * 100) : 0;
  const grammarPercent = grammarCount.total > 0 ? Math.round((grammarCount.learned / grammarCount.total) * 100) : 0;

  const hours = Math.floor(totalStudyMinutes / 60);
  const mins = totalStudyMinutes % 60;
  const studyTimeFormatted = hours > 0 ? `${hours}h ${mins}p` : `${mins} phút`;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {/* Vocab Progress */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--hsk-color-surface)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          boxShadow: 'var(--hsk-shadow-xs)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)' }}>
          Từ vựng đã thuộc
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsk-color-text-main)', margin: '4px 0 8px' }}>
          {vocabCount.learned} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--hsk-color-text-muted)' }}>/ {vocabCount.total}</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${vocabPercent}%`, height: '100%', backgroundColor: 'var(--hsk-color-primary)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Grammar Progress */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--hsk-color-surface)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          boxShadow: 'var(--hsk-shadow-xs)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)' }}>
          Điểm ngữ pháp nắm vững
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsk-color-text-main)', margin: '4px 0 8px' }}>
          {grammarCount.learned} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--hsk-color-text-muted)' }}>/ {grammarCount.total}</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${grammarPercent}%`, height: '100%', backgroundColor: 'var(--hsk-color-amber)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Total Sessions */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--hsk-color-surface)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          boxShadow: 'var(--hsk-shadow-xs)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)' }}>
          Bài luyện đã hoàn thành
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsk-color-text-main)', margin: '4px 0' }}>
          {practiceAttemptsCount} bài
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-success)', fontWeight: 600 }}>
          ✓ Đã ghi nhận lịch sử
        </span>
      </div>

      {/* Total Time */}
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--hsk-color-surface)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          boxShadow: 'var(--hsk-shadow-xs)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)' }}>
          Tổng thời gian tích lũy
        </span>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--hsk-color-primary)', margin: '4px 0' }}>
          {studyTimeFormatted}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
          Đều đặn mỗi ngày
        </span>
      </div>
    </div>
  );
};
