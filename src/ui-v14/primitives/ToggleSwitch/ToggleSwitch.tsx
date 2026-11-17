import React from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  tooltip,
  disabled = false,
  className = '',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`v14-toggle-wrap ${className}`}
      onClick={handleToggle}
      role="switch"
      aria-label={label}
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      <div className={`v14-toggle-track ${checked ? 'is-checked' : ''}`}>
        <div className="v14-toggle-thumb" />
      </div>

      {label && (
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--v14-color-text-main)' }}>
          {label}
        </span>
      )}

      {tooltip && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--v14-color-text-muted)',
            cursor: 'help',
          }}
          title={tooltip}
          aria-label={tooltip}
        >
          ℹ️
        </span>
      )}
    </div>
  );
};
