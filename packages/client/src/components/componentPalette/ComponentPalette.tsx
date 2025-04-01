import React from 'react';
import { useComponentTypes } from './hooks/useComponentTypes';
import { ComponentCategory } from './ComponentCategory';

// Componente principal refactorizado
export const ComponentPalette: React.FC = () => {
  const { componentsByCategory, isEmpty } = useComponentTypes();

  return (
    <div className="component-palette-container">
      <h3>Componentes</h3>

      {!isEmpty ? (
        Object.entries(componentsByCategory).map(([category, components]) => (
          <ComponentCategory
            key={`palette-category-${category}-${components[0].type}`}
            category={category}
            components={components}
          />
        ))
      ) : (
        <div className="empty-components">
          <p>No hay componentes registrados</p>
        </div>
      )}
    </div>
  );
};