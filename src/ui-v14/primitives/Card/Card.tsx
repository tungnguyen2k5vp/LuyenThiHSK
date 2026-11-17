import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  as?: 'div' | 'article' | 'section';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  return (
    <Component
      className={`v14-card ${variant === 'interactive' ? 'v14-card-interactive' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};
