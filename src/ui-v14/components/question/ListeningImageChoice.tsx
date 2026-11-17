import React from 'react';
import { ListeningImageChoiceVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';
import { AudioPlayerBar } from '../../primitives/AudioPlayerBar/AudioPlayerBar';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface ListeningImageChoiceProps {
  data: ListeningImageChoiceVM;
  onAnswer: (optionId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  audioCallbacks?: AudioPlayerCallbacks;
  className?: string;
  hideAudio?: boolean;
  renderImage?: (optionId:string)=>React.ReactNode;
}

export const ListeningImageChoice: React.FC<ListeningImageChoiceProps> = ({
  data,
  onAnswer,
  onPrevious,
  onNext,
  audioCallbacks,
  className = '',
  hideAudio=false,renderImage,
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

      {/* 3-Image Choices Grid (Migii style 3 balanced cards) */}
      <div
        className="v14-img-choice-grid"
        role="radiogroup"
        aria-label={`Lựa chọn ảnh câu ${data.questionNumber}`}
      >
        {data.options.map((opt) => {
          const isSelected = data.selectedOptionId === opt.id || opt.isSelected;

          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={data.isReadOnly ? -1 : 0}
              className={`v14-img-choice-card exam-choice ${isSelected ? 'is-selected' : ''}`}
              aria-disabled={data.isReadOnly}
              onClick={() => !data.isReadOnly && onAnswer(opt.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !data.isReadOnly) {
                  e.preventDefault();
                  onAnswer(opt.id);
                }
              }}
            >
              {/* Option Letter Label Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--v14-radius-full)',
                  backgroundColor: isSelected
                    ? 'var(--v14-color-primary)'
                    : 'rgba(255, 255, 255, 0.9)',
                  color: isSelected ? '#ffffff' : 'var(--v14-color-text-main)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--v14-shadow-xs)',
                  zIndex: 2,
                }}
              >
                {opt.label}
              </div>

              {/* Photo */}
              {renderImage?renderImage(opt.id):<img
                src={opt.imageUrl}
                alt={opt.alt || `Lựa chọn ${opt.label}`}
                className="v14-img-choice-photo"
                loading="lazy"
              />}
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
