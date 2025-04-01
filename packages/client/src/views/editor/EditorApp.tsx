// src/components/editor/EditorApp.tsx
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
// import { ComponentPalette } from './ComponentPalette';
import { ComponentPalette } from '../../components/componentPalette/ComponentPalette';
import { EditorCanvas } from './EditorCanvas';
import { PagePreview } from '../../components/PagePreview';
import useEditorStore from '../../stores/editorStore';
import { registerBaseComponents } from '../../components/baseComponents/config';
import { Component } from '@web-builder/shared/src/types';
import useToast from '../../stores/toastStore';
import { PropertiesPanel } from '../../components/propertiesPanels/PropertiesPanel';

export const EditorApp: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Obtener estado y acciones del store
  const {
    currentPage,
    selectedComponent,
    loading,
    saving,
    activeTab,
    previewMode,
    isSidebarOpen,
    hasUnsavedChanges,

    selectComponent,
    setActiveTab,
    updateComponent,
    updatePageTitle,
    togglePreviewMode,
    toggleSidebar,
    loadPage,
    savePage,
    publishPage,
  } = useEditorStore();

  // Efecto para cargar la página
  useEffect(() => {
    loadPage(id).catch(error => {
      console.error('Error loading page:', error);
      addToast('error', 'Error loading the page');
    });
  }, [id, loadPage, addToast]);

  // Efecto para preguntar antes de salir con cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    registerBaseComponents();
  }, []);

  // Métodos de manejo de eventos pero ahora más simples y delegando al store
  const handleComponentSelect = (component: Component) => {
    selectComponent(component);
  };

  const handleUpdateComponent = (updatedProps: Record<string, unknown>) => {
    updateComponent(updatedProps);
  };

  const handleTitleChange = (newTitle: string) => {
    updatePageTitle(newTitle);
  };

  const handleSavePage = async () => {
    try {
      await savePage(navigate);
      addToast('success', 'Page saved successfully');
    } catch (error) {
      console.error('Error saving page:', error);
      addToast('error', 'Error saving the page. Please try again.');
    }
  };

  const handlePublish = async () => {
    try {
      await publishPage(navigate);
      addToast('success', 'Page published successfully');
    } catch (error) {
      console.error('Error publishing page:', error);
      addToast('error', 'Error publishing the page. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  // Error state
  if (!currentPage || !currentPage.rootComponent) {
    return (
      <div className="error-state">
        <div className="error-container">
          <h2>Could not load page</h2>
          <p>The page or root component could not be loaded. Please try again or create a new page.</p>
          <button onClick={() => navigate('/pages')} className="reload-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  // Preview mode
  if (previewMode) {
    return (
      <div className="preview-mode">
        <div className="preview-header">
          <button onClick={togglePreviewMode} className="preview-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Exit Preview
          </button>
          <div className="preview-title">{currentPage.title} - Preview</div>
          <div className="preview-actions">
            <button onClick={handleSavePage} className="preview-save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="preview-content">
          <PagePreview page={currentPage} />
        </div>
      </div>
    );
  }

  // Main editor view
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-app">
        <header className="editor-header">
          <div className="editor-logo">
            <button onClick={toggleSidebar} className="sidebar-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span>Web Builder</span>
          </div>

          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="page-title-input"
            placeholder="Enter page title"
          />

          <div className="editor-actions">
            <button
              className="preview-button"
              onClick={togglePreviewMode}
              title="Preview (Ctrl+P)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Preview</span>
            </button>

            <button
              className="save-button"
              onClick={handleSavePage}
              disabled={saving}
              title="Save (Ctrl+S)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
              className="publish-button"
              onClick={handlePublish}
              disabled={saving}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2v20h-20v-20h20z"></path>
                <path d="M7 2v20"></path>
                <path d="M17 2v20"></path>
                <path d="M2 12h20"></path>
                <path d="M2 7h5"></path>
                <path d="M2 17h5"></path>
                <path d="M17 17h5"></path>
                <path d="M17 7h5"></path>
              </svg>
              Publish
            </button>
          </div>
        </header>

        <div className="editor-tabs">
          <div
            className={`editor-tab ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => setActiveTab('components')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Components
          </div>
          <div
            className={`editor-tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Properties
          </div>
        </div>

        <div className="editor-content">
          {/* Mobile view: show either components or properties based on active tab */}
          <div
            className="component-palette"
            style={{
              display: window.innerWidth < 768 ? (activeTab === 'components' ? 'block' : 'none') : 'block',
              width: isSidebarOpen ? 'auto' : '0'
            }}
          >
            <ComponentPalette />
          </div>

          <EditorCanvas
            rootComponent={currentPage.rootComponent}
            onSelectComponent={handleComponentSelect}
            selectedComponent={selectedComponent}
          />

          <div
            className="properties-panel"
            style={{
              display: window.innerWidth < 768 ? (activeTab === 'properties' ? 'block' : 'none') : 'block'
            }}
          >
            <PropertiesPanel
              component={selectedComponent}
              onUpdateProps={handleUpdateComponent}
            />
          </div>
        </div>

        {/* Page change indicator */}
        {hasUnsavedChanges && (
          <div className="unsaved-changes-indicator">
            <div className="unsaved-changes-text">
              You have unsaved changes
            </div>
            <button onClick={handleSavePage} className="save-changes-btn">
              Save Now
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};