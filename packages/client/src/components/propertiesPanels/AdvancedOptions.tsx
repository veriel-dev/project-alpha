import React from 'react';

interface AdvancedOptionsProps {
  componentId: string;
  onDelete?: (componentId: string) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ componentId, onDelete }) => {
  const handleDelete = () => {
    const confirmDelete = window.confirm('¿Está seguro que desea eliminar este componente?');
    if (confirmDelete && onDelete) {
      onDelete(componentId);
    } else if (confirmDelete) {
      alert('Delete component functionality would be called here');
    }
  };

  return (
    <div className="advanced-section">
      <details>
        <summary>Advanced Options</summary>
        <div className="advanced-options">
          <div className="property-editor">
            <label>Component ID</label>
            <input
              type="text"
              value={componentId}
              disabled
              className="disabled"
            />
          </div>
          <div className="component-actions">
            <button
              className="delete-component-btn"
              onClick={handleDelete}
            >
              Delete Component
            </button>
          </div>
        </div>
      </details>
    </div>
  );
};

export default React.memo(AdvancedOptions);