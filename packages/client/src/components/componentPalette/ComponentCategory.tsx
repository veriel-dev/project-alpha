import { memo } from "react";
import { ComponentConfig } from "@web-builder/shared/src/types";
import { DraggableComponentItem } from "../draggableComponentItem";


interface ComponentCategoryProps {
  category: string;
  components: ComponentConfig[];
}
export const ComponentCategory = memo(({ category, components }: ComponentCategoryProps) => {
  if (category === 'main') return null;
  return (
    <div className="component-category">
      <h4>{category}</h4>
      <div className="component-list">
        {components.map(comp => (
          <DraggableComponentItem key={comp.type} componentType={comp} />
        ))}
      </div>
    </div>
  )
})
