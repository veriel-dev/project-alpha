import React, { CSSProperties } from "react"
import { ComponentTypeProps } from "."
import useComponentDrop from "../../hooks/useComponentDrop"
import ComponentToolbar from "../ComponentToolbar"

import { RenderComponentChildren } from "../RenderComponentChildren";




const ContainerComponent: React.FC<ComponentTypeProps> = (
  { component,
    isSelected,
    parentComponent,
    onSelectComponent,
    isHovered
  }
) => {
  // Configuración para drop zone
  const [{ isOver, canDrop }, drop] = useComponentDrop({
    component,
    onSelectComponent
  })
  // Determina si este container puede recibir drops
  const canDropHere = canDrop && isOver;
  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={`editor-component editor-container ${isSelected ? 'selected' : ''} ${canDropHere ? 'drop-target' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent(component);
      }}
      style={component.props.style as CSSProperties | undefined}
      onMouseEnter={() => {/* Manejado por el componente padre */ }}
      onMouseLeave={() => {/* Manejado por el componente padre */ }}
    >
      {isHovered && <ComponentToolbar
        component={component}
        parentComponent={parentComponent}
        onSelectComponent={onSelectComponent}
      />}

      <RenderComponentChildren
        component={component}
        onSelectComponent={onSelectComponent}
        isSelected={isSelected}
      />

      {(!component.children || component.children.length === 0) && (
        <div className="empty-container-placeholder">
          {canDrop ? 'Drop components here' : 'This container is empty'}
        </div>
      )}
    </div>
  );
}

export default React.memo(ContainerComponent);