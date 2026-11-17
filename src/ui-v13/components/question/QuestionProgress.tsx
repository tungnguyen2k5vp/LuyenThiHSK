import React from 'react';
import { NavigatorItemVM } from '../../../contracts/ui-v13';

export interface QuestionProgressProps {
  current: number; // 0-based
  total: number;
  answeredCount: number;
  items?: readonly NavigatorItemVM[];
  onNavigate?: (index: number) => void;
  className?: string;
}

export const QuestionProgress: React.FC<QuestionProgressProps> = ({
  current,
  total,
  answeredCount,
  items,
  onNavigate,
  className = '',
}) => {
  const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {/* Top count summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
          Câu {current + 1} / {total}
        </span>
        <span style={{ color: 'var(--hsk-color-text-secondary)' }}>
          Đã trả lời: <strong>{answeredCount}</strong> / {total}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--hsk-color-border-subtle)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: 'var(--hsk-color-primary)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Quick Question Pills if items are passed */}
      {items && items.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            marginTop: '0.5rem',
            maxHeight: '80px',
            overflowY: 'auto',
          }}
          role="navigation"
          aria-label="Danh sách câu hỏi"
        >
          {items.map((item) => {
            const isCurrent = item.index === current;
            const isAnswered = item.answered;
            const isFlagged = item.flagged;
            const isAllowed = item.availability.available;

            return (
              <button
                key={item.questionId}
                type="button"
                disabled={!isAllowed}
                onClick={() => onNavigate && onNavigate(item.index)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: isCurrent
                    ? '2px solid var(--hsk-color-primary)'
                    : isFlagged
                    ? '1.5px solid var(--hsk-color-amber)'
                    : '1px solid var(--hsk-color-border-subtle)',
                  backgroundColor: isCurrent
                    ? 'var(--hsk-color-primary-light)'
                    : isAnswered
                    ? '#dcfce7'
                    : '#ffffff',
                  color: isCurrent
                    ? 'var(--hsk-color-primary-dark)'
                    : isAnswered
                    ? '#166534'
                    : 'var(--hsk-color-text-main)',
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: isAllowed ? 'pointer' : 'not-allowed',
                  opacity: isAllowed ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
                aria-label={`Chuyển đến câu ${item.number}`}
              >
                {item.number}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
