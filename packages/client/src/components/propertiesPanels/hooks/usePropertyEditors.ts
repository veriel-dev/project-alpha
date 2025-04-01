import { useMemo } from 'react';
import { Component, ComponentConfig } from '@web-builder/shared/src/types/component';
import { builder } from '../../../core/builder/Builder';
import { PropertyEditor, PropertyGroups } from '../types';
import { organizePropertyGroups } from '../utils/propertyHelpers';

interface UsePropertyEditorsProps {
  component: Component | null;
}

interface UsePropertyEditorsReturn {
  config: ComponentConfig | null;
  propertyGroups: PropertyGroups;
  componentLabel: string;
}

const usePropertyEditors = ({ component }: UsePropertyEditorsProps): UsePropertyEditorsReturn => {
  // Buscar configuración del componente y organizar propiedades en grupos
  const result = useMemo(() => {
    if (!component) {
      return {
        config: null,
        propertyGroups: {},
        componentLabel: ''
      };
    }

    // Buscar configuración del componente
    const config = builder.getAllRegisteredComponentTypes()
      .find(c => c.type === component.type) || null;

    // Organizar propiedades en grupos
    const propertyGroups = config?.propEditors
      ? organizePropertyGroups(config.propEditors as PropertyEditor[])
      : {};

    // Preparar etiqueta del componente
    const componentLabel = component.label ||
      (component.type.charAt(0).toUpperCase() + component.type.slice(1));

    return {
      config,
      propertyGroups,
      componentLabel
    };
  }, [component]);

  return result;
};

export default usePropertyEditors;