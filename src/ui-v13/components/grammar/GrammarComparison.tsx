import React from 'react';
import { GrammarComparisonViewModel } from '../../types/viewmodels';

export interface GrammarComparisonProps {
  comparison: GrammarComparisonViewModel;
  className?: string;
}

export const GrammarComparison: React.FC<GrammarComparisonProps> = ({
  comparison,
  className = '',
}) => {
  return (
    <div className={`hsk-grammar-comparison-box ${className}`}>
      <div className="hsk-grammar-comparison-header">
        ⚖️ {comparison.title}
      </div>

      <div className="hsk-grammar-comparison-grid">
        <div className="hsk-grammar-comparison-col">
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsk-color-primary-dark)' }}>
            {comparison.itemA.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--hsk-font-hanzi), monospace',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: 'var(--hsk-color-surface-soft)',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            {comparison.itemA.structure}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-main)', lineHeight: 1.4 }}>
            {comparison.itemA.usage}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--hsk-color-text-secondary)',
              fontStyle: 'italic',
              marginTop: '4px',
            }}
          >
            Ví dụ: {comparison.itemA.example}
          </div>
        </div>

        <div className="hsk-grammar-comparison-col">
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsk-color-amber-dark)' }}>
            {comparison.itemB.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--hsk-font-hanzi), monospace',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: 'var(--hsk-color-surface-soft)',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            {comparison.itemB.structure}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-main)', lineHeight: 1.4 }}>
            {comparison.itemB.usage}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--hsk-color-text-secondary)',
              fontStyle: 'italic',
              marginTop: '4px',
            }}
          >
            Ví dụ: {comparison.itemB.example}
          </div>
        </div>
      </div>

      <div className="hsk-grammar-comparison-summary">
        <strong>💡 Điểm mấu chốt:</strong> {comparison.summary}
      </div>
    </div>
  );
};
