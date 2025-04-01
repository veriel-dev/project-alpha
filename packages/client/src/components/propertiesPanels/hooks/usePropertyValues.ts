import { useState, useEffect } from 'react';
import { Component } from '@web-builder/shared/src/types/component';
import { PropertyValue, PropertyValues, ValidationErrors } from '../types';
import { validatePropertyValue } from '../utils/validators';
import { updatePropertyValue, preparePropsUpdate } from '../utils/propertyHelpers';

interface UsePropertyValuesProps {
  component: Component | null;
  onUpdateProps: (props: Record<string, unknown>) => void;
}

interface UsePropertyValuesReturn {
  values: PropertyValues;
  errors: ValidationErrors;
  handleChange: (propName: string, value: PropertyValue, editorType: string) => void;
  handleBlur: (propName: string, value: PropertyValue, editorType: string) => void;
}

const usePropertyValues = ({ component, onUpdateProps }: UsePropertyValuesProps): UsePropertyValuesReturn => {
  const [values, setValues] = useState<PropertyValues>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Sincronizar valores locales con propiedades del componente cuando cambia
  useEffect(() => {
    if (component) {
      setValues(component.props as PropertyValues || {});
      setErrors({});
    } else {
      setValues({});
      setErrors({});
    }
  }, [component]);

  // Validar valor y actualizar errores
  const validateValue = (propName: string, value: PropertyValue, editorType: string): boolean => {
    const { isValid, errorMessage } = validatePropertyValue(value, editorType);

    // Actualizar estado de errores
    setErrors(prev => ({
      ...prev,
      [propName]: errorMessage
    }));

    return isValid;
  };

  // Manejar cambio en propiedad
  const handleChange = (propName: string, value: PropertyValue, editorType: string) => {
    // Actualizar estado local primero
    setValues(prev => updatePropertyValue(prev, propName, value));

    // Validar el nuevo valor
    validateValue(propName, value, editorType);
  };

  // Manejar evento de blur para inputs de texto
  const handleBlur = (propName: string, value: PropertyValue, editorType: string) => {
    const isValid = validateValue(propName, value, editorType);

    // Aplicar la actualización si es válida
    if (isValid && component) {
      const update = preparePropsUpdate(component.props, propName, value);
      onUpdateProps(update);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur
  };
};

export default usePropertyValues;