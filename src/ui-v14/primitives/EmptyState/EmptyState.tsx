import React from 'react';
import { Button } from '../Button/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = '📭',
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--v14-color-surface)',
        borderRadius: 'var(--v14-radius-2xl)',
        border: '1px solid var(--v14-color-border)',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }} role="img" aria-hidden="true">
        {icon}
      </span>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--v14-color-text-main)', margin: '0 0 0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--v14-color-text-secondary)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
