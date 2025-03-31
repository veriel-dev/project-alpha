import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import { useDrop } from "react-dnd";
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/types/component';

export const ComponentRenderer: React.FC<{
  component: Component;
  onSelectComponent: (component: Component) => void;
  isSelected?: boolean;
  parentComponent?: Component;
}> = ({ component, onSelectComponent, isSelected = false, parentComponent }) => {
  const [hovered, setHovered] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  // Handle component deletion
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!parentComponent || !parentComponent.children) return;

    // Find the index of the current component in the parent's children
    const index = parentComponent.children.findIndex(child => child.id === component.id);

    if (index !== -1) {
      // Remove the component from parent's children
      parentComponent.children.splice(index, 1);

      // Notify parent of changes
      onSelectComponent(parentComponent);
    }
  };

  // Handle component duplication
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!parentComponent || !parentComponent.children) return;

    // Create a deep copy of the component
    const duplicatedComponent = JSON.parse(JSON.stringify(component));
    // Generate a new ID for the duplicated component
    duplicatedComponent.id = 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Find the index of the current component in the parent's children
    const index = parentComponent.children.findIndex(child => child.id === component.id);

    if (index !== -1) {
      // Insert the duplicated component after the current one
      parentComponent.children.splice(index + 1, 0, duplicatedComponent);

      // Notify parent of changes
      onSelectComponent(parentComponent);

      // Select the new component
      setTimeout(() => onSelectComponent(duplicatedComponent), 100);
    }
  };

  // Handle moving component up in the parent's children list
  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!parentComponent || !parentComponent.children) return;

    // Find the index of the current component in the parent's children
    const index = parentComponent.children.findIndex(child => child.id === component.id);

    // Can't move up if already at the top
    if (index <= 0) return;

    // Swap with the component above
    const temp = parentComponent.children[index];
    parentComponent.children[index] = parentComponent.children[index - 1];
    parentComponent.children[index - 1] = temp;

    // Notify parent of changes
    onSelectComponent(parentComponent);

    // Keep the current component selected
    setTimeout(() => onSelectComponent(component), 100);
  };

  // Handle moving component down in the parent's children list
  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!parentComponent || !parentComponent.children) return;

    // Find the index of the current component in the parent's children
    const index = parentComponent.children.findIndex(child => child.id === component.id);

    // Can't move down if already at the bottom
    if (index === -1 || index >= parentComponent.children.length - 1) return;

    // Swap with the component below
    const temp = parentComponent.children[index];
    parentComponent.children[index] = parentComponent.children[index + 1];
    parentComponent.children[index + 1] = temp;

    // Notify parent of changes
    onSelectComponent(parentComponent);

    // Keep the current component selected
    setTimeout(() => onSelectComponent(component), 100);
  };

  // Render children components
  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }

    return component.children.map(child => (
      <ComponentRenderer
        key={child.id}
        component={child}
        onSelectComponent={onSelectComponent}
        isSelected={isSelected && component.children && component.children.length === 1}
        parentComponent={component}
      />
    ));
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectComponent(component);
  };

  // Set up drop target for accepting new components
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'NEW_COMPONENT',
    canDrop: () => {
      // Check if this component type allows children
      const config = builder.getAllRegisteredComponentTypes()
        .find(c => c.type === component.type);
      return config?.allowChildren || false;
    },
    drop: (item: { componentType: string }, monitor) => {
      // If the monitor says that the drop occurred in a child, don't handle it here
      if (monitor.didDrop()) {
        return;
      }

      // Only components that allow children can accept drops
      const config = builder.getAllRegisteredComponentTypes()
        .find(c => c.type === component.type);

      if (!config?.allowChildren) return;

      // Create a new component of the dropped type
      const newComponent = builder.createComponent(item.componentType);

      if (newComponent) {
        // Initialize children array if it doesn't exist
        if (!component.children) {
          component.children = [];
        }

        // Add the new component to children
        component.children.push(newComponent);

        // Notify parent of changes
        onSelectComponent(component);
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Component toolbar (only visible when hovered or selected)
  const renderToolbar = () => {
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
    );
  };

  // Component type-specific rendering
  switch (component.type) {
    case 'container':
      // Container component with drop zone
      {
        const canDropHere = canDrop && isOver;

        return (
          <div
            ref={(node) => {
              // Combine refs for both useDrop and our own ref
              drop(node);
              if (componentRef && node) {
                componentRef.current = node;
              }
            }}
            className={`editor-component editor-container ${isSelected ? 'selected' : ''} ${canDropHere ? 'drop-target' : ''}`}
            onClick={handleClick}
            style={component.props.style as CSSProperties | undefined}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {(hovered || isSelected) && renderToolbar()}

            {renderChildren()}

            {(!component.children || component.children.length === 0) && (
              <div className="empty-container-placeholder">
                {canDrop ? 'Drop components here' : 'This container is empty'}
              </div>
            )}
          </div>
        );
      }

    case 'text':
      // Text component
      return (
        <div
          ref={componentRef}
          className={`editor-component editor-text ${isSelected ? 'selected' : ''}`}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {(hovered || isSelected) && renderToolbar()}

          {React.createElement(
            component.props.tag as string || 'p',
            { style: component.props.style },
            component.props.content as React.ReactNode
          )}
        </div>
      );

    case 'image':
      // Image component
      return (
        <div
          ref={componentRef}
          className={`editor-component editor-image ${isSelected ? 'selected' : ''}`}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {(hovered || isSelected) && renderToolbar()}

          <img
            src={component.props.src as string}
            alt={component.props.alt as string}
            style={component.props.style as CSSProperties | undefined}
          />
        </div>
      );

    default:
      return (
        <div
          ref={componentRef}
          className={`editor-component editor-unknown ${isSelected ? 'selected' : ''}`}
          onClick={handleClick}
        >
          Unknown component type: {component.type}
        </div>
      );
  }
};