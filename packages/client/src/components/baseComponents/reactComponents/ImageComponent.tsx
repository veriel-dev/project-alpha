import React from 'react'

export const ImageComponent: React.FC<{
  id: string;
  src: string;
  alt: string;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <img
      id={props.id}
      className="wb-image"
      src={props.src}
      alt={props.alt}
      style={props.style}
    />
  );
};