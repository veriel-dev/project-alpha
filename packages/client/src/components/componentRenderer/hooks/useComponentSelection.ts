/* Hook para manejar la selección y scroll de componentes */
import { useRef, useEffect } from 'react';
import { Component } from '@web-builder/shared/src/types/component';



interface UseComponentSelectionParams {
  component: Component;
  onSelectComponent: (component: Component) => void;
  isSelected: boolean;
}

/* 
* Hook personalizado para manejar la selección y el scroll automático
*/

const useComponentSelection = ({ component, onSelectComponent, isSelected }: UseComponentSelectionParams) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectComponent(component);
  };
  return {
    componentRef,
    handleClick
  };
}
export default useComponentSelection;