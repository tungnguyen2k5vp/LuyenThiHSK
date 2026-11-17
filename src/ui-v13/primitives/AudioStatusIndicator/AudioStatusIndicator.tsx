import React from 'react';
import { AudioAvailability } from '../../types/viewmodels';

export interface AudioStatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: AudioAvailability;
  customNote?: string;
  notice?: string;
}

export const AudioStatusIndicator: React.FC<AudioStatusIndicatorProps> = ({
  status,
  customNote,
  notice,
  className = '',
  ...props
}) => {
  const displayNote = notice || customNote;

  const getStatusData = () => {
    switch (status) {
      case 'AVAILABLE':
        return {
          cssClass: 'v13-audio-status-available',
          icon: '🎧',
          text: 'Audio có sẵn',
        };
      case 'UNAVAILABLE':
        return {
          cssClass: 'v13-audio-status-unavailable',
          icon: '🔇',
          text: 'Chưa có audio bài thi',
        };
      case 'RECORDING_DRAFT':
        return {
          cssClass: 'v13-audio-status-pending',
          icon: '🎙️',
          text: 'Đang hoàn thiện âm thanh',
        };
      case 'RIGHTS_PENDING':
        return {
          cssClass: 'v13-audio-status-pending',
          icon: '⚖️',
          text: 'Chờ cấp phép bản quyền',
        };
      case 'PREVIEW_ONLY':
        return {
          cssClass: 'v13-audio-status-pending',
          icon: '🔈',
          text: 'Nghe thử nghiệm (Preview)',
        };
      default:
        return {
          cssClass: 'v13-audio-status-unavailable',
          icon: '•',
          text: status,
        };
    }
  };

  const data = getStatusData();

  return (
    <div
      className={`v13-audio-status ${data.cssClass} ${className}`.trim()}
      role="status"
      {...props}
    >
      <span aria-hidden="true">{data.icon}</span>
      <span>{displayNote || data.text}</span>
    </div>
  );
};

