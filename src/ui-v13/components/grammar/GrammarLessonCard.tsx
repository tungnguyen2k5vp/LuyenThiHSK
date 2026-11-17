import React from 'react';
import { GrammarLessonViewModel } from '../../types/viewmodels';
import { StatusChip } from '../../primitives/StatusChip';
import { Badge } from '../../primitives/Badge';

export interface GrammarLessonCardProps {
  lesson: GrammarLessonViewModel;
  onSelect: (id: string) => void;
  className?: string;
}

export const GrammarLessonCard: React.FC<GrammarLessonCardProps> = ({
  lesson,
  onSelect,
  className = '',
}) => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(lesson.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(lesson.id)}
      onKeyDown={handleKeyDown}
      className={`hsk-grammar-card ${className}`}
      aria-label={`Bài ngữ pháp ${lesson.code}: ${lesson.title}. Cấu trúc: ${lesson.structure}`}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="hsk-grammar-code">{lesson.code}</span>
            {getMasteryBadge()}
          </div>
          <StatusChip status={lesson.contentStatus} />
        </div>

        <h3 className="hsk-grammar-title">{lesson.title}</h3>

        <div className="hsk-grammar-structure-pill">{lesson.structure}</div>

        <p className="hsk-grammar-explanation">{lesson.explanation}</p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--hsk-color-border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--hsk-color-text-secondary)',
        }}
      >
        <span>
          📝 {lesson.practiceQuestionCount > 0 ? `${lesson.practiceQuestionCount} câu bài tập` : 'Chưa có câu hỏi'}
        </span>
        <span style={{ color: 'var(--hsk-color-primary)', fontWeight: 600 }}>
          Xem chi tiết →
        </span>
      </div>
    </div>
  );
};
