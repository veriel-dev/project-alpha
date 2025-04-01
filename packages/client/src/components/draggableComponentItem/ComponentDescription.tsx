import React from 'react';

// Componente para mostrar la descripción (renderizado condicional)
const ComponentDescription = ({ description }: { description?: string }) => {
  if (!description) return null;

  return (
    <div className="component-description">
      {description}
    </div>
  );
};

export default React.memo(ComponentDescription);