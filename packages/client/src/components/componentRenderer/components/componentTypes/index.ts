import { Component } from "@web-builder/shared/src/types/component";
import ContainerComponent from "./ContainerComponent";
import ContainerRootComponent from "./ContainerRootComponent";
import DefaultComponent from "./DefaultComponent";
import ImageComponent from "./ImageComponent";
import TextComponent from "./TextComponent";

// Mapa de tipos de componentes a sus implementaciones respectivas
export const componentTypeMap = {
  'container': ContainerComponent,
  'text': TextComponent,
  'image': ImageComponent,
  'container-root': ContainerRootComponent,
  'default': DefaultComponent
};

// Función para obtener el componente adecuado según el tipo
export const getComponentByType = (type: string) => {
  return componentTypeMap[type as keyof typeof componentTypeMap] || componentTypeMap.default;
};

// Interfaz común para todos los tipos de componentes
export interface ComponentTypeProps {
  component: Component;
  isSelected: boolean;
  parentComponent?: Component;
  onSelectComponent: (component: Component) => void;
  isHovered: boolean;
}