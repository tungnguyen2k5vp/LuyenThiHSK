import React from 'react';
import { LevelHubViewModel } from '../types/viewmodels';
import { LevelHubCallbacks } from '../types/callbacks';
import { LevelHubCard } from '../components/LevelHubCard';
import { Button } from '../primitives/Button';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/views.css';

export interface LevelHubViewProps {
  model: LevelHubViewModel;
  callbacks: LevelHubCallbacks;
  className?: string;
  allowedEditions?: readonly ('hsk2'|'hsk3')[];
}

export const LevelHubView: React.FC<LevelHubViewProps> = ({
  model,
  callbacks,
  className = '',
  allowedEditions = ['hsk2','hsk3'],
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`.trim()}>
      <div className="v13-levelhub-container">
        {/* Header */}
        <header className="page-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="text-eyebrow">HỆ THỐNG CẤP ĐỘ KHẢO THÍ</span>
              <h1>Trung tâm các cấp độ HSK</h1>
              <p>
                Chọn cấp độ mục tiêu để mở kho đề luyện, danh mục ngữ pháp và từ vựng tương ứng.
              </p>
            </div>

            {/* Edition Switcher */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--v13-neutral-200)', padding: '4px', borderRadius: 'var(--v13-radius-full)' }}>
              <Button
                variant={model.activeEdition === 'hsk2' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => callbacks.onSwitchEdition('hsk2')}
                disabled={!allowedEditions.includes('hsk2')}
                style={{ borderRadius: 'var(--v13-radius-full)' }}
              >
                HSK 2.0 (Khung 6 cấp)
              </Button>
              <Button
                variant={model.activeEdition === 'hsk3' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => callbacks.onSwitchEdition('hsk3')}
                disabled={!allowedEditions.includes('hsk3')}
                style={{ borderRadius: 'var(--v13-radius-full)' }}
              >
                HSK 3.0 (Chuẩn 9 bậc)
              </Button>
            </div>
          </div>
        </header>

        {/* Notice Banner */}
        {model.noticeBanner && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--v13-radius-md)',
              backgroundColor: 'var(--v13-teal-50)',
              border: '1px solid var(--v13-teal-200)',
              fontSize: 'var(--v13-text-sm)',
              color: 'var(--v13-teal-800)',
            }}
          >
            📌 {model.noticeBanner}
          </div>
        )}

        {/* Grid of Level Cards */}
        <div className="v13-levels-grid">
          {model.levels.map((level) => (
            <LevelHubCard
              key={level.id}
              level={level}
              onSelect={callbacks.onSelectLevel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
