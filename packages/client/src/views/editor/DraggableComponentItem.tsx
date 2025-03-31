import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ComponentConfig } from '@web-builder/shared/src/types/component';

export const DraggableComponentItem: React.FC<{
  componentType: ComponentConfig;
}> = ({ componentType }) => {
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Set up drag behavior with the correct API usage
  const [{ isDragging }, drag] = useDrag({
    type: 'NEW_COMPONENT',
    item: () => {
      // Set dragging state when drag starts
      setIsDraggingState(true);
      return { componentType: componentType.type };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      // Clean up dragging state when drag ends
      setIsDraggingState(false);
    }
  });

  // Use the dragging state from both useDrag hook and our own state
  // This helps ensure we see proper UI feedback even if the drag event
  // isn't cleaned up properly (which can happen in some edge cases)
  const isItemDragging = isDragging || isDraggingState;

  // Map the icon name to an SVG icon
  const renderIcon = () => {
    switch (componentType.icon) {
      case 'box':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        );
      case 'type':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case 'layout':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        );
      case 'button':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          </svg>
        );
    }
  };

  return (
    <div
      ref={(instance) => { if (instance) drag(instance); }}
      className={`component-item ${isItemDragging ? 'dragging' : ''}`}
      title={`Drag to add ${componentType.label}`}
    >
      <div className="component-icon">
        {renderIcon()}
      </div>
      <div className="component-label">{componentType.label}</div>

      {/* Optional description or usage hint */}
      {componentType.description && (
        <div className="component-description">
          {componentType.description}
        </div>
      )}

      {/* Show a drag handle to make it more obvious that items are draggable */}
      <div className="drag-handle">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="1"></circle>
          <circle cx="8" cy="16" r="1"></circle>
          <circle cx="16" cy="8" r="1"></circle>
          <circle cx="16" cy="16" r="1"></circle>
        </svg>
      </div>
    </div>
  );
};