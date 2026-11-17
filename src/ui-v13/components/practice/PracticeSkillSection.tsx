import React from 'react';
import { PracticePartVM } from '../../../contracts/ui-v13';
import { PracticePartCard } from './PracticePartCard';

export interface PracticeSkillSectionProps {
  skill: string;
  title: string;
  icon: string;
  parts: PracticePartVM[];
  onStartPart: (partId: string, skill: string) => void;
  skillNotice?: string;
  className?: string;
}

export const PracticeSkillSection: React.FC<PracticeSkillSectionProps> = ({
  title,
  icon,
  parts,
  onStartPart,
  skillNotice,
  className = '',
}) => {
  const totalQuestions = parts.reduce((sum, p) => sum + p.total, 0);
  const totalAvailable = parts.reduce((sum, p) => sum + p.available, 0);

  return (
    <section className={`hsk-practice-skill-group ${className}`} aria-labelledby={`skill-sec-${title}`}>
      <div className="hsk-practice-skill-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }} role="img" aria-hidden="true">
            {icon}
          </span>
          <h3 id={`skill-sec-${title}`} style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
            {title}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)', marginLeft: '0.5rem' }}>
            ({totalAvailable} / {totalQuestions} câu khả dụng)
          </span>
        </div>

        {skillNotice && (
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--hsk-color-amber-dark)',
              backgroundColor: 'var(--hsk-color-amber-light)',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 500,
            }}
          >
            ⚠️ {skillNotice}
          </span>
        )}
      </div>

      <div className="hsk-practice-parts-grid">
        {parts.map((part) => (
          <PracticePartCard
            key={part.id}
            part={part}
            onStartPart={onStartPart}
          />
        ))}
      </div>
    </section>
  );
};
