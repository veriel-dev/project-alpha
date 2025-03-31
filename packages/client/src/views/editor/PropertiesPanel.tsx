import React, { useState, useEffect } from 'react';
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/src/types/component';

export const PropertiesPanel: React.FC<{
  component: Component | null;
  onUpdateProps: (props: Record<string, unknown>) => void;
}> = ({ component, onUpdateProps }) => {
  const [localValues, setLocalValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync localValues with component props when component changes
  useEffect(() => {
    if (component) {
      setLocalValues(component.props || {});
      setErrors({});
    } else {
      setLocalValues({});
      setErrors({});
    }
  }, [component]);

  if (!component) {
    return (
      <div className="properties-panel-container">
        <h3>Properties</h3>
        <div className="empty-properties">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  // Find component configuration
  const config = builder.getAllRegisteredComponentTypes()
    .find(c => c.type === component.type);

  if (!config) {
    return (
      <div className="properties-panel-container">
        <h3>Properties</h3>
        <div className="empty-properties">
          Configuration for component type "{component.type}" not found
        </div>
      </div>
    );
  }

  // Get the current value of a property (supporting nested properties)
  const getCurrentValue = (propName: string) => {
    if (propName.includes('.')) {
      const [parent, child] = propName.split('.');
      const parentObj = localValues[parent] as Record<string, unknown> || {};
      return parentObj[child] ?? '';
    } else {
      return localValues[propName] ?? '';
    }
  };

  // Validate a property value based on the editor type
  const validateValue = (propName: string, value: unknown, editorType: string): boolean => {
    let isValid = true;
    let errorMessage = '';

    // Editor-specific validations
    switch (editorType) {
      case 'number':
        // For number editors, ensure it's a valid number
        if (isNaN(Number(value))) {
          isValid = false;
          errorMessage = 'Please enter a valid number';
        }
        break;

      case 'color':
        // For color editors, ensure it's a valid color format
        if (typeof value === 'string' && !value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
          // Not a valid hex color
          isValid = false;
          errorMessage = 'Please enter a valid hex color (e.g., #ff0000)';
        }
        break;
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [propName]: errorMessage
    }));

    return isValid;
  };

  // Handle property change
  const handlePropChange = (propName: string, value: unknown, editorType: string) => {
    // Update local state first
    if (propName.includes('.')) {
      // Handle nested props like 'style.color'
      const [parent, child] = propName.split('.');
      setLocalValues(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, unknown> || {}),
          [child]: value,
        },
      }));
    } else {
      setLocalValues(prev => ({
        ...prev,
        [propName]: value,
      }));
    }

    // Validate the new value
    const isValid = validateValue(propName, value, editorType);

    // Only update component if value is valid
    if (isValid) {
      // Delay the update to reduce unnecessary renders
      // and allow for proper validation
      if (propName.includes('.')) {
        // Handle nested props like 'style.color'
        const [parent, child] = propName.split('.');
        onUpdateProps({
          [parent]: {
            ...(component.props[parent] as Record<string, unknown> || {}),
            [child]: value,
          },
        });
      } else {
        onUpdateProps({ [propName]: value });
      }
    }
  };

  // Debounced handle blur for text inputs
  const handleBlur = (propName: string, value: unknown, editorType: string) => {
    const isValid = validateValue(propName, value, editorType);

    // Apply the update if valid
    if (isValid) {
      if (propName.includes('.')) {
        // Handle nested props like 'style.color'
        const [parent, child] = propName.split('.');
        onUpdateProps({
          [parent]: {
            ...(component.props[parent] as Record<string, unknown> || {}),
            [child]: value,
          },
        });
      } else {
        onUpdateProps({ [propName]: value });
      }
    }
  };

  // Organize properties by groups if available in the config
  const propertyGroups: Record<string, typeof config.propEditors> = {};

  if (config.propEditors) {
    // Group properties
    config.propEditors.forEach(editor => {
      const group = editor.group || 'General';
      if (!propertyGroups[group]) {
        propertyGroups[group] = [];
      }
      propertyGroups[group].push(editor);
    });
  }

  // If no groups were defined, put all properties in a "General" group
  if (Object.keys(propertyGroups).length === 0 && config.propEditors) {
    propertyGroups['General'] = config.propEditors;
  }

  return (
    <div className="properties-panel-container">
      <h3>
        {component.label || component.type.charAt(0).toUpperCase() + component.type.slice(1)} Properties
      </h3>

      <div className="component-info">
        <span className="component-type">{component.type}</span>
        <span className="component-id">{component.id}</span>
      </div>

      {Object.entries(propertyGroups).map(([groupName, editors]) => (
        <div key={groupName} className="property-group">
          <h4 className="property-group-title">{groupName}</h4>
          <div className="properties-list">
            {editors.map((editor) => (
              <div key={editor.propName} className="property-editor">
                <label htmlFor={`prop-${editor.propName}`}>
                  {editor.label}
                  {editor.required && <span className="required-indicator">*</span>}
                </label>

                {/* Render different editor types */}
                {editor.editorType === 'text' && (
                  <>
                    <input
                      id={`prop-${editor.propName}`}
                      type="text"
                      value={getCurrentValue(editor.propName) as string}
                      onChange={(e) => handlePropChange(editor.propName, e.target.value, editor.editorType)}
                      onBlur={(e) => handleBlur(editor.propName, e.target.value, editor.editorType)}
                      className={errors[editor.propName] ? 'has-error' : ''}
                    />
                    {errors[editor.propName] && <div className="form-error">{errors[editor.propName]}</div>}
                  </>
                )}

                {editor.editorType === 'number' && (
                  <>
                    <input
                      id={`prop-${editor.propName}`}
                      type="number"
                      value={getCurrentValue(editor.propName) as number}
                      onChange={(e) => handlePropChange(editor.propName, Number(e.target.value), editor.editorType)}
                      onBlur={(e) => handleBlur(editor.propName, Number(e.target.value), editor.editorType)}
                      className={errors[editor.propName] ? 'has-error' : ''}
                      step={editor.step || 1}
                      min={editor.min}
                      max={editor.max}
                    />
                    {errors[editor.propName] && <div className="form-error">{errors[editor.propName]}</div>}
                  </>
                )}

                {editor.editorType === 'color' && (
                  <div className="color-editor">
                    <input
                      id={`prop-color-${editor.propName}`}
                      type="color"
                      value={getCurrentValue(editor.propName) as string}
                      onChange={(e) => handlePropChange(editor.propName, e.target.value, editor.editorType)}
                      className={errors[editor.propName] ? 'has-error' : ''}
                    />
                    <input
                      id={`prop-${editor.propName}`}
                      type="text"
                      value={getCurrentValue(editor.propName) as string}
                      onChange={(e) => handlePropChange(editor.propName, e.target.value, editor.editorType)}
                      onBlur={(e) => handleBlur(editor.propName, e.target.value, editor.editorType)}
                      className={errors[editor.propName] ? 'has-error' : ''}
                    />
                    {errors[editor.propName] && <div className="form-error">{errors[editor.propName]}</div>}
                  </div>
                )}

                {editor.editorType === 'select' && (
                  <select
                    id={`prop-${editor.propName}`}
                    value={getCurrentValue(editor.propName) as string}
                    onChange={(e) => handlePropChange(editor.propName, e.target.value, editor.editorType)}
                    className={errors[editor.propName] ? 'has-error' : ''}
                  >
                    {editor.options?.map((option) => (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-expect-error
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {editor.editorType === 'toggle' && (
                  <label className="toggle-switch">
                    <input
                      id={`prop-${editor.propName}`}
                      type="checkbox"
                      checked={!!getCurrentValue(editor.propName)}
                      onChange={(e) => handlePropChange(editor.propName, e.target.checked, editor.editorType)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                )}

                {editor.editorType === 'image' && (
                  <div className="image-editor">
                    <input
                      id={`prop-${editor.propName}`}
                      type="text"
                      value={getCurrentValue(editor.propName) as string}
                      onChange={(e) => handlePropChange(editor.propName, e.target.value, editor.editorType)}
                      onBlur={(e) => handleBlur(editor.propName, e.target.value, editor.editorType)}
                      className={errors[editor.propName] ? 'has-error' : ''}
                      placeholder="Enter image URL"
                    />
                    <button
                      className="upload-button"
                      title="Choose Image"
                      onClick={() => alert('Image upload functionality would be implemented here')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                )}

                {editor.description && (
                  <div className="property-description">{editor.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add a component info section at the bottom with advanced options */}
      <div className="advanced-section">
        <details>
          <summary>Advanced Options</summary>
          <div className="advanced-options">
            <div className="property-editor">
              <label>Component ID</label>
              <input
                type="text"
                value={component.id}
                disabled
                className="disabled"
              />
            </div>
            <div className="component-actions">
              <button
                className="delete-component-btn"
                onClick={() => {
                  const confirmDelete = window.confirm('Are you sure you want to delete this component?');
                  if (confirmDelete) {
                    // This would be handled by the parent component
                    // We could implement this by passing an onDeleteComponent callback
                    alert('Delete component functionality would be called here');
                  }
                }}
              >
                Delete Component
              </button>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};