// Interfaz para definir la estructura de un tipo de componente
export interface ComponentType {
  type: string;
  name: string;
  category: string;
  icon?: string;
  // Agregar más propiedades según sea necesario
}