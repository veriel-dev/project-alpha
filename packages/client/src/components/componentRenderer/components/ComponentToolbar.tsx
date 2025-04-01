/* Barra de herramientas del componente */

import React, { memo } from 'react';
import { Component } from '@web-builder/shared/types/component';
import {
  deleteComponent,
  duplicateComponent,
  moveComponentUp,
  moveComponentDown
} from '../utils/componentOperations';

interface ComponentToolbarProps {
  component: Component;
  parentComponent?: Component;
  onSelectComponent: (component: Component) => void;
}

const ComponentToolbar: React.FC<ComponentToolbarProps> = memo(({
  component,
  parentComponent,
  onSelectComponent
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(component, parentComponent, onSelectComponent);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateComponent(component, parentComponent, onSelectComponent);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveComponentUp(component, parentComponent, onSelectComponent);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveComponentDown(component, parentComponent, onSelectComponent);
  };
  return (
    <div className="component-toolbar">
      <button
        className="component-tool-button duplicate"
        onClick={handleDuplicate}
        title="Duplicate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
        </svg>
      </button>

      <button
        className="component-tool-button up"
        onClick={handleMoveUp}
        title="Move up"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      <button
        className="component-tool-button down"
        onClick={handleMoveDown}
        title="Move down"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <button
        className="component-tool-button delete"
        onClick={handleDelete}
        title="Delete"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  )
});
export default ComponentToolbar;