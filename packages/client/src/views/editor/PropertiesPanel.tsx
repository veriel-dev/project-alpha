import React from 'react';
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/src/types/component';

export const PropertiesPanel: React.FC<{
  component: Component | null;
  onUpdateProps: (props: Record<string, unknown>) => void;
}> = ({ component, onUpdateProps }) => {
  if (!component) {
    return (
      <div className="properties-panel-container">
        <h3>Propiedades</h3>
        <div className="empty-properties">
          Selecciona un componente para editar sus propiedades
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
        <h3>Propiedades</h3>
        <div className="empty-properties">
          Configuración de componente no encontrada
        </div>
      </div>
    );
  }

  const handlePropChange = (propName: string, value: unknown) => {
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
  };

  // Function to get current value of a property
  const getCurrentValue = (propName: string) => {
    if (propName.includes('.')) {
      const [parent, child] = propName.split('.');
      const parentObj = component.props[parent] as Record<string, unknown> || {};
      return parentObj[child] ?? '';
    } else {
      return component.props[propName] ?? '';
    }
  };

  return (
    <div className="properties-panel-container">
      <h3>Propiedades</h3>

      <div className="properties-list">
        {config.propEditors?.map((editor) => (
          <div key={editor.propName} className="property-editor">
            <label htmlFor={`prop-${editor.propName}`}>{editor.label}</label>

            {/* Render different editor types */}
            {editor.editorType === 'text' && (
              <input
                id={`prop-${editor.propName}`}
                type="text"
                value={getCurrentValue(editor.propName) as string}
                onChange={(e) => handlePropChange(editor.propName, e.target.value)}
              />
            )}

            {editor.editorType === 'number' && (
              <input
                id={`prop-${editor.propName}`}
                type="number"
                value={getCurrentValue(editor.propName) as number}
                onChange={(e) => handlePropChange(editor.propName, Number(e.target.value))}
              />
            )}

            {editor.editorType === 'color' && (
              <div className="color-editor">
                <input
                  id={`prop-${editor.propName}`}
                  type="color"
                  value={getCurrentValue(editor.propName) as string}
                  onChange={(e) => handlePropChange(editor.propName, e.target.value)}
                />
                <input
                  type="text"
                  value={getCurrentValue(editor.propName) as string}
                  onChange={(e) => handlePropChange(editor.propName, e.target.value)}
                  className="color-text-input"
                />
              </div>
            )}

            {editor.editorType === 'select' && (
              <select
                id={`prop-${editor.propName}`}
                value={getCurrentValue(editor.propName) as string}
                onChange={(e) => handlePropChange(editor.propName, e.target.value)}
              >
                {editor.options?.map((option) => (
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
                  onChange={(e) => handlePropChange(editor.propName, e.target.checked)}
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
                  onChange={(e) => handlePropChange(editor.propName, e.target.value)}
                  placeholder="URL de la imagen"
                />
                <button className="upload-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};