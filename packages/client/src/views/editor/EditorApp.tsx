import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentPalette } from './ComponentPalette';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { builder } from '../../core/builder/Builder';

export const EditorApp = () => {
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)

  // Cargar página inicial o crear una página en blanco
  useEffect(() => {
    // Aquí se podría cargar una página existente
    const newPage: Page = {
      id: 'page_' + Date.now(),
      title: 'Nueva Página',
      slug: 'nueva-pagina',
      rootComponent: builder.createComponent('container', {
        style: {
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f5f5f5',
        },
      })!,
      metadata: {
        description: 'Una página creada con mi Web Builder',
        keywords: 'web, builder, typescript',
      },
    };

    setCurrentPage(newPage);
    builder.setCurrentPage(newPage);
  }, []);

  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component);
  };
  const handleUpdateComponent = (updatedProps: Record<string, unknown>) => {
    if (!selectedComponent) return;

    // Actualizar props del componente seleccionado
    selectedComponent.props = {
      ...selectedComponent.props,
      ...updatedProps,
    };

    // Forzar actualización del estado
    setSelectedComponent({ ...selectedComponent });
    setCurrentPage({ ...currentPage! });
  };
  const handleSavePage = async () => {
    // Aquí se implementaría la lógica para guardar la página
    console.log('Guardando página:', currentPage);
    alert('Página guardada correctamente');
  };

  if (!currentPage) {
    return <div>Cargando editor...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-app">
        <header className="editor-header">
          <div className="logo">MI WEB BUILDER</div>
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
            className="page-title-input"
          />
          <div className="editor-actions">
            <button className="preview-button">Vista previa</button>
            <button className="save-button" onClick={handleSavePage}>Guardar</button>
            <button className="publish-button">Publicar</button>
          </div>
        </header>

        <div className="editor-content">
          <ComponentPalette />

          <EditorCanvas
            rootComponent={currentPage.rootComponent}
            onSelectComponent={handleComponentSelect}
          />

          <PropertiesPanel
            component={selectedComponent}
            onUpdateProps={handleUpdateComponent}
          />
        </div>
      </div>
    </DndProvider>
  )
}
