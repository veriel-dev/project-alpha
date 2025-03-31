import React from 'react'

// Componente de Texto
export const TextComponent: React.FC<{
  id: string;
  content: string;
  style?: React.CSSProperties;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = (props) => {
  const Tag = props.tag || 'p';
  return React.createElement(
    Tag,
    {
      id: props.id,
      className: 'wb-text',
      style: props.style,
    },
    props.content
  );
};