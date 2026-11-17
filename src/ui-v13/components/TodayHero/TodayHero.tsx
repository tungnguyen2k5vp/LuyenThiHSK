import React from 'react';
import { ReadinessViewModel, TaskViewModel } from '../../types/viewmodels';
import { Button } from '../../primitives/Button';
import { StatusChip } from '../../primitives/StatusChip';

export interface TodayHeroProps {
  targetLevel: string;
  targetSyllabus: string;
  daysRemaining: number | null;
  readiness: ReadinessViewModel;
  nextTask: TaskViewModel | null;
  onStartPrimary: () => void;
  onOpenProgress: () => void;
  className?: string;
}

export const TodayHero: React.FC<TodayHeroProps> = ({
  targetLevel,
  targetSyllabus,
  daysRemaining,
  readiness,
  nextTask,
  onStartPrimary,
  onOpenProgress,
  className = '',
}) => {
  const getExamDaysText = () => {
    if (daysRemaining === null) {
      return 'Chưa đặt ngày thi mục tiêu';
    }
    if (daysRemaining < 0) {
      return 'Ngày thi dự kiến đã qua';
    }
    if (daysRemaining === 0) {
      return 'Hôm nay là ngày thi!';
    }
    return `Còn ${daysRemaining} ngày đến kỳ thi`;
  };

  return (
    <section className={`v13-today-hero ${className}`.trim()} aria-labelledby="today-hero-title">
      {/* Left Column: Target & Main Recommended Action */}
      <div className="v13-hero-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="text-eyebrow">MỤC TIÊU HIỆN TẠI · {targetSyllabus}</span>
          <StatusChip status="PREVIEW" customLabel="Giao diện V13" />
        </div>

        <div className="v13-hero-title-row">
          <h1 id="today-hero-title" className="v13-hero-level-badge">
            {targetLevel}
          </h1>
          <span className="v13-hero-countdown">
            • {getExamDaysText()}
          </span>
        </div>

        <p style={{ fontSize: 'var(--v13-text-base)', maxWidth: '520px' }}>
          {nextTask ? (
            <span>
              Nhiệm vụ tiếp theo: <strong>{nextTask.title}</strong>{nextTask.estimatedMinutes > 0 ? ` (~${nextTask.estimatedMinutes} phút)` : ''}
            </span>
          ) : (
            <span>Hôm nay bạn đã hoàn thành kế hoạch học tập! Bạn có thể luyện thêm các kỹ năng khác.</span>
          )}
        </p>

        <div style={{ marginTop: 'var(--v13-space-2)', display: 'flex', gap: 'var(--v13-space-3)', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onStartPrimary}
            disabled={nextTask ? !nextTask.isAvailable : false}
          >
            {nextTask ? (nextTask.isCompleted ? 'Ôn thêm nhiệm vụ kế tiếp' : 'Tiếp tục học hôm nay') : 'Bắt đầu luyện tập tự do'}
          </Button>
        </div>
      </div>

      {/* Right Column: Readiness Assessment Box */}
      <div className="v13-readiness-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--v13-text-xs)', fontWeight: 'var(--v13-weight-bold)', color: 'var(--v13-text-secondary)', textTransform: 'uppercase' }}>
            Mức độ sẵn sàng
          </span>
          <span style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-tertiary)' }}>
            Dựa trên bài đã nộp
          </span>
        </div>

        <div className="v13-readiness-score-row">
          <div className="v13-readiness-val">
            {readiness.score !== null ? `${readiness.score}%` : 'Chưa đủ dữ liệu'}
          </div>
          {readiness.approvedMocksCount !== null && readiness.approvedMocksCount > 0 && (
            <span style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)' }}>
              {readiness.approvedMocksCount} đề đã duyệt
            </span>
          )}
        </div>

        <p style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)', lineHeight: 1.4 }}>
          {readiness.reason}
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenProgress}
          style={{ justifyContent: 'flex-start', padding: 0, marginTop: 'auto', color: 'var(--v13-text-brand)' }}
        >
          Xem chi tiết cơ sở đánh giá →
        </Button>
      </div>
    </section>
  );
};
