import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantClass = `v13-btn-${variant}`;
  const sizeClass = size === 'md' ? '' : `v13-btn-${size}`;

  const resolvedLeftIcon = leftIcon || (iconPosition === 'left' ? icon : null);
  const resolvedRightIcon = rightIcon || (iconPosition === 'right' ? icon : null);

  return (
    <button
      className={`v13-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span aria-hidden="true">⏳</span>
      ) : (
        resolvedLeftIcon && <span aria-hidden="true">{resolvedLeftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && resolvedRightIcon && (
        <span aria-hidden="true">{resolvedRightIcon}</span>
      )}
    </button>
  );
};

