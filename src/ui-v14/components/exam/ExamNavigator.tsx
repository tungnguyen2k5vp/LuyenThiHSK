import React from 'react';
import { ExamNavigatorVM, SkillId } from '../../types/viewmodels';

export interface ExamNavigatorProps {
  navigator: ExamNavigatorVM;
  onSelectSkill: (skill: SkillId) => void;
  onSelectQuestion: (index: number) => void;
  className?: string;
}

export const ExamNavigator: React.FC<ExamNavigatorProps> = ({
  navigator,
  onSelectSkill,
  onSelectQuestion,
  className = '',
}) => {
  const activeSkillObj =
    navigator.skills.find((s) => s.skill === navigator.activeSkill) || navigator.skills[0];

  return (
    <aside className={`v14-navigator-panel ${className}`} aria-label="Danh sách câu hỏi thi">
      {/* Skill Tabs (Nghe / Đọc / Viết) */}
      <div className="v14-nav-skill-tabs" role="tablist">
        {navigator.skills.map((s) => (
          <button
            key={s.skill}
            type="button"
            role="tab"
            aria-selected={s.skill === navigator.activeSkill}
            disabled={s.skill!==navigator.activeSkill&&!s.parts.some(p=>p.questions.some(q=>q.isAllowed))}
            className={`v14-nav-skill-tab ${s.skill === navigator.activeSkill ? 'is-active' : ''}`}
            onClick={() => onSelectSkill(s.skill)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Parts & Question Bubbles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-4)' }}>
        {activeSkillObj?.parts.map((part) => (
          <div key={part.partId} className="v14-nav-part-section">
            {/* Part Header & Completion Counter */}
            <div className="v14-nav-part-header">
              <span>{part.title}</span>
              <span className="v14-nav-part-count">
                {String(part.completedCount).padStart(2, '0')} / {String(part.totalCount).padStart(2, '0')}
              </span>
            </div>

            {/* Bubble items */}
            <div className="v14-nav-bubbles-row">
              {part.questions.map((q) => {
                const bubbleClasses = [
                  'v14-nav-bubble',
                  q.status === 'current' ? 'is-current' : '',
                  q.status === 'answered' ? 'is-answered' : '',
                  q.status === 'correct' ? 'is-correct' : '',
                  q.status === 'incorrect' ? 'is-incorrect' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={q.id}
                    type="button"
                    disabled={!q.isAllowed}
                    className={bubbleClasses}
                    onClick={() => q.isAllowed && onSelectQuestion(q.index)}
                    aria-label={`Câu ${q.number}, trạng thái ${q.status}`}
                    aria-current={q.status === 'current' ? 'true' : undefined}
                  >
                    {String(q.number).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
