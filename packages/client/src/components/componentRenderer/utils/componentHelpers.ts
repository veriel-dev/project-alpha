import { Component } from '@web-builder/shared/types/component';
import { builder } from '../../../core/builder/Builder';

/* 
* Verifica si un componente permite hijos
*/
export const canHaveChildren = (component: Component): boolean => {
  const config = builder
    .getAllRegisteredComponentTypes()
    .find(c => c.type === component.type);
  return config?.allowChildren || false;
}
/* 
* Renderiza los hijos de un componente - Debe ir en un componente de React
*/

/* 
export const renderComponentChildren = (
  component: Component, 
  onSelectComponent: (component: Component) => void,
  isSelected: boolean
): JSX.Element[] | null => {
  if (!component.children || component.children.length === 0) {
    return null;
  }

  // Importación dinámica del ComponentRenderer
  const ComponentRenderer = React.lazy(() => import('../ComponentRenderer'));

  return component.children.map(child => (
    <React.Suspense key={child.id} fallback={<div>Loading...</div>}>
      <ComponentRenderer
        component={child}
        onSelectComponent={onSelectComponent}
        isSelected={isSelected && component.children && component.children.length === 1}
        parentComponent={component}
      />
    </React.Suspense>
  ));
};
*/

/* 
* Genera un ID único para un componente
*/
export const generateUniqueComponentId = (prefix = 'comp'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/* 
* Determina si un componente debe mostrar un toolbar 
*/
export const shouldShowToolbar = (hovered: boolean, isSelected: boolean): boolean => {
  return hovered || isSelected;
};