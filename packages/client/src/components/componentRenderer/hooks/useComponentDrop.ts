import { Component } from "@web-builder/shared/src/types";
import { useDrop } from "react-dnd";
import { canHaveChildren } from "../utils/componentHelpers";
import { addChildComponent } from "../utils/componentOperations";
import { builder } from "../../../core/builder/Builder";


interface UserComponentDropParams {
  component: Component
  onSelectComponent: (component: Component) => void
}
interface DropItem {
  componentType: string;
}
/* 
* Hook personalizado para manejar el drop de componentes
*/
const useComponentDrop = ({ component, onSelectComponent }: UserComponentDropParams) => {
  return useDrop({
    accept: 'NEW_COMPONENT',
    canDrop: () => {
      // Verifica si esste tipo de componente permite hijos 
      return canHaveChildren(component);
    },
    drop: (item: DropItem, monitor) => {
      // Si el monitor indica que el drop ocurrió en un hijo, no lo manejamos aquí 
      if (monitor.didDrop()) return
      // Solo los componentes que permiten hijos pueden aceptar drops
      if (!canHaveChildren(component)) return;

      // Agrega un nuevo componente hijo 
      addChildComponent(
        component,
        item.componentType,
        (type) => builder.createComponent(type) || undefined,
        onSelectComponent
      )
    },
    collect: monitor => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });
}

export default useComponentDrop;