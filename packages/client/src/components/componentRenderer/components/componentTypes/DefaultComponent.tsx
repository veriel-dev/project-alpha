import React from 'react';
import { ComponentTypeProps } from './index';
import useComponentSelection from '../../hooks/useComponentSelection';

const DefaultComponent: React.FC<ComponentTypeProps> = ({
  component,
  isSelected,
  onSelectComponent
}) => {
  const { componentRef, handleClick } = useComponentSelection({
    component,
    onSelectComponent,
    isSelected
  });

  return (
    <div
      ref={componentRef}
      className={`editor-component editor-unknown ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      Unknown component type: {component.type}
    </div>
  );
};

export default React.memo(DefaultComponent);