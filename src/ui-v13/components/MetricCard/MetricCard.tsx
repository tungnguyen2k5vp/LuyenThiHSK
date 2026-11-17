import React from 'react';
import { MetricItemViewModel } from '../../types/viewmodels';

export interface MetricCardProps {
  metric: MetricItemViewModel;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  className = '',
}) => {
  const isStreak = metric.key === 'streak' || metric.isAccent;

  return (
    <article
      className={`v13-metric-card ${isStreak ? 'v13-metric-streak' : ''} ${className}`.trim()}
    >
      <span className="v13-metric-label">{metric.label}</span>
      <div className="v13-metric-val">{metric.value}</div>
      <small style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)', marginTop: '2px' }}>
        {metric.caption}
      </small>
    </article>
  );
};
