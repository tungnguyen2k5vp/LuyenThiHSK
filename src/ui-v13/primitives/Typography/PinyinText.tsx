import React from 'react';

export interface PinyinTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  pinyin: string;
}

export const PinyinText: React.FC<PinyinTextProps> = ({
  pinyin,
  className = '',
  style,
  ...props
}) => {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--v13-font-sans)',
        fontSize: 'var(--v13-text-sm)',
        fontStyle: 'italic',
        color: 'var(--v13-text-secondary)',
        letterSpacing: '0.01em',
        ...style,
      }}
      {...props}
    >
      {pinyin}
    </span>
  );
};
