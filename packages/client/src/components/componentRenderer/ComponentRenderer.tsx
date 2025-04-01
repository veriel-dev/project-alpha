import React, { useState } from 'react';
import { Component } from '@web-builder/shared/types/component';
import { getComponentByType } from './components/componentTypes';

export interface ComponentRendererProps {
  component: Component;
  onSelectComponent: (component: Component) => void;
  isSelected?: boolean;
  parentComponent?: Component;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  onSelectComponent,
  isSelected = false,
  parentComponent
}) => {
  const [hovered, setHovered] = useState(false);

  // Usar code splitting para renderizar el tipo de componente correcto
  const SpecificComponentType = getComponentByType(component.type);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="component-wrapper"
    >
      <SpecificComponentType
        component={component}
        isSelected={isSelected}
        onSelectComponent={onSelectComponent}
        parentComponent={parentComponent}
        isHovered={hovered || isSelected}
      />
    </div >
  );
};

export default ComponentRenderer;