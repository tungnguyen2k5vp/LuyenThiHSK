import React from 'react';
import { OptionVM } from '../../../contracts/ui-v13';
import { Button } from '../../primitives/Button';

export interface ImageChoiceProps {
  options: readonly OptionVM[];
  onChoose: (optionId: string) => void;
  onRetryImage?: (imageId: string) => void;
  readOnly?: boolean;
  className?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const ImageChoice: React.FC<ImageChoiceProps> = ({
  options,
  onChoose,
  onRetryImage,
  readOnly = false,
  className = '',
}) => {
  return (
    <div
      className={`hsk-image-options-grid ${className}`}
      role="radiogroup"
      aria-label="Chọn hình ảnh tương ứng"
    >
      {options.map((option, idx) => {
        const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
        const isDisabled = option.disabled || readOnly;
        const img = option.image;

        return (
          <div
            key={option.id}
            role="radio"
            tabIndex={isDisabled ? -1 : 0}
            aria-checked={option.selected}
            aria-disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                onChoose(option.id);
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                e.preventDefault();
                onChoose(option.id);
              }
            }}
            className={`hsk-image-option-card ${option.selected ? 'is-selected' : ''} ${
              isDisabled ? 'is-disabled' : ''
            }`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
              <span className="hsk-option-letter">{letter}</span>
              {option.selected && (
                <span style={{ color: 'var(--hsk-color-primary)', fontWeight: 700 }}>✓ Đã chọn</span>
              )}
            </div>

            {/* Image Preview Box */}
            <div
              style={{
                width: '100%',
                height: '140px',
                borderRadius: 'var(--hsk-radius-lg)',
                backgroundColor: 'var(--hsk-color-surface-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {img?.state === 'available' && img.displayUrl ? (
                <img
                  src={img.displayUrl}
                  alt={img.alt || `Hình ảnh lựa chọn ${letter}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : img?.state === 'loading' ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-muted)' }}>
                  ⏳ Đang tải ảnh...
                </span>
              ) : img?.state === 'error' ? (
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--hsk-color-text-muted)', display: 'block' }}>
                    Không thể tải ảnh
                  </span>
                  {onRetryImage && img.retryable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetryImage(img.id);
                      }}
                      style={{ marginTop: '4px' }}
                    >
                      Thử lại
                    </Button>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '1.75rem' }}>🖼️</span>
              )}
            </div>

            {option.text && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  color: 'var(--hsk-color-text-main)',
                }}
              >
                {option.text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
