import React from 'react';
import { PropertiesPanelProps } from './types';
import usePropertyValues from './hooks/usePropertyValues';
import usePropertyEditors from './hooks/usePropertyEditors';
import EmptyState from './EmptyState';
import ComponentInfo from './ComponentInfo';
import PropertyGroups from './PropertyGroups';
import AdvancedOptions from './AdvancedOptions';


export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  component,
  onUpdateProps,
  onDeleteComponent
}) => {
  const { values, errors, handleChange, handleBlur } = usePropertyValues({
    component,
    onUpdateProps
  });

  const { config, propertyGroups, componentLabel } = usePropertyEditors({
    component
  });

  if (!component || component.type === 'container-root') {
    return (
      <EmptyState />
    );
  }

  if (!config) {
    return (
      <div className="properties-panel-container">
        <h3>Properties</h3>
        <div className="empty-properties">
          Configuration for component type "{component.type}" not found
        </div>
      </div>
    );
  }

  return (

    <div className="properties-panel-container">
      <ComponentInfo
        type={component.type}
        id={component.id}
        label={componentLabel}
      />
      <PropertyGroups
        groups={propertyGroups}
        values={values}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <AdvancedOptions
        componentId={component.id}
        onDelete={onDeleteComponent}
      />
    </div >
  )
};