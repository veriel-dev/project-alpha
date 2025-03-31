import React from 'react';
import { useDrag } from "react-dnd";
import { builder } from "../core/Builder";

export const DraggableComponentItem: React.FC<{
  componentType: ReturnType<typeof builder.getAllRegisteredComponentTypes>[0];
}> = ({ componentType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'NEW_COMPONENT',
    item: { componentType: componentType.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="component-icon">{/* Icono */}</div>
      <div className="component-label">{componentType.label}</div>
    </div>
  );
};