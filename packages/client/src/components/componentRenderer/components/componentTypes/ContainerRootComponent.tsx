import React, { CSSProperties } from 'react';
import { ComponentTypeProps } from './index';
import { RenderComponentChildren } from '../RenderComponentChildren';

// Este es un caso especial, un contenedor raíz que no tiene interacción de usuario
const ContainerRootComponent: React.FC<ComponentTypeProps> = ({
  component,
  isSelected,
  onSelectComponent
}) => {
  return (
    <div
      className="editor-component editor-container"
      style={component.props.style as CSSProperties | undefined}
    >
      <RenderComponentChildren
        component={component}
        onSelectComponent={onSelectComponent}
        isSelected={isSelected}
      />
    </div>
  );
};

export default React.memo(ContainerRootComponent);