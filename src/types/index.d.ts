
// Interfaz base para cualquier componente en el sistema
interface Component {
  id: string;
  type: string;
  label: string;
  props: Record<string, any>;
  children: Component[];
  render(): JSX.Element;
}

// Interfaz para la configuración de un componente en el editor
interface ComponentConfig {
  type: string;
  label: string;
  category: string;
  icon: string;
  defaultProps: Record<string, any>;
  propEditors: PropEditor[];
  allowChildren: boolean;
  maxChildren?: number;
}
// Interfaz para los editores de propiedades 
interface PropEditor {
  propName: string;
  label: string;
  editorType: 'text' | 'number' | 'select' | 'color' | 'image' | 'toggle';
  options?: Array<{value: any, label: string}>;
  defaultValue: any;
}

// Interfaz para una página completa
interface Page {
  id: string;
  title: string;
  slug: string;
  rootComponent: Component;
  metadata: Record<string, any>;
}
// Interfaz para el sistema de almacenamiento
interface StorageProvider {
  savePage(page: Page): Promise<void>;
  loadPage(id: string): Promise<Page>;
  listPages(): Promise<Array<{id: string, title: string}>>;
  deletePage(id: string): Promise<void>;
}
// Interfaz para plugins
interface Plugin {
  id: string;
  name: string;
  version: string;
  initialize(context: BuilderContext): void;
  destroy(): void;
}

// Contexto del constructor disponible para plugins y componentes
interface BuilderContext {
  registerComponent(config: ComponentConfig): void;
  registerPropEditor(type: string, editor: any): void;
  registerHook(hookName: string, callback: Function): void;
  getComponent(id: string): Component | null;
  getCurrentPage(): Page;
}
