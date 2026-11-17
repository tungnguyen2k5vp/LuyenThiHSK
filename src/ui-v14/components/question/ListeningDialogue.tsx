import React from 'react';
import { ListeningDialogueVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';
import { AudioPlayerBar } from '../../primitives/AudioPlayerBar/AudioPlayerBar';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface ListeningDialogueProps {
  data: ListeningDialogueVM;
  onAnswer: (optionId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  audioCallbacks?: AudioPlayerCallbacks;
  className?: string;
  hideAudio?: boolean;
}

export const ListeningDialogue: React.FC<ListeningDialogueProps> = ({
  data,
  onAnswer,
  onPrevious,
  onNext,
  audioCallbacks,
  className = '',
  hideAudio=false,
}) => {
  return (
    <div className={`v14-question-item ${className}`}>
      {/* Question Header */}
      <div style={{ marginBottom: 'var(--v14-space-3)' }}>
        <div className="v14-q-header-part">{data.partTitle}</div>
        <div className="v14-q-header-sub">
          Câu {data.questionNumber}: {data.instruction}
        </div>
      </div>

      {/* Audio Player Bar */}
      {!hideAudio&&<div style={{ margin: 'var(--v14-space-4) 0' }}>
        <AudioPlayerBar
          audio={data.audio}
          callbacks={audioCallbacks}
        />
      </div>}

      {/* Vertical Option Cards (Migii style with Pinyin on top & Hanzi below) */}
      <div
        className="v14-dialogue-options-list"
        role="radiogroup"
        aria-label={`Lựa chọn cho câu ${data.questionNumber}`}
      >
        {data.options.map((opt) => {
          const isSelected = data.selectedOptionId === opt.id || opt.isSelected;

          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={data.isReadOnly ? -1 : 0}
              className={`v14-dialogue-option-card exam-choice ${isSelected ? 'is-selected' : ''}`}
              aria-disabled={data.isReadOnly}
              onClick={() => !data.isReadOnly && onAnswer(opt.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !data.isReadOnly) {
                  e.preventDefault();
                  onAnswer(opt.id);
                }
              }}
            >
              {/* Option Letter (A, B, C) */}
              <div className="v14-dialogue-letter-badge">{opt.label}</div>

              {/* Text: Pinyin on top, Hanzi below */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {opt.pinyin && (
                  <span
                    style={{
                      fontFamily: 'var(--v14-font-pinyin)',
                      fontSize: 'var(--v14-text-xs)',
                      color: 'var(--v14-color-text-secondary)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {opt.pinyin}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--v14-font-hanzi)',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--v14-color-text-main)',
                  }}
                >
                  {opt.hanzi}
                </span>
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

      {/* Bottom Navigation Buttons */}
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
