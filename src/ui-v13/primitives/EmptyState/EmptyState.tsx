import React from 'react';
import { Button } from '../Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`v13-empty-state ${className}`.trim()}>
      <div className="v13-empty-icon" aria-hidden="true">
        {icon || '📭'}
      </div>
      <h3 style={{ fontSize: 'var(--v13-text-base)', marginBottom: 'var(--v13-space-2)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--v13-text-sm)', maxWidth: '420px', marginBottom: actionLabel ? 'var(--v13-space-4)' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
