import React, { useState, useId } from 'react';
import { EnhancedExplanationVM } from '../../types/viewmodels';

export interface ExplanationAccordionProps {
  explanation: EnhancedExplanationVM;
  defaultOpen?: boolean;
  className?: string;
}

type TabType = 'solution' | 'transcript' | 'translation' | 'vocab';

export const ExplanationAccordion: React.FC<ExplanationAccordionProps> = ({
  explanation,
  defaultOpen = true,
  className = '',
}) => {
  const panelId=useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<TabType>('solution');

  return (
    <div className={`v14-explanation-accordion ${className}`} aria-label="Giải thích đáp án chi tiết">
      {/* Header bar toggle */}
      <div
        className="v14-explanation-header"
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem', color: 'var(--v14-color-primary)' }}>💡</span>
          <span style={{ fontWeight: 700 }}>Giải thích đáp án</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--v14-color-primary)' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {isOpen && (
        <div>
          {/* 4 Tabs Bar (Migii style: Giải thích, Phụ đề, Dịch phụ đề, Từ vựng) */}
          <div className="v14-explanation-tabs-bar" role="tablist" aria-label="Explanation tabs" onKeyDown={e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;const tabs=[...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')],index=tabs.indexOf(document.activeElement as HTMLButtonElement),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;e.preventDefault();tabs[next]?.click();tabs[next]?.focus();}}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'solution'} aria-controls={panelId} tabIndex={activeTab==='solution'?0:-1}
              className={`v14-exp-tab-btn ${activeTab === 'solution' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('solution')}
            >
              Giải thích
            </button>

            {explanation.transcriptZh && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'transcript'} aria-controls={panelId} tabIndex={activeTab==='transcript'?0:-1}
                className={`v14-exp-tab-btn ${activeTab === 'transcript' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('transcript')}
              >
                Phụ đề
              </button>
            )}

            {explanation.transcriptVi && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'translation'} aria-controls={panelId} tabIndex={activeTab==='translation'?0:-1}
                className={`v14-exp-tab-btn ${activeTab === 'translation' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('translation')}
              >
                Dịch phụ đề
              </button>
            )}

            {explanation.keywords && explanation.keywords.length > 0 && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'vocab'} aria-controls={panelId} tabIndex={activeTab==='vocab'?0:-1}
                className={`v14-exp-tab-btn ${activeTab === 'vocab' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('vocab')}
              >
                Từ vựng
              </button>
            )}
          </div>

          <div id={panelId} role="tabpanel" tabIndex={0}>
          {/* Tab 1: Giải thích & Đáp án đúng */}
          {activeTab === 'solution' && (
            <div className="v14-exp-tab-content">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: 'var(--v14-space-3)',
                  padding: 'var(--v14-space-2) var(--v14-space-3)',
                  backgroundColor: 'var(--v14-color-primary-light)',
                  borderRadius: 'var(--v14-radius-md)',
                  color: 'var(--v14-color-primary-active)',
                  fontWeight: 700,
                  fontSize: 'var(--v14-text-sm)',
                }}
              >
                <span>{explanation.answerLabel??'Đáp án tham khảo:'}</span>
                <span style={{ color: 'var(--v14-color-primary)' }}>
                  {explanation.correctOptionId ? `[ ${explanation.correctOptionId} ] - ` : ''}
                  {explanation.correctSolutionText}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--v14-color-text-main)' }}>
                {explanation.explanationText}
              </p>
            </div>
          )}

          {/* Tab 2: Phụ đề (Pinyin + Hanzi) */}
          {activeTab === 'transcript' && (
            <div className="v14-exp-tab-content">
              {explanation.transcriptPinyin && (
                <div
                  style={{
                    fontFamily: 'var(--v14-font-pinyin)',
                    fontSize: 'var(--v14-text-sm)',
                    color: 'var(--v14-color-text-secondary)',
                    marginBottom: '6px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {explanation.transcriptPinyin}
                </div>
              )}
              {explanation.transcriptZh && (
                <div
                  style={{
                    fontFamily: 'var(--v14-font-hanzi)',
                    fontSize: '1.2rem',
                    lineHeight: 1.8,
                    color: 'var(--v14-color-text-main)',
                  }}
                >
                  {explanation.transcriptZh}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Dịch phụ đề (Tiếng Việt) */}
          {activeTab === 'translation' && (
            <div className="v14-exp-tab-content">
              <p style={{ margin: 0, color: 'var(--v14-color-text-main)', fontStyle: 'italic' }}>
                {explanation.transcriptVi}
              </p>
            </div>
          )}

          {/* Tab 4: Từ vựng mở rộng */}
          {activeTab === 'vocab' && (
            <div className="v14-exp-tab-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {explanation.keywords?.map((kw, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '12px',
                      padding: '6px 0',
                      borderBottom: '1px dashed var(--v14-color-border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--v14-font-hanzi)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--v14-color-primary-active)',
                      }}
                    >
                      {kw.word}
                    </span>
                    {kw.pinyin && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--v14-color-text-muted)' }}>
                        [{kw.pinyin}]
                      </span>
                    )}
                    <span style={{ fontSize: '0.9rem', color: 'var(--v14-color-text-main)' }}>
                      : {kw.meaning}
                    </span>
                    {kw.grammarNote && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: 'var(--v14-color-text-secondary)',
                        }}
                      >
                        {kw.grammarNote}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};
