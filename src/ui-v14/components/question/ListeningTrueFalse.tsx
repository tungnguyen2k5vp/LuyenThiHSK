import React from 'react';
import { ListeningTrueFalseVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';
import { AudioPlayerBar } from '../../primitives/AudioPlayerBar/AudioPlayerBar';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface ListeningTrueFalseProps {
  data: ListeningTrueFalseVM;
  onAnswer: (answer: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  audioCallbacks?: AudioPlayerCallbacks;
  className?: string;
  hideAudio?: boolean;
  imageContent?: React.ReactNode;
}

export const ListeningTrueFalse: React.FC<ListeningTrueFalseProps> = ({
  data,
  onAnswer,
  onPrevious,
  onNext,
  audioCallbacks,
  className = '',
  hideAudio=false,imageContent,
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

      {/* Centered Question Photo */}
      {(imageContent||data.imageUrl) && (
        <div className="v14-q-photo-box">
          {imageContent??<img
            src={data.imageUrl}
            alt={data.imageAlt || `Hình minh họa câu ${data.questionNumber}`}
            className="v14-q-photo-img"
            loading="lazy"
          />}
        </div>
      )}

      {/* Audio Player Bar */}
      {!hideAudio&&<div style={{ margin: 'var(--v14-space-4) 0' }}>
        <AudioPlayerBar
          audio={data.audio}
          callbacks={audioCallbacks}
        />
      </div>}

      {/* Side-by-Side True / False Option Cards (Migii style) */}
      <div className="v14-tf-options-grid" role="radiogroup" aria-label="Lựa chọn đúng hoặc sai">
        {/* Option: True */}
        <button
          type="button"
          role="radio"
          aria-checked={data.selectedAnswer === true}
          disabled={data.isReadOnly}
          className={`v14-tf-card ${data.selectedAnswer === true ? 'is-selected' : ''}`}
          onClick={() => !data.isReadOnly && onAnswer(true)}
        >
          <span className="v14-tf-check-icon">✓</span>
          <span>Đúng</span>
        </button>

        {/* Option: False */}
        <button
          type="button"
          role="radio"
          aria-checked={data.selectedAnswer === false}
          disabled={data.isReadOnly}
          className={`v14-tf-card ${data.selectedAnswer === false ? 'is-selected' : ''}`}
          onClick={() => !data.isReadOnly && onAnswer(false)}
        >
          <span className="v14-tf-check-icon">✕</span>
          <span>Sai</span>
        </button>
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
