// shared/types/builder.ts
import { ComponentConfig, Component } from './component';
import { Page } from './page';

// Tipo más específico para callbacks de hooks

/**
 * Context provided to plugins and components for interacting with the builder
 */
export interface BuilderContext {
  registerComponent(config: ComponentConfig): void;
  registerPropEditor(type: string, editor: {}): void;
  registerHook(hookName: string, callback: Function): void;
  getComponent(id: string): Component | null;
  getCurrentPage(): Page;
}
