import React from 'react';
import { OptionVM } from '../../../contracts/ui-v13';

export interface MatchingQuestionProps {
  matchingItems: readonly { id: string; text: string; selectedOptionId: string | null }[];
  options: readonly OptionVM[];
  onMatch: (itemId: string, optionId: string | null) => void;
  readOnly?: boolean;
  className?: string;
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  matchingItems,
  options,
  onMatch,
  readOnly = false,
  className = '',
}) => {
  return (
    <div className={`hsk-matching-container ${className}`}>
      {/* Pool of choices display */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '0.75rem',
          backgroundColor: 'var(--hsk-color-surface-soft)',
          borderRadius: 'var(--hsk-radius-lg)',
          marginBottom: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--hsk-color-text-secondary)', width: '100%' }}>
          Ngân hàng đáp án để nối:
        </span>
        {options.map((opt, i) => (
          <span
            key={opt.id}
            style={{
              fontSize: '0.85rem',
              padding: '2px 8px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--hsk-radius-md)',
              border: '1px solid var(--hsk-color-border-subtle)',
              fontFamily: 'var(--hsk-font-hanzi)',
            }}
          >
            <strong>{String.fromCharCode(65 + i)}.</strong> {opt.text}
          </span>
        ))}
      </div>

      {/* Rows to pair */}
      {matchingItems.map((item, idx) => (
        <div key={item.id} className="hsk-matching-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--hsk-color-primary)' }}>
              {idx + 1}.
            </span>
            <span style={{ fontFamily: 'var(--hsk-font-hanzi)', fontSize: '1rem', color: 'var(--hsk-color-text-main)' }}>
              {item.text}
            </span>
          </div>

          <div>
            <select
              className="hsk-matching-select"
              value={item.selectedOptionId || ''}
              disabled={readOnly}
              onChange={(e) => {
                const val = e.target.value;
                onMatch(item.id, val ? val : null);
              }}
              aria-label={`Chọn đáp án nối cho câu ${idx + 1}: ${item.text}`}
            >
              <option value="">-- Chọn đáp án --</option>
              {options.map((opt, optIdx) => (
                <option key={opt.id} value={opt.id}>
                  {String.fromCharCode(65 + optIdx)}: {opt.text}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
