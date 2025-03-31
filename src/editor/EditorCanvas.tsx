// src/editor/EditorCanvas.tsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { builder } from '../core/Builder';
import { ComponentRenderer } from './ComponentRenderer';

export const EditorCanvas: React.FC<{
  rootComponent: Component;
  onSelectComponent: (component: Component) => void;
}> = ({ rootComponent, onSelectComponent }) => {
  return (
    <div className="editor-canvas">
      <ComponentRenderer 
        component={rootComponent}
        onSelectComponent={onSelectComponent}
      />
    </div>
  );
};