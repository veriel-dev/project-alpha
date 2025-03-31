import React, { useEffect, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import { ComponentPalette } from './ComponentPalette';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { builder } from '../../core/builder/Builder';
import { useToast } from '../../context/ToastContext';
import { Page } from '@web-builder/shared/src/types/page';
import { Component } from '@web-builder/shared/src/types/component';
import { pageService } from '../../services/pageService';
import { registerBaseComponents } from '../../components/baseComponents/config';
import { PagePreview } from '../../components/PagePreview';

export const EditorApp: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'properties'>('components');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { addToast } = useToast();

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Warn user before leaving if there are unsaved changes
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

  // Ensure components are registered
  useEffect(() => {
    registerBaseComponents();
  }, []);

  // Helper function to create a new page
  const createNewPage = useCallback(() => {
    return {
      id: 'page_' + Date.now(),
      title: 'New Page',
      slug: 'new-page-' + Date.now(),
      status: 'draft',
      rootComponent: builder.createComponent('container', {
        style: {
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#ffffff',
        },
      })!,
      metadata: {
        description: 'A page created with Web Builder',
        keywords: 'web, builder',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }, []);

  // Load or create page
  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        let page: Page;

        if (id) {
          // Load existing page
          try {
            page = await pageService.getPageById(id);
          } catch (error) {
            console.error('Error loading page:', error);
            addToast('error', 'Page not found or could not be loaded');

            // Create a new page as fallback
            page = createNewPage();
          }
        } else {
          // Create new page
          page = createNewPage();
        }

        setCurrentPage(page);
        builder.setCurrentPage(page);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error in loadPage:', error);
        addToast('error', 'Error loading the page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, addToast, createNewPage]);

  // Select component
  const handleComponentSelect = useCallback((component: Component) => {
    setSelectedComponent(component);
    // Switch to properties tab automatically when a component is selected on mobile
    if (window.innerWidth < 768) {
      setActiveTab('properties');
    }
  }, []);

  // Update component properties
  const handleUpdateComponent = useCallback((updatedProps: Record<string, unknown>) => {
    if (!selectedComponent) return;

    // Update component props
    selectedComponent.props = {
      ...selectedComponent.props,
      ...updatedProps,
    };

    // Force state update
    setSelectedComponent({ ...selectedComponent });

    if (currentPage) {
      setCurrentPage({ ...currentPage });
      setHasUnsavedChanges(true);
    }
  }, [selectedComponent, currentPage]);

  // Handle page title change
  const handleTitleChange = useCallback((newTitle: string) => {
    if (!currentPage) return;

    // Update slug based on title
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setCurrentPage({
      ...currentPage,
      title: newTitle,
      slug,
    });

    setHasUnsavedChanges(true);
  }, [currentPage]);

  // Save page
  const handleSavePage = useCallback(async () => {
    if (!currentPage) return;

    try {
      setSaving(true);

      // Update page metadata
      const updatedPage = {
        ...currentPage,
        metadata: {
          ...currentPage.metadata,
          updatedAt: new Date().toISOString(),
        }
      };

      if (id) {
        await pageService.updatePage(id, updatedPage);
        setCurrentPage(updatedPage);
        addToast('success', 'Page saved successfully');
      } else {
        const savedPage = await pageService.createPage(updatedPage);
        setCurrentPage(savedPage);

        // Update URL with new page ID without reloading
        navigate(`/editor/${savedPage.id}`, { replace: true });

        addToast('success', 'Page created successfully');
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving page:', error);
      addToast('error', 'Error saving the page. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [currentPage, id, addToast, navigate]);

  // Toggle preview mode
  const handleTogglePreview = useCallback(() => {
    setPreviewMode(prev => !prev);
  }, []);

  // Publish page
  const handlePublish = useCallback(async () => {
    if (!currentPage) return;

    try {
      setSaving(true);

      // Update status to published
      const updatedPage = {
        ...currentPage,
        status: 'published',
        metadata: {
          ...currentPage.metadata,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      };

      if (id) {
        await pageService.updatePage(id, updatedPage);
        setCurrentPage(updatedPage);
        addToast('success', 'Page published successfully');
      } else {
        // Save first, then publish
        const savedPage = await pageService.createPage({
          ...updatedPage,
          id: 'page_' + Date.now(), // Ensure we have an ID
        });

        setCurrentPage(savedPage);
        navigate(`/editor/${savedPage.id}`, { replace: true });

        addToast('success', 'Page created and published');
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error publishing page:', error);
      addToast('error', 'Error publishing the page. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [currentPage, id, addToast, navigate]);

  // Toggle sidebar on mobile
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save on Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSavePage();
      }

      // Toggle preview on Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleTogglePreview();
      }

      // Escape from preview mode
      if (e.key === 'Escape' && previewMode) {
        setPreviewMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSavePage, handleTogglePreview, previewMode]);

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
          <button onClick={handleTogglePreview} className="preview-close-btn">
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
              onClick={handleTogglePreview}
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
              display: window.innerWidth < 768 ? (activeTab === 'components' ? 'block' : 'none') : 'block'
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