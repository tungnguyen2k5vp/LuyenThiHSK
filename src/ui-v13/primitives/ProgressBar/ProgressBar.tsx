import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  className = '',
  ...props
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`v13-progress-container ${className}`.trim()} {...props}>
      {(label || showPercent) && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: 'var(--v13-text-xs)', 
            marginBottom: '4px',
            color: 'var(--v13-text-secondary)'
          }}
        >
          {label && <span>{label}</span>}
          {showPercent && <span style={{ fontWeight: 'var(--v13-weight-bold)' }}>{percent}%</span>}
        </div>
      )}
      <div 
        className="v13-progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Tiến độ hoàn thành'}
      >
        <div 
          className="v13-progress-fill" 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
