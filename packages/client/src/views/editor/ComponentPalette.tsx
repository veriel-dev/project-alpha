import React from 'react';

import { DraggableComponentItem } from './DraggableComponentItem';
import { builder } from '../../core/builder/Builder';

export const ComponentPalette: React.FC = () => {
  const componentTypes = builder.getAllRegisteredComponentTypes();

  // Agrupar componentes por categoría
  const componentsByCategory = componentTypes.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, typeof componentTypes>);

  return (
    <div className="component-palette">
      <h2>Componentes</h2>

      {Object.entries(componentsByCategory).map(([category, components]) => (
        <div key={category} className="component-category">
          <h3>{category}</h3>
          <div className="component-list">
            {components.map(comp => (
              <DraggableComponentItem key={comp.type} componentType={comp} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};