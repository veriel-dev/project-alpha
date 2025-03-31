// shared/types/plugin.ts
import { BuilderContext } from './builder';
/**
 * Interface for plugins that extend the web builder functionality
 */
export interface Plugin {
  id: string;
  name: string;
  version: string;
  initialize(context: BuilderContext): void;
  destroy(): void;
}
