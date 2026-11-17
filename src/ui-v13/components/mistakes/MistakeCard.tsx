import React from 'react';
import { MistakeItemVM } from '../../../contracts/ui-v13';
import { Button } from '../../primitives/Button';

export interface MistakeCardProps {
  item: MistakeItemVM;
  onReview: (reviewId: string) => void;
  onMarkReviewed?: (reviewId: string) => void;
  className?: string;
}

export const MistakeCard: React.FC<MistakeCardProps> = ({
  item,
  onReview,
  onMarkReviewed,
  className = '',
}) => {
  const getReasonConfig = () => {
    switch (item.reason) {
      case 'incorrect':
        return { label: 'Làm sai', className: 'reason-incorrect' };
      case 'flagged':
        return { label: 'Đã gắn cờ', className: 'reason-flagged' };
      case 'unanswered':
        return { label: 'Bỏ trống', className: 'reason-unanswered' };
      case 'self-review':
      default:
        return { label: 'Chờ tự xem lại', className: 'reason-self-review' };
    }
  };

  const reason = getReasonConfig();

  return (
    <div data-review-id={item.reviewId} className={`hsk-mistake-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`hsk-mistake-reason-pill ${reason.className}`}>
            {reason.label}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--hsk-color-surface-soft)',
              color: 'var(--hsk-color-text-secondary)',
              textTransform: 'capitalize',
            }}
          >
            {item.skill}
          </span>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
          Hạn ôn: {item.dueAt ? new Date(item.dueAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
        </span>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hsk-color-text-main)', margin: '0 0 0.25rem' }}>
          {item.title}
        </h4>

        <p>{item.availableIndependent} câu luyện độc lập liên quan khả dụng.</p>
        {item.reviewAvailability?.available===false&&<p role="status">{item.reviewAvailability.reason}</p>}
        {/* Related Knowledge Tags */}
        {(item.relatedGrammarIds.length > 0 || item.relatedWordIds.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
            {item.relatedGrammarIds.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--hsk-color-primary-light)',
                  color: 'var(--hsk-color-primary-dark)',
                }}
              >
                Ngữ pháp: {g}
              </span>
            ))}
            {item.relatedWordIds.map((w) => (
              <span
                key={w}
                style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--hsk-color-amber-light)',
                  color: 'var(--hsk-color-amber-dark)',
                }}
              >
                Từ vựng: {w}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--hsk-color-border-subtle)' }}>
        {onMarkReviewed ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkReviewed(item.reviewId)}
            leftIcon={<span>✓</span>}
          >
            Đã hiểu bài này
          </Button>
        ) : (
          <span />
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={() => onReview(item.reviewId)}
          disabled={!item.reviewAvailability?.available}
          leftIcon={<span>🔄</span>}
        >
          Luyện lại ngay
        </Button>
      </div>
    </div>
  );
};
