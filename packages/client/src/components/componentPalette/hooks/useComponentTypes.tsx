import { ComponentConfig } from "@web-builder/shared/src/types";
import { builder } from "../../../core/builder/Builder";
import { useMemo } from "react";


interface UseComponentTypesResult {
  componentsByCategory: Record<string, ComponentConfig[]>;
  isEmpty: boolean;
}

/* 
* Hook personalizado para manejar la lógica de obtención y agrupación de componentes
*/
export const useComponentTypes = (): UseComponentTypesResult => {
  const componentTypes = builder.getAllRegisteredComponentTypes();

  const componentsByCategory = useMemo(() => {
    return componentTypes.reduce((acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, ComponentConfig[]>);
  }, [componentTypes]);

  const isEmpty = useMemo(() => {
    return Object.entries(componentsByCategory).length === 0;
  }, [componentsByCategory]);


  return { componentsByCategory, isEmpty };
}
