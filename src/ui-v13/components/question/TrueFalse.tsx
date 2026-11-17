import React from 'react';
import { OptionVM } from '../../../contracts/ui-v13';

export interface TrueFalseProps {
  options: readonly OptionVM[];
  onChoose: (optionId: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  options,
  onChoose,
  readOnly = false,
  className = '',
}) => {
  return (
    <div
      className={className}
      role="radiogroup"
      aria-label="Chọn đúng hoặc sai"
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        padding: '1rem 0',
      }}
    >
      {options.map((option) => {
        const isTrueOption =
          option.text.toLowerCase().includes('đúng') ||
          option.text.toLowerCase().includes('true') ||
          option.text === '对' ||
          option.text === '√';
        const isDisabled = option.disabled || readOnly;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.selected}
            disabled={isDisabled}
            onClick={() => onChoose(option.id)}
            style={{
              flex: 1,
              maxWidth: '220px',
              minHeight: '56px',
              borderRadius: 'var(--hsk-radius-xl)',
              border: '2px solid',
              borderColor: option.selected
                ? isTrueOption
                  ? 'var(--hsk-color-success)'
                  : '#ef4444'
                : 'var(--hsk-color-border-subtle)',
              backgroundColor: option.selected
                ? isTrueOption
                  ? '#f0fdf4'
                  : '#fef2f2'
                : 'var(--hsk-color-surface)',
              color: option.selected
                ? isTrueOption
                  ? 'var(--hsk-color-success)'
                  : '#ef4444'
                : 'var(--hsk-color-text-main)',
              fontSize: '1.1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--hsk-transition-fast)',
              boxShadow: option.selected ? 'var(--hsk-shadow-sm)' : 'none',
            }}
          >
            <span>{isTrueOption ? '✓' : '✕'}</span>
            <span>{option.text || (isTrueOption ? 'Đúng' : 'Sai')}</span>
          </button>
        );
      })}
    </div>
  );
};
