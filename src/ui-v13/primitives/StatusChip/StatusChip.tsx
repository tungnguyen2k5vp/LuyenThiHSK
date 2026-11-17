import React from 'react';
import { ContentStatus } from '../../types/viewmodels';

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ContentStatus;
  customLabel?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  customLabel,
  className = '',
  ...props
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PREVIEW':
        return {
          chipClass: 'v13-status-chip-preview',
          defaultLabel: 'Bản xem trước (Preview)',
          iconText: '🔍',
        };
      case 'NEEDS_REVIEW':
        return {
          chipClass: 'v13-status-chip-needs-review',
          defaultLabel: 'Chờ duyệt học thuật',
          iconText: '⏳',
        };
      case 'DRAFT':
        return {
          chipClass: 'v13-status-chip-draft',
          defaultLabel: 'Bản nháp',
          iconText: '📝',
        };
      case 'UNPUBLISHED':
        return {
          chipClass: 'v13-status-chip-draft',
          defaultLabel: 'Chưa phát hành chính thức',
          iconText: '🔒',
        };
      case 'HUMAN_REVIEWED':
      case 'PUBLISHED':
        return {
          chipClass: 'v13-status-chip-verified',
          defaultLabel: 'Đã duyệt chuyên môn',
          iconText: '✓',
        };
      default:
        return {
          chipClass: 'v13-status-chip-draft',
          defaultLabel: status,
          iconText: '•',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`v13-status-chip ${config.chipClass} ${className}`.trim()}
      title={`Trạng thái kiểm duyệt: ${config.defaultLabel}`}
      {...props}
    >
      <span aria-hidden="true">{config.iconText}</span>
      <span>{customLabel || config.defaultLabel}</span>
    </span>
  );
};
