import React from 'react';
import { PropertyEditor, PropertyValue, ValidationErrors } from './types';
import { getPropertyEditor } from './PropertyEditors';
import { getCurrentValue } from './utils/propertyHelpers';

interface PropertyGroupProps {
  groupName: string;
  editors: PropertyEditor[];
  values: Record<string, PropertyValue>;
  errors: ValidationErrors;
  onChange: (propName: string, value: PropertyValue, editorType: string) => void;
  onBlur: (propName: string, value: PropertyValue, editorType: string) => void;
}

const PropertyGroup: React.FC<PropertyGroupProps> = ({
  groupName,
  editors,
  values,
  errors,
  onChange,
  onBlur
}) => {
  return (
    <div className="property-group">
      <h4 className="property-group-title">{groupName}</h4>
      <div className="properties-list">
        {editors.map((editor) => {
          const EditorComponent = getPropertyEditor(editor.editorType);
          const value = getCurrentValue(editor.propName, values);
          const error = errors[editor.propName];

          return (
            <div key={editor.propName} className="property-editor">
              <label htmlFor={`prop-${editor.propName}`}>
                {editor.label}
                {editor.required && <span className="required-indicator">*</span>}
              </label>

              <EditorComponent
                propName={editor.propName}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={error}
                editor={editor}
              />

              {editor.description && (
                <div className="property-description">{editor.description}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PropertyGroupsProps {
  groups: Record<string, PropertyEditor[]>;
  values: Record<string, PropertyValue>;
  errors: ValidationErrors;
  onChange: (propName: string, value: PropertyValue, editorType: string) => void;
  onBlur: (propName: string, value: PropertyValue, editorType: string) => void;
}

const PropertyGroups: React.FC<PropertyGroupsProps> = ({
  groups,
  values,
  errors,
  onChange,
  onBlur
}) => {
  return (
    <>
      {Object.entries(groups).map(([groupName, editors]) => (
        <PropertyGroup
          key={groupName}
          groupName={groupName}
          editors={editors}
          values={values}
          errors={errors}
          onChange={onChange}
          onBlur={onBlur}
        />
      ))}
    </>
  );
};

export default React.memo(PropertyGroups);