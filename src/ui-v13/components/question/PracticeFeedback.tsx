import React from 'react';
import { FeedbackVM } from '../../../contracts/ui-v13';

export interface PracticeFeedbackProps {
  feedback: FeedbackVM;
  className?: string;
}

export const PracticeFeedback: React.FC<PracticeFeedbackProps> = ({
  feedback,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (feedback.status) {
      case 'correct':
        return {
          title: '✓ Chính xác!',
          cardClass: 'is-correct',
          titleColor: 'var(--hsk-color-success)',
        };
      case 'incorrect':
        return {
          title: '✕ Chưa chính xác',
          cardClass: 'is-incorrect',
          titleColor: '#ef4444',
        };
      case 'ungraded':
        return {
          title: '📝 Chờ đánh giá (Bài viết chưa chấm)',
          cardClass: 'is-ungraded',
          titleColor: 'var(--hsk-color-text-secondary)',
          notice: 'Câu tự luận / viết được phân loại chưa chấm, không bị tính là câu sai.',
        };
      case 'unanswered':
      default:
        return {
          title: '⚪ Chưa làm',
          cardClass: 'is-ungraded',
          titleColor: 'var(--hsk-color-text-muted)',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`hsk-feedback-card ${config.cardClass} ${className}`} role="region" aria-label="Giải thích kết quả">
      <div className="hsk-feedback-status-title" style={{ color: config.titleColor }}>
        {config.title}
      </div>

      {config.notice && (
        <div style={{ fontSize: '0.8rem', color: 'var(--hsk-color-text-secondary)', fontStyle: 'italic' }}>
          {config.notice}
        </div>
      )}

      {feedback.solutionText && (
        <div className="hsk-feedback-solution">
          Đáp án đúng: <span style={{ color: 'var(--hsk-color-primary)', fontFamily: 'var(--hsk-font-hanzi)' }}>{feedback.solutionText}</span>
        </div>
      )}

      {feedback.explanation && (
        <div className="hsk-feedback-explanation">
          <strong>Giải thích chi tiết:</strong> {feedback.explanation}
        </div>
      )}

      {/* Related Grammar & Words */}
      {(feedback.relatedGrammarIds.length > 0 || feedback.relatedWordIds.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
          {feedback.relatedGrammarIds.map((gId) => (
            <span
              key={gId}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--hsk-color-primary-light)',
                color: 'var(--hsk-color-primary-dark)',
                fontWeight: 600,
              }}
            >
              📖 Ngữ pháp: {gId}
            </span>
          ))}

          {feedback.relatedWordIds.map((wId) => (
            <span
              key={wId}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--hsk-color-amber-light)',
                color: 'var(--hsk-color-amber-dark)',
                fontWeight: 600,
              }}
            >
              🔤 Từ vựng: {wId}
            </span>
          ))}
        </div>
      )}

      {/* Rubric criteria if present */}
      {feedback.rubric.length > 0 && (
        <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--hsk-color-text-secondary)' }}>
          <strong>Tiêu chí đánh giá:</strong>
          <ul style={{ margin: '4px 0 0 1.25rem', padding: 0 }}>
            {feedback.rubric.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
