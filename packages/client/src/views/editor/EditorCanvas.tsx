import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ComponentRenderer } from './ComponentRenderer';
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/src/types/component';

export const EditorCanvas: React.FC<{
  rootComponent: Component;
  onSelectComponent: (component: Component) => void;
  selectedComponent?: Component | null;
}> = ({ rootComponent, onSelectComponent, selectedComponent }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas dimensions when window resizes
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };

    // Initial size calculation
    updateCanvasSize();

    // Listen for resize events
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Set up drop target for the canvas
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'NEW_COMPONENT',
    drop: (item: { componentType: string }, monitor) => {
      // Only handle drop if it's directly on the canvas, not on a child component
      if (monitor.didDrop()) {
        return;
      }

      // Create a new component of the dropped type
      const newComponent = builder.createComponent(item.componentType);

      if (newComponent && rootComponent.children) {
        // Add the new component to the root component's children
        rootComponent.children.push(newComponent);

        // Trigger update of the UI
        onSelectComponent(rootComponent);

        // Select the new component
        setTimeout(() => onSelectComponent(newComponent), 100);
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
        ref={(node) => {
          // Combine refs
          drop(node);
          if (canvasRef && 'current' in canvasRef) {
            canvasRef.current = node;
          }
        }}
        className={`editor-canvas empty ${isOver ? 'drop-target' : ''}`}
      >
        <div className="canvas-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>Drag components from the panel and drop here to start building your page</p>
        </div>
      </div>
    );
  }

  // Render the component tree
  return (
    <div
      className="editor-canvas"
      ref={(node) => {
        // Combine refs
        drop(node);
        if (canvasRef && 'current' in canvasRef) {
          canvasRef.current = node;
        }
      }}
    >
      <ComponentRenderer
        component={rootComponent}
        onSelectComponent={onSelectComponent}
        isSelected={selectedComponent?.id === rootComponent.id}
      />

      {/* Visual guide for when drop is active */}
      {isOver && canDrop && (
        <div className="drop-indicator">
          <div className="drop-indicator-text">
            Drop here to add to the page
          </div>
        </div>
      )}
    </div>
  );
};