import React from 'react'
import { builder } from '../../core/builder/Builder';
import { Component } from '@web-builder/shared/src/types/component';


export const PropertiesPanel: React.FC<{
  component: Component | null;
  onUpdateProps: (props: Record<string, unknown>) => void;
}> = ({ component, onUpdateProps }) => {
  if (!component) {
    return (
      <div className="properties-panel">
        <h2>Propiedades</h2>
        <p>Selecciona un componente para editar sus propiedades</p>
      </div>
    );
  }

  // Buscar la configuración del componente
  const config = builder.getAllRegisteredComponentTypes()
    .find(c => c.type === component.type);

  if (!config) {
    return (
      <div className="properties-panel">
        <h2>Propiedades</h2>
        <p>Configuración de componente no encontrada</p>
      </div>
    );
  }

  const handlePropChange = (propName: string, value: any) => {
    if (propName.includes('.')) {
      const [parent, child] = propName.split('.');
      onUpdateProps({
        [parent]: {
          ...(typeof component.props[parent] === 'object' ? component.props[parent] : {}),
          [child]: value,
        },
      });
    } else {
      onUpdateProps({ [propName]: value });
    }
  };

  return (
    <div className="properties-panel">
      <h2>Propiedades: {component.label}</h2>

      <div className="properties-list">
        {config.propEditors.map(editor => (
          <div key={editor.propName} className="property-editor">
            <label>{editor.label}</label>

            {renderPropEditor(editor, component, handlePropChange)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Función auxiliar para renderizar el editor específico según su tipo
function renderPropEditor(
  editor: any,
  component: Component,
  onChange: (propName: string, value: any) => void
) {
  // Obtener el valor actual (maneja props anidadas como 'style.color')
  const getCurrentValue = () => {
    if (editor.propName.includes('.')) {
      const [parent, child] = editor.propName.split('.');
      return component.props[parent]?.[child] ?? editor.defaultValue;
    } else {
      return component.props[editor.propName] ?? editor.defaultValue;
    }
  };

  const currentValue = getCurrentValue();

  switch (editor.editorType) {
    case 'text':
      return (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(editor.propName, e.target.value)}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={currentValue}
          onChange={(e) => onChange(editor.propName, Number(e.target.value))}
        />
      );
    case 'color':
      return (
        <input
          type="color"
          value={currentValue}
          onChange={(e) => onChange(editor.propName, e.target.value)}
        />
      );
    case 'select':
      return (
        <select
          value={currentValue}
          onChange={(e) => onChange(editor.propName, e.target.value)}
        >
          {editor.options?.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case 'toggle':
      return (
        <input
          type="checkbox"
          checked={!!currentValue}
          onChange={(e) => onChange(editor.propName, e.target.checked)}
        />
      );
    case 'image':
      return (
        <div className="image-editor">
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onChange(editor.propName, e.target.value)}
          />
          <button className="upload-button">Subir</button>
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(editor.propName, e.target.value)}
        />
      );
  }
}