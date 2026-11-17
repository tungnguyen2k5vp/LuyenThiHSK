import React, { useState } from 'react';
import { EnhancedExplanationVM } from '../../types/viewmodels';
import { ExplanationAccordion } from './ExplanationAccordion';
import { Button } from '../../primitives/Button/Button';

export interface WritingWordVM {
  id: string;
  hanzi: string;
  pinyin?: string;
}

export interface WritingWorkspaceVM {
  id: string;
  questionNumber: number;
  partTitle: string;
  instruction: string;
  type: 'reorder' | 'essay';
  availableWords?: WritingWordVM[];
  selectedWordIds?: string[];
  essayPrompt?: string;
  userText?: string;
  minWordCount?: number;
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

export interface WritingWorkspaceProps {
  data: WritingWorkspaceVM;
  onUpdateReorder?: (wordIds: string[]) => void;
  onUpdateText?: (text: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export const WritingWorkspaceV14: React.FC<WritingWorkspaceProps> = ({
  data,
  onUpdateReorder,
  onUpdateText,
  onPrevious,
  onNext,
  className = '',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(data.selectedWordIds || []);
  const [textVal, setTextVal] = useState<string>(data.userText || '');

  const handleToggleWord = (wordId: string) => {
    if (data.isReadOnly) return;
    let next: string[];
    if (selectedIds.includes(wordId)) {
      next = selectedIds.filter((id) => id !== wordId);
    } else {
      next = [...selectedIds, wordId];
    }
    setSelectedIds(next);
    onUpdateReorder?.(next);
  };

  const handleResetWords = () => {
    if (data.isReadOnly) return;
    setSelectedIds([]);
    onUpdateReorder?.([]);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.isReadOnly) return;
    setTextVal(e.target.value);
    onUpdateText?.(e.target.value);
  };

  return (
    <div className={`v14-question-item ${className}`}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--v14-space-3)' }}>
        <div className="v14-q-header-part">{data.partTitle}</div>
        <div className="v14-q-header-sub">
          Câu {data.questionNumber}: {data.instruction}
        </div>
      </div>

      {data.type === 'reorder' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-4)' }}>
          {/* Answer Construction Area */}
          <div
            style={{
              minHeight: '80px',
              padding: 'var(--v14-space-4)',
              borderRadius: 'var(--v14-radius-xl)',
              backgroundColor: '#f8fafc',
              border: '2px dashed var(--v14-color-primary-border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {selectedIds.length === 0 ? (
              <span style={{ color: 'var(--v14-color-text-muted)', fontSize: 'var(--v14-text-sm)' }}>
                Nhấn vào các từ bên dưới theo thứ tự để sắp xếp thành câu hoàn chỉnh...
              </span>
            ) : (
              selectedIds.map((id) => {
                const word = data.availableWords?.find((w) => w.id === id);
                if (!word) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={data.isReadOnly}
                    onClick={() => handleToggleWord(id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--v14-radius-lg)',
                      backgroundColor: 'var(--v14-color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: 'var(--v14-font-hanzi)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {word.hanzi} ✕
                  </button>
                );
              })
            )}
          </div>

          {/* Reset button */}
          {selectedIds.length > 0 && !data.isReadOnly && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={handleResetWords}>
                Làm lại câu
              </Button>
            </div>
          )}

          {/* Available Word Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {data.availableWords?.map((w) => {
              const isUsed = selectedIds.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  disabled={data.isReadOnly || isUsed}
                  onClick={() => handleToggleWord(w.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--v14-radius-lg)',
                    backgroundColor: isUsed ? '#e2e8f0' : 'var(--v14-color-surface)',
                    color: isUsed ? '#94a3b8' : 'var(--v14-color-text-main)',
                    border: `1.5px solid ${isUsed ? '#cbd5e1' : 'var(--v14-color-border)'}`,
                    fontFamily: 'var(--v14-font-hanzi)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: isUsed ? 'not-allowed' : 'pointer',
                    transition: 'all var(--v14-transition-fast)',
                  }}
                >
                  {w.hanzi}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Essay Writing Mode */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v14-space-3)' }}>
          {data.essayPrompt && (
            <div
              style={{
                padding: 'var(--v14-space-4)',
                borderRadius: 'var(--v14-radius-lg)',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--v14-color-border)',
                fontSize: 'var(--v14-text-sm)',
                lineHeight: 1.6,
              }}
            >
              {data.essayPrompt}
            </div>
          )}

          <textarea
            rows={8}
            disabled={data.isReadOnly}
            value={textVal}
            onChange={handleTextChange}
            placeholder="Nhập bài viết bằng chữ Hán tại đây..."
            style={{
              width: '100%',
              padding: 'var(--v14-space-4)',
              borderRadius: 'var(--v14-radius-xl)',
              border: '1.5px solid var(--v14-color-border)',
              fontFamily: 'var(--v14-font-hanzi)',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              outline: 'none',
              resize: 'vertical',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--v14-text-xs)',
              color: 'var(--v14-color-text-secondary)',
            }}
          >
            <span>Yêu cầu tối thiểu: {data.minWordCount || 80} chữ</span>
            <span>Đã viết: {textVal.trim().length} chữ</span>
          </div>
        </div>
      )}

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
