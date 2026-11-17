import React from 'react';
import { LevelItemViewModel } from '../../types/viewmodels';
import { Card } from '../../primitives/Card';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';
import { StatusChip } from '../../primitives/StatusChip';
import { AudioStatusIndicator } from '../../primitives/AudioStatusIndicator';

export interface LevelHubCardProps {
  level: LevelItemViewModel;
  onSelect: (levelId: string, levelCode: string) => void;
  className?: string;
}

export const LevelHubCard: React.FC<LevelHubCardProps> = ({
  level,
  onSelect,
  className = '',
}) => {
  return (
    <Card className={`v13-level-card ${className}`.trim()} as="article">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v13-space-3)' }}>
        {/* Top identity row */}
        <div className="v13-level-card-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="v13-level-title">{level.levelCode}</span>
              <Badge variant="brand">{level.categoryLabel}</Badge>
            </div>
            <h4 style={{ fontSize: 'var(--v13-text-sm)', color: 'var(--v13-text-secondary)', marginTop: '2px' }}>
              {level.title}
            </h4>
          </div>

          <StatusChip status={level.contentStatus} />
        </div>

        <p style={{ fontSize: 'var(--v13-text-sm)', color: 'var(--v13-text-secondary)', minHeight: '40px' }}>
          {level.description}
        </p>

        {/* Level Stats */}
        <div className="v13-level-stats-row">
          <span>📖 <strong>{level.vocabCount}</strong> từ vựng</span>
          <span>📐 <strong>{level.grammarPointsCount}</strong> ngữ pháp</span>
          {level.estimatedExamMinutes && (
            <span>⏱️ <strong>{level.estimatedExamMinutes}</strong> phút</span>
          )}
        </div>

        {/* Audio Availability Status (Faithfully rendered) */}
        <div>
          <AudioStatusIndicator 
            status={level.audioStatus} 
            customNote={level.audioNotice} 
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)' }}>
          {!level.isAvailableForPractice ? 'Nội dung chưa khả dụng' : level.isFullMockReady ? '✓ Bài luyện tổng hợp riêng' : '⚡ Luyện theo phần'}
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelect(level.id, level.levelCode)}
          disabled={!level.isAvailableForPractice}
        >
          Chọn cấp độ
        </Button>
      </div>
    </Card>
  );
};
