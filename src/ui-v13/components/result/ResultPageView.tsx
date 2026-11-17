import React from 'react';
import { ResultVM, ActionVM } from '../../../contracts/ui-v13';
import { ResultSummaryCard } from './ResultSummaryCard';
import { ResultSkillBreakdown } from './ResultSkillBreakdown';
import { ResultQuestionReview } from './ResultQuestionReview';
import { Button } from '../../primitives/Button';

export interface ResultPageViewProps {
  model: ResultVM;
  onExecuteAction?: (action: ActionVM) => void;
  onBackToToday?: () => void;
  onBackToLevelHub?: () => void;
  className?: string;
}

export const ResultPageView: React.FC<ResultPageViewProps> = ({
  model,
  onExecuteAction,
  onBackToToday,
  onBackToLevelHub,
  className = '',
}) => {
  const incorrectCount = model.counts.incorrect;

  return (
    <div className={`hsk-result-container ${className}`}>
      {/* 1. KẾT QUẢ CHÍNH */}
      <ResultSummaryCard model={model} />

      {/* 2. ĐIỂM YẾU & CẢNH BÁO BẢN QUYỀN / TÍNH CHÍNH THỨC */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--hsk-color-surface-soft)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hsk-color-text-main)' }}>
            🎯 Điểm yếu cần chú ý
          </span>
          <span style={{ fontSize: '0.8rem', color: incorrectCount > 0 ? '#ef4444' : 'var(--hsk-color-success)', fontWeight: 600 }}>
            {incorrectCount > 0 ? `${incorrectCount} câu cần khắc phục` : 'Không có câu làm sai!'}
          </span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
          {model.officialReadiness.reason}
        </p>
      </div>

      {/* 3. PHÂN TÍCH THEO KỸ NĂNG */}
      <ResultSkillBreakdown sections={model.sections} />

      {/* 4. GIẢI THÍCH CHI TIẾT */}
      <ResultQuestionReview items={model.items} />

      {/* 5. NÊN LUYỆN GÌ TIẾP (NEXT LEARNING ACTIONS) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: '1.25rem',
          backgroundColor: 'var(--hsk-color-surface)',
          borderRadius: 'var(--hsk-radius-2xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
        }}
      >
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
          🚀 Bước Tiếp Theo Dành Cho Bạn
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
          Củng cố kiến thức bằng cách xem lại các từ vựng và ngữ pháp vừa xuất hiện trong đề thi.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
          {onBackToToday && (
            <Button variant="primary" size="md" onClick={onBackToToday} leftIcon={<span>🏠</span>}>
              Quay lại Bàn học hôm nay
            </Button>
          )}

          {onBackToLevelHub && (
            <Button variant="outline" size="md" onClick={onBackToLevelHub} leftIcon={<span>📚</span>}>
              Khám phá cấp độ khác
            </Button>
          )}

          {model.actions.map((act) => (
            <Button
              key={act.id}
              variant="outline"
              size="md"
              disabled={!act.availability.available}
              onClick={() => onExecuteAction && onExecuteAction(act)}
            >
              {act.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
