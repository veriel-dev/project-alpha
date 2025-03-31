// shared/types/storage.ts
import { Page } from './page';

/**
 * Interface for storage providers that persist pages
 */
export interface StorageProvider {
  savePage(page: Page): Promise<void>;
  loadPage(id: string): Promise<Page>;
  listPages(): Promise<Array<{ id: string; title: string }>>;
  deletePage(id: string): Promise<void>;
}
