import React, { CSSProperties } from 'react';
import { ComponentTypeProps } from './index';
import ComponentToolbar from '../ComponentToolbar';
import useComponentSelection from '../../hooks/useComponentSelection';

const ImageComponent: React.FC<ComponentTypeProps> = ({
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
      className={`editor-component editor-image ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {isHovered && <ComponentToolbar
        component={component}
        parentComponent={parentComponent}
        onSelectComponent={onSelectComponent}
      />}

      <img
        src={component.props.src as string}
        alt={component.props.alt as string}
        style={component.props.style as CSSProperties | undefined}
        loading="lazy" // Mejora de rendimiento: carga perezosa de imágenes
      />
    </div>
  );
};

export default React.memo(ImageComponent);