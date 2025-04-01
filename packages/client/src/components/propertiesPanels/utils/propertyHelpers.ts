import { PropertyValue, PropertyValues, PropertyEditor, PropertyGroups } from '../types';

/**
 * Obtiene el valor actual de una propiedad, soportando propiedades anidadas
 */
export const getCurrentValue = (propName: string, values: PropertyValues): PropertyValue => {
  if (propName.includes('.')) {
    const [parent, child] = propName.split('.');
    const parentObj = (values[parent] as Record<string, PropertyValue>) || {};
    return parentObj[child] ?? '' as PropertyValue;
  } else {
    return values[propName] ?? '' as PropertyValue;
  }
};

/**
 * Organiza las propiedades en grupos
 */
export const organizePropertyGroups = (propEditors: PropertyEditor[] | undefined): PropertyGroups => {
  const propertyGroups: PropertyGroups = {};

  if (!propEditors || propEditors.length === 0) {
    return propertyGroups;
  }

  // Agrupar propiedades
  propEditors.forEach(editor => {
    const group = editor.group || 'General';
    if (!propertyGroups[group]) {
      propertyGroups[group] = [];
    }
    propertyGroups[group].push(editor);
  });

  // Si no hay grupos definidos, poner todo en "General"
  if (Object.keys(propertyGroups).length === 0) {
    propertyGroups['General'] = propEditors;
  }

  return propertyGroups;
};

/**
 * Actualiza un valor en el objeto de valores, manejando propiedades anidadas
 */
export const updatePropertyValue = (
  values: PropertyValues,
  propName: string,
  value: PropertyValue
): PropertyValues => {
  if (propName.includes('.')) {
    // Manejar propiedades anidadas como 'style.color'
    const [parent, child] = propName.split('.');
    return {
      ...values,
      [parent]: {
        ...(values[parent] as Record<string, unknown> || {}),
        [child]: value,
      },
    };
  } else {
    // Propiedad simple
    return {
      ...values,
      [propName]: value,
    };
  }
};

/**
 * Prepara la actualización de propiedades para el componente
 */
export const preparePropsUpdate = (
  currentProps: Record<string, unknown>,
  propName: string,
  value: PropertyValue
): Record<string, unknown> => {
  if (propName.includes('.')) {
    // Manejar propiedades anidadas
    const [parent, child] = propName.split('.');
    return {
      [parent]: {
        ...(currentProps[parent] as Record<string, unknown> || {}),
        [child]: value,
      },
    };
  } else {
    // Propiedad simple
    return { [propName]: value };
  }
};