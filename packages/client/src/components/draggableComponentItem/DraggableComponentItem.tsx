import React from 'react';
import { getComponentIcon, ComponentIcons } from './icons';
import ComponentDescription from './ComponentDescription';
import { useDragComponentItem } from './hooks/useDragComponentItem';
import { ComponentConfig } from '@web-builder/shared/src/types/component';

// Componente principal optimizado
export const DraggableComponentItem = React.memo(({ componentType }: { componentType: ComponentConfig }) => {
  // Usamos el custom hook para manejar la lógica de arrastre
  const { dragRef, isItemDragging } = useDragComponentItem(componentType);

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      className={`component-item ${isItemDragging ? 'dragging' : ''}`}
      title={`Drag to add ${componentType.label}`}
    >
      <div className="component-icon">
        {getComponentIcon(componentType.icon as keyof typeof ComponentIcons)}
      </div>

      <div className="component-label">{componentType.label}</div>

      {/* Componente separado para la descripción */}
      <ComponentDescription description={componentType.description} />

      {/* Drag handle */}
      <div className="drag-handle">
        {ComponentIcons.dragHandle()}
      </div>
    </div>
  );
});