import React from 'react';
import { PracticePartVM } from '../../../contracts/ui-v13';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';

export interface PracticePartCardProps {
  part: PracticePartVM;
  onStartPart: (partId: string, skill: string) => void;
  className?: string;
}

export const PracticePartCard: React.FC<PracticePartCardProps> = ({
  part,
  onStartPart,
  className = '',
}) => {
  const isAvailable = part.action.availability.available;
  const unavailableReason = part.action.availability.reason;

  const percent = part.total > 0 ? Math.round((part.completed / part.total) * 100) : 0;

  return (
    <div data-part-id={part.id} className={`hsk-practice-part-card ${!isAvailable ? 'is-disabled' : ''} ${className}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
            {part.title}
          </h4>
          {isAvailable ? (
            <Badge variant="emerald">{part.available} câu khả dụng</Badge>
          ) : (
            <Badge variant="neutral">Chưa khả dụng</Badge>
          )}
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)', marginBottom: '0.75rem' }}>
          {isAvailable ? (
            <span>
              Đã hoàn thành: <strong>{part.completed}</strong> / {part.total} câu ({percent}%)
            </span>
          ) : (
            <span style={{ color: 'var(--hsk-color-amber-dark)' }}>
              ⚠️ {unavailableReason || 'Nội dung đang được cập nhật'}
            </span>
          )}
        </div>

        {isAvailable && (
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: 'var(--hsk-color-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Button
          variant={isAvailable ? 'primary' : 'outline'}
          size="sm"
          disabled={!isAvailable}
          onClick={() => onStartPart(part.id, part.skill)}
          style={{ width: '100%' }}
        >
          {isAvailable ? 'Luyện tập phần này' : 'Chưa thể luyện tập'}
        </Button>
      </div>
    </div>
  );
};
