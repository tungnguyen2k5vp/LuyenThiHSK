import React from 'react';
import { SkillId } from '../../../contracts/ui-v13';

export interface ResultSkillBreakdownProps {
  sections: readonly {
    skill: SkillId;
    correct: number;
    incorrect: number;
    unanswered: number;
    ungraded: number;
    gradedCount: number;
    accuracyPercent: number | null;
  }[];
  className?: string;
}

export const ResultSkillBreakdown: React.FC<ResultSkillBreakdownProps> = ({
  sections,
  className = '',
}) => {
  const getSkillMeta = (s: SkillId) => {
    switch (s) {
      case 'listening': return { title: 'Kỹ năng Nghe hiểu (Listening)', icon: '🎧' };
      case 'reading': return { title: 'Kỹ năng Đọc hiểu (Reading)', icon: '📖' };
      case 'writing': return { title: 'Kỹ năng Viết (Writing)', icon: '✍️' };
      default: return { title: 'Kỹ năng khác', icon: '📝' };
    }
  };

  return (
    <div className={`hsk-result-skill-card ${className}`}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: '0 0 0.5rem' }}>
        📊 Phân Tích Chi Tiết Theo Từng Kỹ Năng
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections.map((sec) => {
          const meta = getSkillMeta(sec.skill);
          const percent = sec.accuracyPercent !== null ? sec.accuracyPercent : 0;

          return (
            <div key={sec.skill} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
                  {meta.icon} {meta.title}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--hsk-color-primary)' }}>
                  {sec.accuracyPercent !== null ? `${sec.accuracyPercent}%` : 'Chưa tính điểm'}
                </span>
              </div>

              {/* Progress Track */}
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    backgroundColor: 'var(--hsk-color-primary)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>
                <span>
                  Đúng: <strong>{sec.correct}</strong> / {sec.gradedCount} câu khách quan
                </span>
                {sec.ungraded > 0 && (
                  <span style={{ color: 'var(--hsk-color-text-muted)' }}>
                    ({sec.ungraded} câu tự luận chờ đánh giá)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
