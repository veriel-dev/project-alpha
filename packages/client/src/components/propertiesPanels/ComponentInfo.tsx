import React from 'react';

interface ComponentInfoProps {
  type: string;
  id: string;
  label: string;
}

const ComponentInfo: React.FC<ComponentInfoProps> = ({ type, id, label }) => {
  return (
    <>
      <h3>
        {label} Properties
      </h3>
      <div className="component-info">
        <span className="component-type">{type}</span>
        <span className="component-id">{id}</span>
      </div>
    </>
  );
};

export default React.memo(ComponentInfo);