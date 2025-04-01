import { PropertyValue } from '../types';

/**
 * Valida un valor según el tipo de editor
 */
export const validatePropertyValue = (
  value: PropertyValue,
  editorType: string
): { isValid: boolean; errorMessage: string } => {
  let isValid = true;
  let errorMessage = '';

  // Validaciones específicas por tipo de editor
  switch (editorType) {
    case 'number':
      // Para editores numéricos, asegurar que es un número válido
      if (isNaN(Number(value))) {
        isValid = false;
        errorMessage = 'Por favor ingrese un número válido';
      }
      break;

    case 'color':
      // Para editores de color, asegurar que es un formato de color válido
      if (typeof value === 'string' && !value.match(/^#([0-9A-F]{3}){1,2}$/i)) {
        // No es un color hex válido
        isValid = false;
        errorMessage = 'Por favor ingrese un color hex válido (ej. #ff0000)';
      }
      break;

    case 'image':
      // Validación básica de URL para imágenes
      if (typeof value === 'string' && value.trim() !== '' && !isValidUrl(value)) {
        isValid = false;
        errorMessage = 'Por favor ingrese una URL de imagen válida';
      }
      break;
  }

  return { isValid, errorMessage };
};

/**
 * Valida que una cadena sea una URL válida
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.error('Error validando URL:', error);
    return false;
  }
};