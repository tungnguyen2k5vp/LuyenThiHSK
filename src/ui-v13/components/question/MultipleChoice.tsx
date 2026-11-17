import React from 'react';
import { OptionVM } from '../../../contracts/ui-v13';

export interface MultipleChoiceProps {
  options: readonly OptionVM[];
  onChoose: (optionId: string) => void;
  readOnly?: boolean;
  className?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  options,
  onChoose,
  readOnly = false,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, optionId: string, disabled: boolean) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !readOnly) {
      e.preventDefault();
      onChoose(optionId);
    }
  };

  return (
    <div
      className={`hsk-options-list ${className}`}
      role="radiogroup"
      aria-label="Các lựa chọn đáp án"
    >
      {options.map((option, idx) => {
        const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
        const isDisabled = option.disabled || readOnly;

        return (
          <button
            type="button"
            key={option.id}
            role="radio"
            tabIndex={isDisabled ? -1 : 0}
            aria-checked={option.selected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                onChoose(option.id);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, option.id, isDisabled)}
            className={`hsk-option-item exam-choice ${option.selected ? 'is-selected selected' : ''} ${
              isDisabled ? 'is-disabled' : ''
            }`}
          >
            <div className="hsk-option-letter">{letter}</div>
            <div className="hsk-option-text">
              {option.pinyin && (
                <div
                  style={{
                    fontFamily: 'var(--hsk-font-pinyin)',
                    fontSize: '0.85rem',
                    color: 'var(--hsk-color-primary)',
                    marginBottom: '2px',
                  }}
                >
                  {option.pinyin}
                </div>
              )}
              <div>{option.text}</div>
            </div>
            {option.selected && (
              <span
                style={{
                  color: 'var(--hsk-color-primary)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  marginLeft: 'auto',
                }}
                aria-hidden="true"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
