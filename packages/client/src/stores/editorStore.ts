// src/stores/editorStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Component } from '@web-builder/shared/src/types/component';
import { Page } from '@web-builder/shared/src/types/page';
import { builder } from '../core/builder/Builder';
import { pageService } from '../services/pageService';

// Define nombres de acciones para el devtools
const actionNames = {
  setCurrentPage: 'editor/setCurrentPage',
  selectComponent: 'editor/selectComponent',
  setLoading: 'editor/setLoading',
  setSaving: 'editor/setSaving',
  setActiveTab: 'editor/setActiveTab',
  togglePreviewMode: 'editor/togglePreviewMode',
  toggleSidebar: 'editor/toggleSidebar',
  setHasUnsavedChanges: 'editor/setHasUnsavedChanges',
  createNewPage: 'editor/createNewPage',
  loadPage: 'editor/loadPage',
  updatePageTitle: 'editor/updatePageTitle',
  savePage: 'editor/savePage',
  publishPage: 'editor/publishPage',
  updateComponent: 'editor/updateComponent',
};

interface EditorState {
  // Estado
  currentPage: Page | null;
  selectedComponent: Component | null;
  loading: boolean;
  saving: boolean;
  activeTab: 'components' | 'properties';
  previewMode: boolean;
  isSidebarOpen: boolean;
  hasUnsavedChanges: boolean;

  // Acciones
  setCurrentPage: (page: Page) => void;
  selectComponent: (component: Component | null) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setActiveTab: (tab: 'components' | 'properties') => void;
  togglePreviewMode: () => void;
  toggleSidebar: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;

  // Operaciones de página
  createNewPage: () => Page;
  loadPage: (id: string | undefined) => Promise<void>;
  updatePageTitle: (title: string) => void;
  savePage: (navigate: (path: string, options?: { replace: boolean }) => void) => Promise<void>;
  publishPage: (navigate: (path: string, options?: { replace: boolean }) => void) => Promise<void>;

  // Operaciones de componente
  updateComponent: (updatedProps: Record<string, unknown>) => void;
}

