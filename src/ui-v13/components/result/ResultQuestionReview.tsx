import React, { useState } from 'react';
import { ResultItemVM, QuestionAnswerStatus } from '../../../contracts/ui-v13';
import { PracticeFeedback } from '../question/PracticeFeedback';

export interface ResultQuestionReviewProps {
  items: readonly ResultItemVM[];
  className?: string;
}

export const ResultQuestionReview: React.FC<ResultQuestionReviewProps> = ({
  items,
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'ungraded'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === 'incorrect') return item.status === 'incorrect';
    if (filter === 'ungraded') return item.status === 'ungraded';
    return true;
  });

  const getStatusBadge = (status: QuestionAnswerStatus) => {
    switch (status) {
      case 'correct':
        return <span style={{ color: 'var(--hsk-color-success)', fontWeight: 600, fontSize: '0.8rem' }}>✓ Đúng</span>;
      case 'incorrect':
        return <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>✕ Sai</span>;
      case 'ungraded':
        return <span style={{ color: 'var(--hsk-color-primary)', fontWeight: 600, fontSize: '0.8rem' }}>📝 Chờ chấm</span>;
      case 'unanswered':
      default:
        return <span style={{ color: 'var(--hsk-color-text-muted)', fontSize: '0.8rem' }}>⚪ Bỏ trống</span>;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
          🔍 Danh Sách Câu Hỏi & Giải Thích Chi Tiết
        </h3>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`hsk-filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({items.length})
          </button>
          <button
            type="button"
            className={`hsk-filter-pill ${filter === 'incorrect' ? 'active' : ''}`}
            onClick={() => setFilter('incorrect')}
          >
            Câu sai ({items.filter((i) => i.status === 'incorrect').length})
          </button>
          <button
            type="button"
            className={`hsk-filter-pill ${filter === 'ungraded' ? 'active' : ''}`}
            onClick={() => setFilter('ungraded')}
          >
            Chờ chấm ({items.filter((i) => i.status === 'ungraded').length})
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.questionId;

          return (
            <div
              key={item.questionId}
              style={{
                borderRadius: 'var(--hsk-radius-xl)',
                border: '1px solid var(--hsk-color-border-subtle)',
                backgroundColor: 'var(--hsk-color-surface)',
                overflow: 'hidden',
              }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(item.questionId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(item.questionId);
                  }
                }}
                className="hsk-result-question-row"
                style={{ cursor: 'pointer' }}
                aria-expanded={isExpanded}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--hsk-color-text-main)' }}>
                    Câu {item.number}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)', textTransform: 'capitalize' }}>
                    {item.skill}
                  </span>
                  {item.seconds !== null && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
                      ⏱️ {item.seconds}s
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getStatusBadge(item.status)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--hsk-color-text-muted)' }}>
                    {isExpanded ? '▲ Thu gọn' : '▼ Xem giải thích'}
                  </span>
                </div>
              </div>

              {/* Expanded Feedback Panel */}
              {isExpanded && item.feedback && (
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <PracticeFeedback feedback={item.feedback} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
