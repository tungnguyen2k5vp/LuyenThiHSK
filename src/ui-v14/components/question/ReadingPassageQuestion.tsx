import React from 'react';
import { EnhancedExplanationVM } from '../../types/viewmodels';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface ReadingOptionVM {
  id: string;
  label: string;
  hanzi: string;
  pinyin?: string;
  meaningVi?: string;
}

export interface ReadingPassageQuestionVM {
  id: string;
  questionNumber: number;
  partTitle: string;
  instruction: string;
  imageUrl?: string;
  passageHanzi?: string;
  passagePinyin?: string;
  options: ReadingOptionVM[];
  selectedOptionId: string | null;
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

export interface ReadingPassageQuestionProps {
  data: ReadingPassageQuestionVM;
  onAnswer: (optionId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export const ReadingPassageQuestion: React.FC<ReadingPassageQuestionProps> = ({
  data,
  onAnswer,
  onPrevious,
  onNext,
  className = '',
}) => {
  return (
    <div className={`v14-question-item ${className}`}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--v14-space-3)' }}>
        <div className="v14-q-header-part">{data.partTitle}</div>
        <div className="v14-q-header-sub">
          Câu {data.questionNumber}: {data.instruction}
        </div>
      </div>

      {/* Image if present */}
      {data.imageUrl && (
        <div className="v14-q-photo-box" style={{ marginBottom: 'var(--v14-space-4)' }}>
          <img src={data.imageUrl} alt="Đề thi đọc" className="v14-q-photo-img" loading="lazy" />
        </div>
      )}

      {/* Passage / Target Text */}
      {(data.passageHanzi || data.passagePinyin) && (
        <div
          style={{
            padding: 'var(--v14-space-4)',
            borderRadius: 'var(--v14-radius-xl)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--v14-color-border)',
            marginBottom: 'var(--v14-space-4)',
          }}
        >
          {data.passagePinyin && (
            <div
              style={{
                fontFamily: 'var(--v14-font-pinyin)',
                fontSize: 'var(--v14-text-sm)',
                color: 'var(--v14-color-text-secondary)',
                marginBottom: '4px',
              }}
            >
              {data.passagePinyin}
            </div>
          )}
          {data.passageHanzi && (
            <div
              style={{
                fontFamily: 'var(--v14-font-hanzi)',
                fontSize: '1.25rem',
                lineHeight: 1.8,
                color: 'var(--v14-color-text-main)',
              }}
            >
              {data.passageHanzi}
            </div>
          )}
        </div>
      )}

      {/* Options List */}
      <div className="v14-dialogue-options-list" role="radiogroup" aria-label="Lựa chọn đáp án đọc">
        {data.options.map((opt) => {
          const isSelected = data.selectedOptionId === opt.id;

          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={Boolean(data.isReadOnly)}
              tabIndex={data.isReadOnly ? -1 : 0}
              className={`v14-dialogue-option-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => !data.isReadOnly && onAnswer(opt.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !data.isReadOnly) {
                  e.preventDefault();
                  onAnswer(opt.id);
                }
              }}
            >
              <div className="v14-dialogue-letter-badge">{opt.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {opt.pinyin && (
                  <span
                    style={{
                      fontFamily: 'var(--v14-font-pinyin)',
                      fontSize: 'var(--v14-text-xs)',
                      color: 'var(--v14-color-text-secondary)',
                    }}
                  >
                    {opt.pinyin}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--v14-font-hanzi)',
                    fontSize: '1.15rem',
                    color: 'var(--v14-color-text-main)',
                    fontWeight: 600,
                  }}
                >
                  {opt.hanzi}
                </span>
                {opt.meaningVi && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--v14-color-text-muted)' }}>
                    ({opt.meaningVi})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Section */}
      {data.explanation && (
        <div style={{ marginTop: 'var(--v14-space-5)' }}>
          <ExplanationAccordion explanation={data.explanation} />
        </div>
      )}

      {/* Footer Navigation */}
      <div className="v14-exam-nav-footer">
        {onPrevious && (
          <Button variant="ghost" size="md" onClick={onPrevious}>
            Câu trước
          </Button>
        )}
        {onNext && (
          <Button variant="primary" size="md" onClick={onNext}>
            Câu tiếp theo
          </Button>
        )}
      </div>
    </div>
  );
};
