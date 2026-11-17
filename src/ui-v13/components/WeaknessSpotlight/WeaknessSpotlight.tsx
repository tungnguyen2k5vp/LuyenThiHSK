import React from 'react';
import { WeaknessItemViewModel } from '../../types/viewmodels';
import { Card } from '../../primitives/Card';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';

export interface WeaknessSpotlightProps {
  weaknesses: WeaknessItemViewModel[];
  onReviewWeakness: () => void;
  className?: string;
}

export const WeaknessSpotlight: React.FC<WeaknessSpotlightProps> = ({
  weaknesses,
  onReviewWeakness,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--v13-space-3)' }}>
        <h3>Điểm cần chú ý & Điểm yếu</h3>
        {weaknesses.length > 0 && (
          <Badge variant="amber">
            {weaknesses.length} nhóm cần củng cố
          </Badge>
        )}
      </div>

      {weaknesses.length === 0 ? (
        <p style={{ fontSize: 'var(--v13-text-sm)', color: 'var(--v13-text-secondary)', marginBottom: 'var(--v13-space-4)' }}>
          Chưa đủ bằng chứng để xác định nhóm cần củng cố. Hãy làm thêm bài luyện để hệ thống phân tích.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v13-space-3)', marginBottom: 'var(--v13-space-4)' }}>
          {weaknesses.slice(0, 3).map((w) => (
            <div 
              key={w.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: 'var(--v13-space-3)',
                background: 'var(--v13-bg-surface-subtle)',
                borderRadius: 'var(--v13-radius-md)',
                fontSize: 'var(--v13-text-sm)',
              }}
            >
              <div>
                <strong style={{ color: 'var(--v13-text-primary)' }}>
                  {w.skillLabel}
                </strong>
                <span style={{ color: 'var(--v13-text-tertiary)', margin: '0 6px' }}>•</span>
                <span style={{ color: 'var(--v13-rose-700)', fontWeight: 'var(--v13-weight-semibold)' }}>
                  {w.wrongCount === null ? 'Theo lượt luyện gần đây' : `Sai ${w.wrongCount} lần`}
                </span>
                <p style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)', marginTop: '2px' }}>
                  {w.reason}
                </p>
              </div>
              <span style={{ fontSize: 'var(--v13-text-xs)', fontWeight: 'var(--v13-weight-bold)', color: 'var(--v13-text-brand)' }}>
                {w.masteryPercent === null ? 'Chưa đánh giá mastery' : `${w.masteryPercent}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={onReviewWeakness}
        style={{ width: '100%' }}
      >
        {weaknesses.length > 0 ? 'Mở bài ôn điểm yếu' : 'Mở kho bài luyện tập'}
      </Button>
    </Card>
  );
};
