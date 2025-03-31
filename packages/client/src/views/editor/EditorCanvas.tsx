// src/editor/EditorCanvas.tsx
import React from 'react';

import { ComponentRenderer } from './ComponentRenderer';
import { Component } from '@web-builder/shared/src/types/component';

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