import React from 'react';
import { BaseEditorProps } from './types';

// Editor de texto
export const TextEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, onBlur, error, editor
}) => {
  return (
    <>
      <input
        id={`prop-${propName}`}
        type="text"
        value={value as string}
        onChange={(e) => onChange(propName, e.target.value, editor.editorType)}
        onBlur={onBlur ? (e) => onBlur(propName, e.target.value, editor.editorType) : undefined}
        className={error ? 'has-error' : ''}
      />
      {error && <div className="form-error">{error}</div>}
    </>
  );
};

// Editor numérico
export const NumberEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, onBlur, error, editor
}) => {
  return (
    <>
      <input
        id={`prop-${propName}`}
        type="number"
        value={value as number}
        onChange={(e) => onChange(propName, Number(e.target.value), editor.editorType)}
        onBlur={onBlur ? (e) => onBlur(propName, Number(e.target.value), editor.editorType) : undefined}
        className={error ? 'has-error' : ''}
        step={editor.step || 1}
        min={editor.min}
        max={editor.max}
      />
      {error && <div className="form-error">{error}</div>}
    </>
  );
};

// Editor de color
export const ColorEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, onBlur, error, editor
}) => {
  return (
    <div className="color-editor">
      <input
        id={`prop-color-${propName}`}
        type="color"
        value={value as string}
        onChange={(e) => onChange(propName, e.target.value, editor.editorType)}
        className={error ? 'has-error' : ''}
      />
      <input
        id={`prop-${propName}`}
        type="text"
        value={value as string}
        onChange={(e) => onChange(propName, e.target.value, editor.editorType)}
        onBlur={onBlur ? (e) => onBlur(propName, e.target.value, editor.editorType) : undefined}
        className={error ? 'has-error' : ''}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

// Editor de selección
export const SelectEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, error, editor
}) => {
  return (
    <select
      id={`prop-${propName}`}
      value={value as string}
      onChange={(e) => onChange(propName, e.target.value, editor.editorType)}
      className={error ? 'has-error' : ''}
    >
      {editor.options?.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Editor de toggle
export const ToggleEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, editor
}) => {
  return (
    <label className="toggle-switch">
      <input
        id={`prop-${propName}`}
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(propName, e.target.checked, editor.editorType)}
      />
      <span className="toggle-slider"></span>
    </label>
  );
};

// Editor de imagen
export const ImageEditor: React.FC<BaseEditorProps> = ({
  propName, value, onChange, onBlur, error, editor
}) => {
  return (
    <div className="image-editor">
      <input
        id={`prop-${propName}`}
        type="text"
        value={value as string}
        onChange={(e) => onChange(propName, e.target.value, editor.editorType)}
        onBlur={onBlur ? (e) => onBlur(propName, e.target.value, editor.editorType) : undefined}
        className={error ? 'has-error' : ''}
        placeholder="Enter image URL"
      />
      <button
        type="button"
        className="upload-button"
        title="Choose Image"
        onClick={() => alert('Image upload functionality would be implemented here')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </button>
    </div>
  );
};

// Factory para obtener el editor adecuado según el tipo
export const getPropertyEditor = (editorType: string): React.FC<BaseEditorProps> => {
  switch (editorType) {
    case 'text':
      return TextEditor;
    case 'number':
      return NumberEditor;
    case 'color':
      return ColorEditor;
    case 'select':
      return SelectEditor;
    case 'toggle':
      return ToggleEditor;
    case 'image':
      return ImageEditor;
    default:
      return TextEditor;
  }
};