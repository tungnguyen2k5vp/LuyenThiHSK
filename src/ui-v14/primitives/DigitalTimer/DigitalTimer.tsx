import React from 'react';

export interface DigitalTimerProps {
  remainingSeconds?: number | null;
  seconds?: number | null;
  variant?: 'normal' | 'warning' | 'compact';
  className?: string;
}

export const DigitalTimer: React.FC<DigitalTimerProps> = ({
  remainingSeconds,
  seconds,
  variant = 'normal',
  className = '',
}) => {
  const actualSeconds = remainingSeconds !== undefined ? remainingSeconds : (seconds === undefined ? null : seconds);
  if(actualSeconds===null)return <div className={`v14-digital-timer-box ${className}`} role="timer" aria-label="Không hiển thị thời gian đếm ngược">-- : --</div>;
  const isExpiringSoon = variant === 'warning' || (actualSeconds > 0 && actualSeconds <= 300); // < 5 mins
  const mins = Math.floor(Math.max(0, actualSeconds) / 60);
  const secs = Math.max(0, actualSeconds) % 60;

  const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;

  return (
    <div
      className={`v14-digital-timer-box ${className}`}
      role="timer"
      aria-label={`Thời gian còn lại: ${mins} phút ${secs} giây`}
      style={{
        borderColor: isExpiringSoon ? 'var(--v14-color-error-border)' : undefined,
        backgroundColor: isExpiringSoon ? 'var(--v14-color-error-light)' : undefined,
      }}
    >
      <span
        className="v14-timer-segment"
        style={{ color: isExpiringSoon ? 'var(--v14-color-error)' : undefined }}
      >
        {formattedMins}
      </span>
      <span className="v14-timer-separator">:</span>
      <span
        className="v14-timer-segment"
        style={{ color: isExpiringSoon ? 'var(--v14-color-error)' : undefined }}
      >
        {formattedSecs}
      </span>
    </div>
  );
};
