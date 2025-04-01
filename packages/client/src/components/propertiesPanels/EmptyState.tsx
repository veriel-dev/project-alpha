import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="properties-panel-container">
      <h3>Properties</h3>
      <div className="empty-properties">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Select a component to edit its properties</p>
      </div>
    </div>
  );
};

export default React.memo(EmptyState);