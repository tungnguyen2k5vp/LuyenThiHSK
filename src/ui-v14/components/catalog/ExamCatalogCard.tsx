import React from 'react';
import { ExamCatalogItemVM } from '../../types/viewmodels';

export interface ExamCatalogCardProps {
  exam: ExamCatalogItemVM;
  onSelect: (examId: string) => void;
  className?: string;
  refined?: boolean;
}

export const ExamCatalogCard: React.FC<ExamCatalogCardProps> = ({
  exam,
  onSelect,
  className = '',
  refined = false,
}) => {
  const isLocked = exam.isLocked || exam.status === 'locked';

  const getStatusDisplay = () => {
    switch (exam.status) {
      case 'completed':
        return {
          icon: '✓',
          label: exam.lastScore !== undefined && exam.lastScore !== null
            ? `Đã xong (${exam.lastScore}/${exam.passingScore} đ)`
            : 'Đã hoàn thành',
          color: 'var(--v14-color-success)',
        };
      case 'in_progress':
        return {
          icon: '⏳',
          label: 'Đang làm dở',
          color: 'var(--v14-color-amber)',
        };
      case 'locked':
        return {
          icon: '🔒',
          label: exam.lockReason || 'Chưa mở khóa',
          color: 'var(--v14-color-text-muted)',
        };
      case 'not_started':
      default:
        return {
          icon: '📖',
          label: 'Chưa làm bài',
          color: 'var(--v14-color-text-secondary)',
        };
    }
  };

  const status = getStatusDisplay();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
      e.preventDefault();
      onSelect(exam.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isLocked ? -1 : 0}
      onClick={() => !isLocked && onSelect(exam.id)}
      onKeyDown={handleKeyDown}
      className={`v14-exam-card ${isLocked ? 'is-locked' : ''} ${className}`}
      aria-disabled={isLocked}
      aria-label={`${exam.title}, ${exam.durationMinutes} phút, ${exam.totalQuestions} câu hỏi, trạng thái: ${status.label}`}
    >
      {/* Visual Cover Header */}
      <div className="v14-exam-card-cover">
        {/* Book / Exam Graphic */}
        {refined?<><span className="v15-cover-label">HSK {exam.level}</span><span className="v15-cover-glyph" aria-hidden="true">学</span></>:<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2.5rem' }}>📚</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--v14-font-hanzi)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--v14-color-primary-active)' }}>
              HSK {exam.level}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--v14-color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Platform Practice / BETA
            </span>
          </div>
        </div>}

        {isLocked && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            🔒 Khóa
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="v14-exam-card-body">
        <div className="v14-exam-status-tag" style={{ color: status.color }}>
          <span>{status.icon}</span>
          <span>{status.label}</span>
        </div>

        <h3 className="v14-exam-card-title">{exam.title}</h3>

        <div className="v14-exam-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>⏱️</span> {exam.durationMinutes} phút
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📝</span> {exam.totalQuestions} câu hỏi
          </span>
        </div>
        {refined&&<span className="v15-card-action">{isLocked?'Đang chuẩn bị nội dung':exam.status==='in_progress'?'Tiếp tục bài luyện →':'Xem chi tiết →'}</span>}
      </div>
    </div>
  );
};
