import React, { useEffect } from 'react';
import { GrammarLessonViewModel } from '../../types/viewmodels';
import { GrammarExampleBlock } from './GrammarExampleBlock';
import { GrammarComparison } from './GrammarComparison';
import { Button } from '../../primitives/Button';
import { StatusChip } from '../../primitives/StatusChip';
import { Badge } from '../../primitives/Badge';

export interface GrammarLessonReaderProps {
  lesson: GrammarLessonViewModel;
  onClose?: () => void;
  onStartPractice: (lessonId: string) => void;
  className?: string;
}

export const GrammarLessonReader: React.FC<GrammarLessonReaderProps> = ({
  lesson,
  onClose,
  onStartPractice,
  className = '',
}) => {
  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getMasteryBadge = () => {
    switch (lesson.masteryLevel) {
      case 'mastered':
        return <Badge variant="emerald">✓ Đã nắm vững</Badge>;
      case 'learning':
        return <Badge variant="amber">Đang học</Badge>;
      case 'none':
      default:
        return <Badge variant="neutral">Chưa học</Badge>;
    }
  };

  return (
    <div className={`hsk-grammar-reader ${className}`}>
      {/* Top Bar: Level, Code, Close button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--hsk-color-primary-light)',
              color: 'var(--hsk-color-primary-dark)',
            }}
          >
            {lesson.level}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--hsk-color-text-secondary)' }}>
            {lesson.code}
          </span>
          {getMasteryBadge()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusChip status={lesson.contentStatus} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--hsk-color-surface-soft)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: 'var(--hsk-color-text-secondary)',
              }}
              aria-label="Đóng bài học"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Reader Header */}
      <div className="hsk-grammar-reader-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
          {lesson.title}
        </h2>
      </div>

      {/* Structure Box */}
      <div className="hsk-grammar-section">
        <div className="hsk-grammar-section-title">
          <span>📐 Cấu trúc ngữ pháp</span>
        </div>
        <div className="hsk-grammar-reader-structure-box">
          {lesson.structure}
        </div>
      </div>

      {/* Detailed Explanation */}
      <div className="hsk-grammar-section">
        <div className="hsk-grammar-section-title">
          <span>📖 Giải thích ý nghĩa & cách dùng</span>
        </div>
        <div
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: 'var(--hsk-color-text-main)',
            whiteSpace: 'pre-line',
          }}
        >
          {lesson.explanation}
        </div>
      </div>

      {/* Examples Section */}
      {lesson.examples && lesson.examples.length > 0 && (
        <div className="hsk-grammar-section">
          <div className="hsk-grammar-section-title">
            <span>💬 Ví dụ minh họa</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lesson.examples.map((ex, idx) => (
              <GrammarExampleBlock key={idx} example={ex} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Comparison Section (if present) */}
      {lesson.comparison && (
        <div className="hsk-grammar-section">
          <div className="hsk-grammar-section-title">
            <span>⚖️ So sánh & Phân biệt dễ nhầm lẫn</span>
          </div>
          <GrammarComparison comparison={lesson.comparison} />
        </div>
      )}

      {/* Metadata notice */}
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--hsk-color-surface-soft)',
          borderRadius: 'var(--hsk-radius-lg)',
          fontSize: '0.8rem',
          color: 'var(--hsk-color-text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Nguồn: {lesson.sourceNotice || 'Tài liệu chuẩn hóa ngữ pháp HSK'}</span>
        <StatusChip status={lesson.contentStatus} />
      </div>

      {/* Bottom CTA Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--hsk-color-border-subtle)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {onClose && (
          <Button variant="outline" size="md" onClick={onClose}>
            ← Quay lại danh mục
          </Button>
        )}

        <Button
          variant="primary"
          size="md"
          onClick={() => onStartPractice(lesson.id)}
          leftIcon={<span>✍️</span>}
        >
          {lesson.practiceQuestionCount > 0
            ? `Luyện tập (${lesson.practiceQuestionCount} câu)`
            : 'Luyện tập ngữ pháp này'}
        </Button>
      </div>
    </div>
  );
};