const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        currentPage: null,
        selectedComponent: null,
        loading: false,
        saving: false,
        activeTab: 'components',
        previewMode: false,
        isSidebarOpen: true,
        hasUnsavedChanges: false,

        // Setters básicos con nombres de acciones para DevTools
        setCurrentPage: (page) => set({ currentPage: page }, false, { type: actionNames.setCurrentPage }),
        selectComponent: (component) => {
          set({ selectedComponent: component }, false, { type: actionNames.selectComponent });

          // Cambiar a la pestaña de propiedades en móvil cuando se selecciona un componente
          if (component && window.innerWidth < 768) {
            set({ activeTab: 'properties' }, false, { type: actionNames.setActiveTab });
          }
        },
        setLoading: (loading) => set({ loading }, false, { type: actionNames.setLoading }),
        setSaving: (saving) => set({ saving }, false, { type: actionNames.setSaving }),
        setActiveTab: (tab) => set({ activeTab: tab }, false, { type: actionNames.setActiveTab }),
        togglePreviewMode: () => set((state) => ({ previewMode: !state.previewMode }), false, { type: actionNames.togglePreviewMode }),
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, { type: actionNames.toggleSidebar }),
        setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }, false, { type: actionNames.setHasUnsavedChanges }),

        // Operaciones de página
        createNewPage: () => {
          const newPage = {
            id: 'page_' + Date.now(),
            title: 'New Page',
            slug: 'new-page-' + Date.now(),
            status: 'draft',
            rootComponent: builder.createComponent('container-root', {
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

          return newPage;
        },

        loadPage: async (id) => {
          const { createNewPage, setLoading, setCurrentPage, setHasUnsavedChanges } = get();

          try {
            setLoading(true);

            let page: Page | null = null;

            if (id) {
              try {
                page = await pageService.getPageById(id);
              } catch (error) {
                console.error('Error loading page:', error);
                // Manejar error aquí - podría hacer uso de un store de notificaciones
                page = null;
              }
            }

            // Si no se encontró la página o no se proporcionó ID, crear una nueva
            const finalPage = page || createNewPage();

            setCurrentPage(finalPage);
            builder.setCurrentPage(finalPage);
            setHasUnsavedChanges(false);
          } catch (error) {
            console.error('Error in loadPage:', error);
            // Manejar error aquí
          } finally {
            setLoading(false);
          }
        },

        updatePageTitle: (newTitle) => {
          const { currentPage } = get();

          if (!currentPage) return;

          // Generar slug a partir del título
          const slug = newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          set(
            (state) => ({
              currentPage: {
                ...state.currentPage!,
                title: newTitle,
                slug
              },
              hasUnsavedChanges: true
            }),
            false,
            { type: actionNames.updatePageTitle, title: newTitle }
          );
        },

        savePage: async (navigate) => {
          const { currentPage, setSaving, setCurrentPage, setHasUnsavedChanges } = get();

          if (!currentPage) return;

          try {
            setSaving(true);

            // Actualizar metadatos de la página
            const updatedPage = {
              ...currentPage,
              metadata: {
                ...currentPage.metadata,
                updatedAt: new Date().toISOString(),
              }
            };

            if (currentPage.id.startsWith('page_')) {
              // Es una nueva página que no se ha guardado en la base de datos
              const savedPage = await pageService.createPage(updatedPage);
              setCurrentPage(savedPage);

              // Actualizar URL con el nuevo ID sin recargar la página
              navigate(`/editor/${savedPage.id}`, { replace: true });

              // Mostrar notificación - idealmente a través de un store de notificaciones
            } else {
              // Página existente
              await pageService.updatePage(currentPage.id, updatedPage);
              setCurrentPage(updatedPage);

              // Mostrar notificación
            }

            setHasUnsavedChanges(false);
          } catch (error) {
            console.error('Error saving page:', error);
            // Manejar error aquí
          } finally {
            setSaving(false);
          }
        },

        publishPage: async (navigate) => {
          const { currentPage, setSaving, setCurrentPage, setHasUnsavedChanges } = get();

          if (!currentPage) return;

          try {
            setSaving(true);

            // Actualizar estado a publicado
            const updatedPage = {
              ...currentPage,
              status: 'published',
              metadata: {
                ...currentPage.metadata,
                publishedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            };

            if (currentPage.id.startsWith('page_')) {
              // Es una nueva página que no se ha guardado en la base de datos
              const savedPage = await pageService.createPage(updatedPage);
              setCurrentPage(savedPage);

              // Actualizar URL con el nuevo ID sin recargar la página
              navigate(`/editor/${savedPage.id}`, { replace: true });

              // Mostrar notificación
            } else {
              // Página existente
              await pageService.updatePage(currentPage.id, updatedPage);
              setCurrentPage(updatedPage);

              // Mostrar notificación
            }

            setHasUnsavedChanges(false);
          } catch (error) {
            console.error('Error publishing page:', error);
            // Manejar error aquí
          } finally {
            setSaving(false);
          }
        },

        // Operaciones de componente
        updateComponent: (updatedProps) => {
          const { selectedComponent, currentPage } = get();

          if (!selectedComponent) return;

          // Actualizar propiedades del componente
          selectedComponent.props = {
            ...selectedComponent.props,
            ...updatedProps,
          };

          // Forzar actualización de estado
          set(
            (state) => ({
              selectedComponent: { ...state.selectedComponent! },
              currentPage: currentPage ? { ...currentPage } : null,
              hasUnsavedChanges: true
            }),
            false,
            { type: actionNames.updateComponent, props: Object.keys(updatedProps).join(', ') }
          );
        },
      }),
      {
        name: 'editor-storage',
        // Solo persistir algunos valores
        partialize: (state) => ({
          activeTab: state.activeTab,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    {
      name: 'Editor Store',
      enabled: import.meta.env.DEV,
      anonymousActionType: 'Unknown Action', // Etiqueta para acciones sin nombre específico
    }
  )
);

export default useEditorStore;