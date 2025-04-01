import { Component } from '@web-builder/shared/src/types/component';

// Tipos para editores de propiedades
export interface PropertyEditor {
  propName: string;
  label: string;
  editorType: 'text' | 'number' | 'color' | 'select' | 'toggle' | 'image';
  group?: string;
  required?: boolean;
  description?: string;
  options?: Array<{
    label: string;
    value: string | number | boolean;
  }>;
  min?: number;
  max?: number;
  step?: number;
}

// Tipos para los valores de propiedades
export type PropertyValue = string | number | boolean | Record<string, unknown>;
export type PropertyValues = Record<string, PropertyValue>;

// Errores de validación
export type ValidationErrors = Record<string, string>;

// Props comunes para todos los editores de propiedades
export interface BaseEditorProps {
  propName: string;
  value: PropertyValue;
  onChange: (propName: string, value: PropertyValue, editorType: string) => void;
  onBlur?: (propName: string, value: PropertyValue, editorType: string) => void;
  error?: string;
  editor: PropertyEditor;
}

// Props para el componente PropertiesPanel
export interface PropertiesPanelProps {
  component: Component | null;
  onUpdateProps: (props: Record<string, unknown>) => void;
  onDeleteComponent?: (componentId: string) => void;
}

// Grupos de propiedades organizadas
export interface PropertyGroups {
  [groupName: string]: PropertyEditor[];
}