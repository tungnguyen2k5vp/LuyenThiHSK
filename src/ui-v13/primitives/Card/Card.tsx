import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive';
  as?: 'div' | 'article' | 'section';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  const variantClass = variant === 'interactive' 
    ? 'v13-card-interactive' 
    : variant === 'subtle' 
    ? 'v13-card-subtle' 
    : '';

  return (
    <Component
      className={`v13-card ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};
