import { Component } from '@web-builder/shared/src/types/component';

/* 
* Elimina un componente de su padre
*/
export const deleteComponent = (
  component: Component,
  parentComponent: Component | undefined,
  onSelectComponent: (component: Component) => void
): void => {
  if (!parentComponent || !parentComponent.children) return;
  // Encuentra el índice del componente actual en los hijos del padre
  const index = parentComponent.children.findIndex(child => child.id === component.id);
  if (index !== -1) {
    // Elimina el componente de los hijos del padre
    parentComponent.children.splice(index, 1);
    // Notifica al padre de los cambios
    onSelectComponent(parentComponent);
  }
};
/*
 * Duplica un componente
 */
export const duplicateComponent = (
  component: Component,
  parentComponent: Component | undefined,
  onSelectComponent: (component: Component) => void
): void => {
  if (!parentComponent || !parentComponent.children) return;

  // Crea una copia profunda del componente
  const duplicatedComponent = JSON.parse(JSON.stringify(component));

  // Genera un nuevo ID para el componente duplicado
  duplicatedComponent.id = 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // Encuentra el índice del componente actual en los hijos del padre
  const index = parentComponent.children.findIndex(child => child.id === component.id);

  if (index !== -1) {
    // Inserta el componente duplicado después del actual
    parentComponent.children.splice(index + 1, 0, duplicatedComponent);

    // Notifica al padre de los cambios
    onSelectComponent(parentComponent);

    // Selecciona el nuevo componente
    setTimeout(() => onSelectComponent(duplicatedComponent), 100);
  }
};
/* 
* Mueve un componente arriba en la lista de hijos del padre
*/
export const moveComponentUp = (
  component: Component,
  parentComponent: Component | undefined,
  onSelectComponent: (component: Component) => void
): void => {
  if (!parentComponent || !parentComponent.children) return;

  const index = parentComponent.children.findIndex(child => child.id === component.id);

  if (index <= 0) return;
  const temp = parentComponent.children[index];
  parentComponent.children[index] = parentComponent.children[index - 1];
  parentComponent.children[index - 1] = temp;

  onSelectComponent(parentComponent);

  setTimeout(() => onSelectComponent(component), 100);
}

/* 
* Mueve un componente abajo en la lista de hijos del padre
*/
export const moveComponentDown = (
  component: Component,
  parentComponent: Component | undefined,
  onSelectComponent: (component: Component) => void
): void => {
  if (!parentComponent || !parentComponent.children) return;
  const index = parentComponent.children.findIndex(child => child.id === component.id);

  if (index === -1 || index >= parentComponent.children.length - 1) return;

  const temp = parentComponent.children[index];
  parentComponent.children[index] = parentComponent.children[index + 1];
  parentComponent.children[index + 1] = temp;

  onSelectComponent(parentComponent);

  setTimeout(() => onSelectComponent(component), 100);
};

/*
* Agrega un nuevo componente hijo
*/
export const addChildComponent = (
  parentComponent: Component,
  childComponentType: string,
  createComponentFn: (type: string) => Component | undefined,
  onSelectComponent: (component: Component) => void
): void => {
  // Crea un nuevo componente del tipo especificado
  const newComponent = createComponentFn(childComponentType);

  if (newComponent) {
    // Inicializa el array de hijos si no existe
    if (!parentComponent.children) {
      parentComponent.children = [];
    }

    // Agrega el nuevo componente a los hijos
    parentComponent.children.push(newComponent);

    // Notifica al padre de los cambios
    onSelectComponent(parentComponent);
  }
};
