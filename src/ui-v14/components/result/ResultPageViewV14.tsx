import React, { useState } from 'react';
import { ResultPageViewVM } from '../../types/viewmodels';
import { ResultPageCallbacks } from '../../types/callbacks';
import { Button } from '../../primitives/Button/Button';
import { ExplanationAccordion } from '../question/ExplanationAccordion';

export interface ResultPageViewProps {
  data: ResultPageViewVM;
  callbacks: ResultPageCallbacks;
  className?: string;
  summaryOnly?: boolean;
}

export const ResultPageViewV14: React.FC<ResultPageViewProps> = ({
  data,
  callbacks,
  className = '',
  summaryOnly = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const isPassed = data.isPassed ?? null;

  const filteredQuestions = data.questions.filter((q) => {
    if (filter === 'incorrect') return q.status === 'incorrect';
    if (filter === 'correct') return q.status === 'correct';
    return true;
  });

  const minutesSpent = Math.floor(data.durationSeconds / 60);
  const secondsSpent = data.durationSeconds % 60;

  return (
    <div
      className={`v14-result-container ${className}`}
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: 'var(--v14-space-6) var(--v14-space-4) var(--v14-space-12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--v14-space-6)',
      }}
    >
      {/* Top Bar with Back Link */}
      <div>
        <button
          type="button"
          onClick={callbacks.onBackToCatalog}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: 'var(--v14-color-text-secondary)',
            fontWeight: 600,
            fontSize: 'var(--v14-text-sm)',
          }}
        >
          <span>←</span>
          <span>Về danh sách đề thi</span>
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div
        style={{
          backgroundColor: 'var(--v14-color-surface)',
          borderRadius: 'var(--v14-radius-2xl)',
          border: '1px solid var(--v14-color-border)',
          boxShadow: 'var(--v14-shadow-md)',
          padding: 'var(--v14-space-8) var(--v14-space-6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--v14-space-4)',
        }}
      >
        <span
          style={{
            padding: '4px 14px',
            borderRadius: '9999px',
            backgroundColor: isPassed===null?'#f1f5f9':isPassed ? '#dcfce7' : '#fee2e2',
            color: isPassed===null?'#475569':isPassed ? '#15803d' : '#b91c1c',
            fontWeight: 700,
            fontSize: 'var(--v14-text-sm)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {isPassed===null?'KẾT QUẢ LUYỆN TẬP · KHÔNG QUY ĐỔI ĐIỂM HSK':isPassed ? '✓ ĐẠT YÊU CẦU' : '✕ CHƯA ĐẠT'}
        </span>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--v14-color-text-main)', margin: 0 }}>
          {data.title}
        </h1>

        {/* Large Score Metric */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: 'var(--v14-color-primary)',
              lineHeight: 1,
            }}
          >
            {data.accuracyPercent===null?'--':data.accuracyPercent}%
          </span>
          <span style={{ fontSize: '1.1rem', color: 'var(--v14-color-text-muted)', fontWeight: 600 }}>
            độ chính xác
          </span>
        </div>

        {data.userScore !== undefined && data.userScore !== null && (
          <div style={{ fontSize: 'var(--v14-text-base)', color: 'var(--v14-color-text-body)', fontWeight: 600 }}>
            Điểm đạt được:{' '}
            <strong style={{ color: 'var(--v14-color-primary-active)' }}>
              {data.userScore}
            </strong>{' '}
            {data.passingScore===null?' · Điểm luyện tập':` điểm (Điểm chuẩn: ${data.passingScore})`}
          </div>
        )}

        <div style={{ fontSize: 'var(--v14-text-xs)', color: 'var(--v14-color-text-muted)' }}>
          ⏱️ Thời gian hoàn thành: {minutesSpent} phút {secondsSpent} giây
        </div>

        {/* 4-Stat Breakdown Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--v14-space-3)',
            width: '100%',
            maxWidth: '680px',
            marginTop: 'var(--v14-space-4)',
          }}
        >
          {/* Đúng */}
          <div
            style={{
              padding: 'var(--v14-space-3)',
              borderRadius: 'var(--v14-radius-xl)',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
              {data.counts.correct}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>Đúng</div>
          </div>

          {/* Chưa đúng */}
          <div
            style={{
              padding: 'var(--v14-space-3)',
              borderRadius: 'var(--v14-radius-xl)',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>
              {data.counts.incorrect}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b91c1c' }}>Chưa đúng</div>
          </div>

          {/* Bỏ trống */}
          <div
            style={{
              padding: 'var(--v14-space-3)',
              borderRadius: 'var(--v14-radius-xl)',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64748b' }}>
              {data.counts.unanswered}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Bỏ trống</div>
          </div>

          {/* Chờ chấm */}
          <div
            style={{
              padding: 'var(--v14-space-3)',
              borderRadius: 'var(--v14-radius-xl)',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>
              {data.counts.ungraded}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>Chờ chấm</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--v14-space-3)', marginTop: 'var(--v14-space-4)' }}>
          <Button variant="outline" size="md" onClick={() => callbacks.onRetryExam(data.examId)}>
            🔄 Làm lại đề này
          </Button>
          <Button variant="primary" size="md" onClick={callbacks.onBackToCatalog}>
            📚 Xem các đề khác
          </Button>
        </div>
      </div>

      {/* Skills Performance Section */}
      <div
        style={{
          backgroundColor: 'var(--v14-color-surface)',
          borderRadius: 'var(--v14-radius-xl)',
          border: '1px solid var(--v14-color-border)',
          padding: 'var(--v14-space-5)',
        }}
      >
        <h3 style={{ fontSize: 'var(--v14-text-base)', fontWeight: 700, margin: '0 0 var(--v14-space-4)' }}>
          Phân tích kỹ năng làm bài
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-4)' }}>
          {data.sections.map((sec) => (
            <div key={sec.skill} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--v14-text-sm)', fontWeight: 600 }}>
                <span>{sec.label}</span>
                <span style={{ color: 'var(--v14-color-primary)' }}>
                  {sec.correctCount} / {sec.totalCount} ({sec.accuracyPercent===null?'--':sec.accuracyPercent}%)
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: '#f1f5f9',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${sec.accuracyPercent??0}%`,
                    backgroundColor: 'var(--v14-color-primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!summaryOnly&&<>
      {/* Question by Question Review Header & Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: 'var(--v14-text-base)', fontWeight: 700, margin: 0 }}>
          Chi tiết từng câu hỏi ({filteredQuestions.length})
        </h3>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--v14-radius-md)',
              border: 'none',
              background: filter === 'all' ? 'var(--v14-color-primary)' : '#f1f5f9',
              color: filter === 'all' ? '#ffffff' : 'var(--v14-color-text-body)',
              fontWeight: 600,
              fontSize: 'var(--v14-text-xs)',
              cursor: 'pointer',
            }}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--v14-radius-md)',
              border: 'none',
              background: filter === 'incorrect' ? '#ef4444' : '#f1f5f9',
              color: filter === 'incorrect' ? '#ffffff' : 'var(--v14-color-text-body)',
              fontWeight: 600,
              fontSize: 'var(--v14-text-xs)',
              cursor: 'pointer',
            }}
          >
            Chưa đúng
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--v14-radius-md)',
              border: 'none',
              background: filter === 'correct' ? '#16a34a' : '#f1f5f9',
              color: filter === 'correct' ? '#ffffff' : 'var(--v14-color-text-body)',
              fontWeight: 600,
              fontSize: 'var(--v14-text-xs)',
              cursor: 'pointer',
            }}
          >
            Đúng
          </button>
        </div>
      </div>

      {/* Review Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-3)' }}>
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQuestionId === q.id;

          return (
            <div
              key={q.id}
              style={{
                backgroundColor: 'var(--v14-color-surface)',
                borderRadius: 'var(--v14-radius-xl)',
                border: '1px solid var(--v14-color-border)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--v14-space-3) var(--v14-space-4)',
                  cursor: q.explanation ? 'pointer' : 'default',
                  backgroundColor: isExpanded ? 'var(--v14-color-surface-soft)' : 'transparent',
                }}
                onClick={() => q.explanation && setExpandedQuestionId(isExpanded ? null : q.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--v14-radius-full)',
                      backgroundColor:
                        q.status === 'correct'
                          ? '#dcfce7'
                          : q.status === 'incorrect'
                          ? '#fee2e2'
                          : '#f1f5f9',
                      color:
                        q.status === 'correct'
                          ? '#15803d'
                          : q.status === 'incorrect'
                          ? '#b91c1c'
                          : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {q.status === 'correct' ? '✓' : q.status === 'incorrect' ? '✕' : '—'}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--v14-text-sm)' }}>
                    Câu {q.number} ({q.skill})
                  </span>
                </div>

                {q.explanation && (
                  <span style={{ fontSize: 'var(--v14-text-xs)', color: 'var(--v14-color-primary)', fontWeight: 600 }}>
                    {isExpanded ? 'Ẩn lời giải ▲' : 'Xem lời giải ▼'}
                  </span>
                )}
              </div>

              {isExpanded && q.explanation && (
                <div style={{ padding: 'var(--v14-space-3) var(--v14-space-4)', borderTop: '1px solid var(--v14-color-border)' }}>
                  <ExplanationAccordion explanation={q.explanation} defaultOpen={true} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>}
    </div>
  );
};
