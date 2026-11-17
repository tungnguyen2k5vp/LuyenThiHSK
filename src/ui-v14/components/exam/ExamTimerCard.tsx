import React from 'react';
import { ExamTimerVM } from '../../types/viewmodels';
import { DigitalTimer } from '../../primitives/DigitalTimer/DigitalTimer';
import { Button } from '../../primitives/Button/Button';

export interface ExamTimerCardProps {
  timer: ExamTimerVM;
  onSubmit: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const ExamTimerCard: React.FC<ExamTimerCardProps> = ({
  timer,
  onSubmit,
  isSubmitting = false,
  className = '',
}) => {
  return (
    <div className={`v14-timer-submit-panel ${className}`} aria-label="Thời gian và nộp bài">
      <div className="v14-timer-card">
        {/* Timer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 'var(--v14-text-xs)',
            fontWeight: 700,
            color: 'var(--v14-color-text-secondary)',
          }}
        >
          <span>{timer.mode==='practice'?'Luyện tập không giới hạn giờ':'Thời gian còn lại'}</span>
          <span style={{ fontSize: '1rem' }}>⏰</span>
        </div>

        {/* Digital Dual Box Timer */}
        <DigitalTimer
          seconds={timer.remainingSeconds}
          variant={timer.remainingSeconds!==null&&timer.remainingSeconds < 300 ? 'warning' : 'normal'}
        />

        {timer.isPaused && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--v14-radius-full)',
              backgroundColor: 'var(--v14-color-accent-light)',
              color: 'var(--v14-color-accent)',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            ⏸️ Đang tạm dừng
          </span>
        )}

        {/* Submit Exam Button (Migii style large button) */}
        <div style={{ width: '100%', marginTop: 'var(--v14-space-2)' }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onSubmit}
            disabled={isSubmitting||timer.canSubmit===false}
            aria-label="Nộp bài thi"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        </div>
      </div>
    </div>
  );
};
