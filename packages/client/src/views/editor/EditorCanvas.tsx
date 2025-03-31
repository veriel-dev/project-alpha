import React from 'react';
import { useDrop } from 'react-dnd';
import { ComponentRenderer } from './ComponentRenderer';
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/src/types/component';

export const EditorCanvas: React.FC<{
  rootComponent: Component;
  onSelectComponent: (component: Component) => void;
}> = ({ rootComponent, onSelectComponent }) => {
  // Set up drop target for the canvas
  const [{ isOver }, drop] = useDrop({
    accept: 'NEW_COMPONENT',
    drop: (item: { componentType: string }, monitor) => {
      // Only handle drop if it's directly on the canvas, not on a child component
      if (monitor.didDrop()) {
        return;
      }

      // Create and add a new component
      const newComponent = builder.createComponent(item.componentType);
      if (newComponent && rootComponent.children) {
        rootComponent.children.push(newComponent);
        // Trigger update
        onSelectComponent(rootComponent);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // If the canvas is empty, show a placeholder
  if (!rootComponent.children || rootComponent.children.length === 0) {
    return (
      <div
        ref={drop as unknown as React.Ref<HTMLDivElement>}
        className={`editor-canvas empty ${isOver ? 'drop-target' : ''}`}
      >
        <div className="canvas-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>Arrastra componentes aquí para comenzar a construir tu página</p>
        </div>
      </div>
    );
  }

  // Render the component tree
  return (
    <div className="editor-canvas" ref={drop as unknown as React.Ref<HTMLDivElement>}>
      <ComponentRenderer
        component={rootComponent}
        onSelectComponent={onSelectComponent}
      />
    </div>
  );
};