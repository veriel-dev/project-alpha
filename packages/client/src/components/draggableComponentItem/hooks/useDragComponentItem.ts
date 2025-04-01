import { ComponentConfig } from '@web-builder/shared/src/types/component';
import { useState } from 'react';
import { useDrag } from 'react-dnd';

// Custom hook para manejar la lógica de arrastrar componentes
export const useDragComponentItem = (componentType: ComponentConfig) => {
  const [isDraggingState, setIsDraggingState] = useState(false);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'NEW_COMPONENT',
    item: () => {
      setIsDraggingState(true);
      return { componentType: componentType.type };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      setIsDraggingState(false);
    }
  });
  const isItemDragging = isDragging || isDraggingState;

  return {
    dragRef,
    isItemDragging
  };
};