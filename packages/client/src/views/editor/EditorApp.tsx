import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import { ComponentPalette } from './ComponentPalette';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { builder } from '../../core/builder/Builder';
import { useToast } from '../../context/ToastContext';
import { Page } from '@web-builder/shared/src/types/page';
import { Component } from '@web-builder/shared/src/types/component';
import { pageService } from '../../services/pageService';
import { registerBaseComponents } from '../../components/baseComponents/config';

export const EditorApp: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'components' | 'properties'>('components');
  const { addToast } = useToast();

  // Aseguramos que los componentes básicos estén registrados
  useEffect(() => {
    registerBaseComponents();
  }, []);

  // Load or create page
  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        let page: Page;

        if (id) {
          // Load existing page
          page = await pageService.getPageById(id);
        } else {
          // Create new page
          page = {
            id: 'page_' + Date.now(),
            title: 'Nueva Página',
            slug: 'nueva-pagina',
            rootComponent: builder.createComponent('container', {
              style: {
                minHeight: '100vh',
                padding: '20px',
                backgroundColor: '#ffffff',
              },
            })!,
            metadata: {
              description: 'Una página creada con Web Builder',
              keywords: 'web, builder',
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
          };
        }

        setCurrentPage(page);
        builder.setCurrentPage(page);
      } catch (error) {
        addToast('error', 'Error al cargar la página');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, addToast]);

  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component);
    // Switch to properties tab automatically when a component is selected
    setActiveTab('properties');
  };

  const handleUpdateComponent = (updatedProps: Record<string, unknown>) => {
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
    }
  };

  const handleSavePage = async () => {
    if (!currentPage) return;

    try {
      // Update page metadata
      currentPage.metadata.updatedAt = new Date().toISOString();

      if (id) {
        await pageService.updatePage(id, currentPage);
      } else {
        const savedPage = await pageService.createPage(currentPage);
        // Update URL with new page ID without reloading
        window.history.pushState({}, '', `/editor/${savedPage.id}`);
      }

      addToast('success', 'Página guardada correctamente');
    } catch (error) {
      addToast('error', 'Error al guardar la página');
      console.error(error);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    if (!currentPage) return;

    // Here you would typically generate a preview URL
    // For this example, we'll just show a toast
    addToast('info', 'Funcionalidad de vista previa en desarrollo');
  };

  const handlePublish = async () => {
    if (!currentPage) return;

    try {
      // Update status to published
      const updatedPage = {
        ...currentPage,
        status: 'published',
        metadata: {
          ...currentPage.metadata,
          publishedAt: new Date().toISOString(),
        }
      };

      if (id) {
        await pageService.updatePage(id, updatedPage);
        setCurrentPage(updatedPage);
        addToast('success', 'Página publicada correctamente');
      } else {
        // Save first, then publish
        handleSavePage();
      }
    } catch (error) {
      addToast('error', 'Error al publicar la página');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Cargando editor...</div>;
  }

  if (!currentPage || !currentPage.rootComponent) {
    return (
      <div className="error-state">
        <div className="error-container">
          <h2>No se pudo cargar la página</h2>
          <p>No hay ninguna página seleccionada o el componente raíz no está disponible.</p>
          <button onClick={() => window.location.reload()} className="reload-button">
            Recargar la página
          </button>
        </div>
      </div>
    );
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-app">
        <header className="editor-header">
          <div className="editor-logo">MI WEB BUILDER</div>
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
            className="page-title-input"
            placeholder="Título de la página"
          />
          <div className="editor-actions">
            <button className="preview-button" onClick={handlePreview}>Vista previa</button>
            <button className="save-button" onClick={handleSavePage}>Guardar</button>
            <button className="publish-button" onClick={handlePublish}>Publicar</button>
          </div>
        </header>

        <div className="editor-tabs">
          <div
            className={`editor-tab ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => setActiveTab('components')}
          >
            Componentes
          </div>
          <div
            className={`editor-tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Propiedades
          </div>
        </div>

        <div className="editor-content">
          {/* Mobile view will show either the component palette or properties panel based on active tab */}
          <div className="component-palette" style={{ display: activeTab === 'components' ? 'block' : 'none' }}>
            <ComponentPalette />
          </div>

          <EditorCanvas
            rootComponent={currentPage.rootComponent}
            onSelectComponent={handleComponentSelect}
          />

          <div className="properties-panel" style={{ display: activeTab === 'properties' ? 'block' : 'none' }}>
            <PropertiesPanel
              component={selectedComponent}
              onUpdateProps={handleUpdateComponent}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};