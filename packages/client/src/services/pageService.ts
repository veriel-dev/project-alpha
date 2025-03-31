import { api } from './api';

// Servicio para gestionar páginas
export const pageService = {
  // Obtener todas las páginas
  getAllPages: async (): Promise<Page[]> => {
    const response = await api.get('/pages');
    return response.data;
  },

  // Obtener página por ID
  getPageById: async (id: string): Promise<Page> => {
    const response = await api.get(`/pages/${id}`);
    return response.data;
  },

  // Crear nueva página
  createPage: async (pageData: Page): Promise<Page> => {
    const response = await api.post('/pages', pageData);
    return response.data;
  },

  // Actualizar página
  updatePage: async (id: string, pageData: Page): Promise<Page> => {
    const response = await api.put(`/pages/${id}`, pageData);
    return response.data;
  },

  // Eliminar página
  deletePage: async (id: string): Promise<void> => {
    await api.delete(`/pages/${id}`);
  },
};