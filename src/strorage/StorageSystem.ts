// Interfaz para almacenamiento

export interface StorageOptions {
  type: 'local' | 'server' | 'cloud';
  serverUrl?: string;
  apiKey?: string;
}

// Factory para crear el proveedor de almacenamiento adecuado

export function createStorageProvider(options: StorageOptions): StorageProvider {
  switch (options.type) {
    case 'local':
      return new LocalStorageProvider();
    case 'server':
      return new ServerStorageProvider(options.serverUrl || '');
    case 'cloud':
      return new CloudStorageProvider(options.apiKey || '');
    default:
      return new LocalStorageProvider();
  }
}

// Implementación de almacenamiento local utilizando localStorage
export class LocalStorageProvider implements StorageProvider {

  private readonly STORAGE_KEY_PREFIX = 'web_builder_page_';
  private readonly INDEX_KEY = 'web_builder_page_index';

  public async savePage(page: Page): Promise<void> {
    // Guardar la página con su ID
    const key = this.STORAGE_KEY_PREFIX + page.id;
    localStorage.setItem(key, JSON.stringify(page));

    // Actualizar el índice de páginas
    const index = this.getPageIndex();

    if (!index.includes(page.id)) {
      index.push(page.id);
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(index));
    }
  }

  public async loadPage(id: string): Promise<Page> {
    const key = this.STORAGE_KEY_PREFIX + id;
    const pageData = localStorage.getItem(key);
    if (!pageData) throw new Error(`Página con ID ${id} no encontrada`);
    return JSON.parse(pageData);
  }
  public async listPages(): Promise<Array<{ id: string; title: string; }>> {
    const index = this.getPageIndex();
    const pages: Array<{ id: string; title: string }> = [];
    
    for (const id of index) {
      try {
        const page = await this.loadPage(id);
        pages.push({ id, title: page.title });
      } catch (error) {
        console.warn(`Error cargando página ${id}`, error);
      }
    }
    return pages;
  }
  public async deletePage(id: string): Promise<void> {
    const key = this.STORAGE_KEY_PREFIX + id;
    localStorage.removeItem(key);
    
    // Actualizar el índice
    const index = this.getPageIndex();
    const newIndex = index.filter(pageId => pageId !== id);
    localStorage.setItem(this.INDEX_KEY, JSON.stringify(newIndex));
  }

  private getPageIndex(): string[] {
    const indexData = localStorage.getItem(this.INDEX_KEY);
    return indexData ? JSON.parse(indexData) : [];
  }
}
// Implementación para almacenamiento en servidor
export class ServerStorageProvider implements StorageProvider {
  constructor(private baseUrl: string) {
    if (!baseUrl) {
      throw new Error('URL del servidor es requerida para ServerStorageProvider');
    }
  }

  public async savePage(page: Page): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pages/${page.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(page),
    });
    
    if (!response.ok) {
      throw new Error(`Error al guardar la página: ${response.statusText}`);
    }
  }
  public async loadPage(id: string): Promise<Page> {
    const response = await fetch(`${this.baseUrl}/api/pages/${id}`);
    
    if (!response.ok) throw new Error(`Error al cargar la página: ${response.statusText}`);
    
    return await response.json();
  }

  public async listPages(): Promise<Array<{ id: string; title: string }>> {
    const response = await fetch(`${this.baseUrl}/api/pages`);
    
    if (!response.ok) throw new Error(`Error al listar páginas: ${response.statusText}`);
    
    return await response.json();
  }
  public async deletePage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pages/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar la página: ${response.statusText}`);
    }
  }
}
// Implementación para almacenamiento en la nube (ejemplo con una API genérica)
export class CloudStorageProvider implements StorageProvider {
  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('API key es requerida para CloudStorageProvider');
    }
  }

  public async savePage(page: Page): Promise<void> {
    // Implementación específica para el servicio en la nube
    // Este es un ejemplo genérico
    console.log('Guardando en la nube', page);
    // Aquí iría la implementación real
  }

  public async loadPage(id: string): Promise<Page> {
    // Implementación específica para el servicio en la nube
    console.log('Cargando de la nube', id);
    // Aquí iría la implementación real
    throw new Error('Método no implementado');
  }

  public async listPages(): Promise<Array<{ id: string; title: string }>> {
    // Implementación específica para el servicio en la nube
    console.log('Listando páginas de la nube');
    // Aquí iría la implementación real
    return [];
  }

  public async deletePage(id: string): Promise<void> {
    // Implementación específica para el servicio en la nube
    console.log('Eliminando de la nube', id);
    // Aquí iría la implementación real
  }
}