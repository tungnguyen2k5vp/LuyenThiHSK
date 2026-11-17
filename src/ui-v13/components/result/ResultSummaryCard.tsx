import React from 'react';
import { ResultVM } from '../../../contracts/ui-v13';

export interface ResultSummaryCardProps {
  model: ResultVM;
  className?: string;
}

export const ResultSummaryCard: React.FC<ResultSummaryCardProps> = ({
  model,
  className = '',
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs < 10 ? '0' : ''}${secs} giây`;
  };

  const accuracy = model.accuracyPercent !== null ? `${model.accuracyPercent}%` : '--%';

  return (
    <div className={`hsk-result-hero-card ${className}`}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: '0 0 0.25rem' }}>
          Kết Quả Luyện Thi: {model.title}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
          Thời gian làm bài: <strong>{formatDuration(model.durationSeconds)}</strong>
        </p>
      </div>

      {/* Accuracy Ring / Badge */}
      <div className="hsk-result-score-circle">
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--hsk-color-primary)', lineHeight: 1 }}>
          {accuracy}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)', marginTop: '4px' }}>
          Độ chính xác
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--hsk-color-text-muted)', margin: 0, fontStyle: 'italic' }}>
        {model.accuracyLabel}
      </p>

      {/* 4-Stat Breakdown Grid */}
      <div className="hsk-result-stat-grid">
        <div className="hsk-result-stat-card">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--hsk-color-success)' }}>
            {model.counts.correct}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>✓ Đúng</span>
        </div>

        <div className="hsk-result-stat-card">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
            {model.counts.incorrect}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>✕ Chưa đúng</span>
        </div>

        <div className="hsk-result-stat-card">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--hsk-color-amber-dark)' }}>
            {model.counts.unanswered}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>⚪ Chưa làm</span>
        </div>

        <div className="hsk-result-stat-card">
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--hsk-color-primary)' }}>
            {model.counts.ungraded}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>📝 Chờ chấm</span>
        </div>
      </div>
    </div>
  );
};
