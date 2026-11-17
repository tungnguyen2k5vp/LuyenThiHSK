import React from 'react';
import { ListeningMatchingVM } from '../../types/viewmodels';
import { AudioPlayerCallbacks } from '../../types/callbacks';
import { MiniAudioPlayer } from '../../primitives/MiniAudioPlayer/MiniAudioPlayer';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface ListeningMatchingProps {
  data: ListeningMatchingVM;
  onAnswerSubQuestion: (subQuestionId: string, optionId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  audioCallbacks?: AudioPlayerCallbacks;
  className?: string;
  hideAudio?: boolean;
  renderImage?: (optionId:string)=>React.ReactNode;
}

export const ListeningMatching: React.FC<ListeningMatchingProps> = ({
  data,
  onAnswerSubQuestion,
  onPrevious,
  onNext,
  audioCallbacks,
  className = '',
  hideAudio=false,renderImage,
}) => {
  const OPTION_LETTERS = data.sharedImages.map(image=>image.id);

  return (
    <div className={`v14-question-item ${className}`}>
      {/* Question Header */}
      <div style={{ marginBottom: 'var(--v14-space-3)' }}>
        <div className="v14-q-header-part">{data.partTitle}</div>
        <div className="v14-q-header-sub">
          {data.questionRange}: {data.instruction}
        </div>
      </div>

      {/* 5 Shared Reference Images (A, B, C, D, E) */}
      <div className="v14-matching-shared-images-row">
        {data.sharedImages.map((img) => (
          <div key={img.id} className="v14-matching-image-box">
            {renderImage?renderImage(img.id):<img
              src={img.imageUrl}
              alt={img.alt || `Ảnh tham khảo ${img.label}`}
              className="v14-matching-thumb"
              loading="lazy"
            />}
            <span
              style={{
                fontSize: 'var(--v14-text-sm)',
                fontWeight: 700,
                color: 'var(--v14-color-text-main)',
              }}
            >
              {img.label}
            </span>
          </div>
        ))}
      </div>

      {/* 5 Sub-questions with Mini Audio Player & Option Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-3)' }}>
        {data.subQuestions.map((subQ) => (
          <div key={subQ.id} className="v14-matching-sub-row">
            {/* Sub-question Number */}
            <span style={{ fontWeight: 700, fontSize: 'var(--v14-text-sm)', minWidth: '60px' }}>
              Câu {subQ.subNumber}:
            </span>

            {/* Compact Mini Audio Player */}
            {!hideAudio&&<div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
              <MiniAudioPlayer
                audio={subQ.audio}
                callbacks={audioCallbacks}
              />
            </div>}

            {/* A, B, C, D, E Buttons */}
            <div className="v14-matching-options-group" role="group" aria-label={`Đáp án câu ${subQ.subNumber}`}>
              {OPTION_LETTERS.map((letter) => {
                const isSelected = subQ.selectedOptionId === letter;
                const isCorrect = subQ.correctOptionId === letter;
                const isUserWrong = isSelected && subQ.isCorrect === false;

                const btnClasses = [
                  'v14-matching-option-btn',
                  isSelected && !subQ.correctOptionId ? 'is-selected' : '',
                  isCorrect && subQ.correctOptionId ? 'is-correct' : '',
                  isUserWrong ? 'is-incorrect' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={data.isReadOnly}
                    className={btnClasses}
                    onClick={() => !data.isReadOnly && onAnswerSubQuestion(subQ.id, letter)}
                    aria-label={`Chọn đáp án ${letter} cho câu ${subQ.subNumber}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
