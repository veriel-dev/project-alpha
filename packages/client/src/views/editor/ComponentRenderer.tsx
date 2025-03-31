import React, { CSSProperties } from 'react';
import { useDrop } from "react-dnd";
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/types/component';
export const ComponentRenderer: React.FC<{
  component: Component;
  onSelectComponent: (component: Component) => void;
}> = ({ component, onSelectComponent }) => {
  // Lógica para renderizar el componente basado en su tipo
  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }

    return component.children.map(child => (
      <ComponentRenderer
        key={child.id}
        component={child}
        onSelectComponent={onSelectComponent}
      />
    ));
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectComponent(component);
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'NEW_COMPONENT',
    drop: (item: { componentType: string }, monitor) => {
      // Si el monitor dice que el drop ocurrió aquí y no en un hijo
      if (monitor.didDrop()) {
        return;
      }

      // Crear una instancia del nuevo componente
      const config = builder.getAllRegisteredComponentTypes()
        .find(c => c.type === item.componentType);

      if (config && component.children) {
        const newComponent = builder.createComponent(item.componentType);
        if (newComponent) {
          component.children.push(newComponent);
          // Forzar actualización
          onSelectComponent(component);
        }
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  // Renderizado condicional basado en el tipo de componente
  switch (component.type) {
    case 'container':
      return (
        <div
          ref={drop as unknown as React.Ref<HTMLDivElement>}
          className={`editor-component editor-container ${isOver ? 'drop-target' : ''}`}
          onClick={handleClick}
          style={component.props.style as CSSProperties | undefined}
        >
          {renderChildren()}
          {component.children?.length === 0 && (
            <div className="empty-container-placeholder">
              Arrastra componentes aquí
            </div>
          )}
        </div>
      );
    case 'text':
      return (
        <div
          className="editor-component editor-text"
          onClick={handleClick}
        >
          {React.createElement(
            component.props.tag || 'p',
            { style: component.props.style },
            component.props.content
          )}
        </div>
      );
    case 'image':
      return (
        <div
          className="editor-component editor-image"
          onClick={handleClick}
        >
          <img
            src={component.props.src}
            alt={component.props.alt}
            style={component.props.style}
          />
        </div>
      );
    default:
      return <div>Componente desconocido: {component.type}</div>;
  }
};
