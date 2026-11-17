import React from 'react';
import { GrammarExampleViewModel } from '../../types/viewmodels';

export interface GrammarExampleBlockProps {
  example: GrammarExampleViewModel;
  index?: number;
  className?: string;
}

export const GrammarExampleBlock: React.FC<GrammarExampleBlockProps> = ({
  example,
  index,
  className = '',
}) => {
  return (
    <div className={`hsk-grammar-example-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        {typeof index === 'number' && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--hsk-color-primary)',
              minWidth: '1.25rem',
              paddingTop: '2px',
            }}
          >
            {index + 1}.
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--hsk-font-hanzi)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--hsk-color-text-main)',
              lineHeight: 1.4,
            }}
          >
            {example.chinese}
          </div>
          <div
            style={{
              fontFamily: 'var(--hsk-font-pinyin)',
              fontSize: '0.875rem',
              color: 'var(--hsk-color-primary)',
            }}
          >
            {example.pinyin}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--hsk-color-text-secondary)',
              marginTop: '2px',
            }}
          >
            {example.vietnamese}
          </div>
          {example.note && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--hsk-color-amber-dark)',
                backgroundColor: 'var(--hsk-color-amber-light)',
                padding: '2px 8px',
                borderRadius: '4px',
                marginTop: '4px',
                width: 'fit-content',
              }}
            >
              💡 {example.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
