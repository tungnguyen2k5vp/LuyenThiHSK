import React from 'react';

export interface HanziTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  characters: string;
}

export const HanziText: React.FC<HanziTextProps> = ({
  characters,
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'var(--v13-hanzi-sm)';
      case 'md': return 'var(--v13-hanzi-md)';
      case 'lg': return 'var(--v13-hanzi-lg)';
      case 'xl': return 'var(--v13-hanzi-xl)';
    }
  };

  return (
    <span
      className={`font-chinese ${className}`.trim()}
      lang="zh-Hans"
      style={{
        fontSize: getFontSize(),
        fontWeight: 'var(--v13-weight-semibold)',
        lineHeight: 1.25,
        letterSpacing: '0.04em',
        color: 'var(--v13-text-primary)',
        ...style,
      }}
      {...props}
    >
      {characters}
    </span>
  );
};
