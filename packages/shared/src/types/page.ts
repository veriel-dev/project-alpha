// shared/types/page.ts
import { Component } from './component';

/**
 * Represents a complete page in the web builder
 */
export interface Page {
  id: string;
  title: string;
  slug: string;
  rootComponent: Component;
  metadata: Record<string, string>;
}
