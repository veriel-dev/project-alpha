import { Component } from "@web-builder/shared/src/types/component";
import { ComponentRenderer } from "../ComponentRenderer";

interface RenderComponentChildrenrProps {
  component: Component;
  onSelectComponent: (component: Component) => void;
  isSelected: boolean;
}

/*
 * Componente que renderiza los hijos de un componente padre
 */

export const RenderComponentChildren: React.FC<RenderComponentChildrenrProps> = ({
  component,
  onSelectComponent,
  isSelected
}) => {
  if (!component.children || component.children.length === 0) {
    return null;
  }


  return component.children.map(child => (
    <ComponentRenderer
      key={child.id}
      component={child}
      onSelectComponent={onSelectComponent}
      isSelected={isSelected && component.children && component.children.length === 1}
      parentComponent={component}
    />
  ));
};