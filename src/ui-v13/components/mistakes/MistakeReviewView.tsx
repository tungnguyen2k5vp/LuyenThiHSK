import React, { useState } from 'react';
import { MistakeReviewVM } from '../../../contracts/ui-v13';
import { MistakeCard } from './MistakeCard';
import { Button } from '../../primitives/Button';
import { EmptyState } from '../../primitives/EmptyState';
import { StatusChip } from '../../primitives/StatusChip';

export interface MistakeReviewViewProps {
  model: MistakeReviewVM;
  onReviewQuestion: (reviewId: string) => void;
  onMarkReviewed?: (reviewId: string) => void;
  onStartDueReview?: () => void;
  onBack?: () => void;
  className?: string;
}

export const MistakeReviewView: React.FC<MistakeReviewViewProps> = ({
  model,
  onReviewQuestion,
  onMarkReviewed,
  onStartDueReview,
  onBack,
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'due' | 'incorrect' | 'flagged'>('all');

  const filteredItems = model.items.filter((item) => {
    if (filter === 'due') {
      return item.dueAt && new Date(item.dueAt) <= new Date();
    }
    if (filter === 'incorrect') return item.reason === 'incorrect';
    if (filter === 'flagged') return item.reason === 'flagged';
    return true;
  });

  return (
    <div className={`hsk-mistakes-workspace ${className}`}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
              Sổ Tay Câu Hỏi Cần Ôn Tập (HSK {model.meta.level})
            </h2>
            <StatusChip status="PREVIEW" />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
            Tự động tổng hợp các câu làm sai, câu gắn cờ và câu đến hạn ôn tập ngắt quãng (SRS).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onBack && (
            <Button variant="outline" size="md" onClick={onBack}>
              ← Quay lại
            </Button>
          )}
          {model.dueCount > 0 && onStartDueReview && (
            <Button
              variant="primary"
              size="md"
              onClick={onStartDueReview}
              leftIcon={<span>⚡</span>}
            >
              Ôn ngay {model.dueCount} câu đến hạn
            </Button>
          )}
        </div>
      </div>

      {/* Notice Banner */}
      {model.notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--hsk-color-surface-soft)',
            borderRadius: 'var(--hsk-radius-lg)',
            fontSize: '0.85rem',
            color: 'var(--hsk-color-text-secondary)',
            border: '1px solid var(--hsk-color-border-subtle)',
          }}
        >
          ℹ️ {model.notice}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          type="button"
          className={`hsk-filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({model.total})
        </button>
        <button
          type="button"
          className={`hsk-filter-pill ${filter === 'due' ? 'active' : ''}`}
          onClick={() => setFilter('due')}
        >
          Đến hạn ôn ({model.dueCount})
        </button>
        <button
          type="button"
          className={`hsk-filter-pill ${filter === 'incorrect' ? 'active' : ''}`}
          onClick={() => setFilter('incorrect')}
        >
          Câu làm sai ({model.items.filter((i) => i.reason === 'incorrect').length})
        </button>
        <button
          type="button"
          className={`hsk-filter-pill ${filter === 'flagged' ? 'active' : ''}`}
          onClick={() => setFilter('flagged')}
        >
          Đã gắn cờ ({model.items.filter((i) => i.reason === 'flagged').length})
        </button>
      </div>

      {/* Items List or Empty State */}
      {filteredItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredItems.map((item) => (
            <MistakeCard
              key={item.reviewId}
              item={item}
              onReview={onReviewQuestion}
              onMarkReviewed={onMarkReviewed}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không có câu hỏi nào cần ôn tập"
          description={
            filter !== 'all'
              ? 'Không có câu hỏi nào phù hợp với bộ lọc hiện tại.'
              : 'Tuyệt vời! Bạn không còn câu hỏi làm sai hoặc câu hỏi đến hạn ôn tập trong danh mục này.'
          }
          actionLabel={filter !== 'all' ? 'Xem tất cả câu hỏi' : undefined}
          onAction={filter !== 'all' ? () => setFilter('all') : undefined}
        />
      )}
    </div>
  );
};
