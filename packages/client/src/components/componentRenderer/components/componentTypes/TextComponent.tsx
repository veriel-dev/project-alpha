import React from 'react';
import { ComponentTypeProps } from './index';
import ComponentToolbar from '../ComponentToolbar';
import useComponentSelection from '../../hooks/useComponentSelection';

const TextComponent: React.FC<ComponentTypeProps> = ({
  component,
  isSelected,
  onSelectComponent,
  parentComponent,
  isHovered
}) => {
  const { componentRef, handleClick } = useComponentSelection({
    component,
    onSelectComponent,
    isSelected
  });

  return (
    <div
      ref={componentRef}
      className={`editor-component editor-text ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {isHovered && <ComponentToolbar
        component={component}
        parentComponent={parentComponent}
        onSelectComponent={onSelectComponent}
      />}

      {React.createElement(
        component.props.tag as string || 'p',
        { style: component.props.style },
        component.props.content as React.ReactNode
      )}
    </div>
  );
};

export default React.memo(TextComponent);