import React from 'react';

const ltrContentStyle: React.CSSProperties = {
  direction: 'ltr',
  textAlign: 'left',
  unicodeBidi: 'plaintext',
};

export const ltrContentProps = {
  dir: 'ltr' as const,
  'data-no-auto-translate': true,
};

export const LtrInlineText: React.FC<{
  as?: 'span' | 'a' | 'bdi';
  children: React.ReactNode;
  className?: string;
  href?: string;
  rel?: string;
  style?: React.CSSProperties;
  target?: string;
}> = ({ as = 'span', children, className, href, rel, style, target }) => {
  const Component = as;

  return (
    <Component
      {...ltrContentProps}
      className={className}
      href={href}
      rel={rel}
      style={{ ...ltrContentStyle, ...style }}
      target={target}
    >
      {children}
    </Component>
  );
};
