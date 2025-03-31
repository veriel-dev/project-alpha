import React from 'react';
import { DraggableComponentItem } from './DraggableComponentItem';
import { builder } from '../../core/builder/Builder';

export const ComponentPalette: React.FC = () => {
  const componentTypes = builder.getAllRegisteredComponentTypes();

  // Group components by category
  const componentsByCategory = componentTypes.reduce((acc, comp) => {
    if (!acc[comp.category]) {
      acc[comp.category] = [];
    }
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, typeof componentTypes>);

  return (
    <div className="component-palette-container">
      <h3>Componentes</h3>

      {Object.entries(componentsByCategory).length > 0 ? (
        Object.entries(componentsByCategory).map(([category, components]) => (
          <div key={category} className="component-category">
            <h4>{category}</h4>
            <div className="component-list">
              {(components as typeof componentTypes).map(comp => (
                <DraggableComponentItem key={comp.type} componentType={comp} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-components">
          <p>No hay componentes registrados</p>
        </div>
      )}
    </div>
  );
};