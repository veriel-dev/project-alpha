import { Component, ComponentConfig } from "@web-builder/shared/src/types/component";
import { Page } from "@web-builder/shared/src/types/page";
import { BuilderContext } from "@web-builder/shared/src/types/builder";
import { Plugin } from "@web-builder/shared/src/types/plugin";

export class WebBuilder implements BuilderContext {
  private components: Map<string, ComponentConfig> = new Map();
  private propEditors: Map<string, unknown> = new Map();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private hooks: Map<string, Function[]> = new Map();
  private plugins: Map<string, Plugin> = new Map();
  private currentPage: Page | null = null;
  private componentInstances: Map<string, Component> = new Map();

  constructor() { }
  // API principal del constructor - Register
  public registerComponent(config: ComponentConfig): void {
    this.components.set(config.type, config);
    this.invokeHook('componentRegistered', config);
  }
  public registerPropEditor(type: string, editor: unknown): void {
    this.propEditors.set(type, editor);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public registerHook(hookName: string, callback: Function): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)?.push(callback);
  }
  public registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    plugin.initialize(this);
    this.invokeHook('pluginRegistered', plugin);
  }
  public unregisterPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.destroy();
      this.plugins.delete(pluginId);
      this.invokeHook('pluginUnregistered', pluginId);
    }
  }
  public createComponent(type: string, props: Record<string, unknown> = {}): Component | null {
    const config = this.components.get(type);
    if (!config) return null;

    // Combinar las props predeterminadas con las props proporcionadas
    const mergedProps = { ...config.defaultProps, ...props };

    const component: Component = {
      id: this.generateUniqueId(),
      type,
      label: config.label,
      props: mergedProps,
      children: [],
      render: () => {
        // Este método se implementará más adelante
        // Devolverá el JSX para renderizar este componente
        return null as unknown;
      }
    };
    this.componentInstances.set(component.id, component);
    this.invokeHook('componentCreated', component);
    return component;
  }
  public invokeHook(hookName: string, ...args: unknown[]): void {
    const hooks = this.hooks.get(hookName) || [];
    return hooks.forEach(hook => hook(...args));
  }
  public getComponent(id: string): Component | null {
    return this.componentInstances.get(id) || null;
  }
  public setCurrentPage(page: Page): void {
    this.currentPage = page;
    this.invokeHook('pageChanged', page);
  }
  public getCurrentPage(): Page {
    if (!this.currentPage) throw new Error('No hay una página actual seleccionada');
    return this.currentPage;
  }
  public getAllRegisteredComponentTypes(): ComponentConfig[] {
    return Array.from(this.components.values());
  }
  // Métodos de utilidad
  private generateUniqueId(): string {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

export const builder = new WebBuilder();