import React from "react"

export const ContainerComponent: React.FC<{
  id: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <div 
      id={props.id} 
      className={`wb-container ${props.className || ''}`} 
      style={props.style}
    >
      {props.children}
    </div>
  );
};