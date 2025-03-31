import { builder } from '../core/Builder';
// Gestor de Plugins 
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: BuilderContext;
  constructor(context: BuilderContext) {
    this.context = context;
  }
  /*
   * Registra un nuevo plugin en el sistema
  */
  public registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin con ID ${plugin.id} ya está registrado. Será reemplazado.`);
      this.unregisterPlugin(plugin.id);
    }

    try {
      // Inicializar el plugin con el contexto del builder
      plugin.initialize(this.context);

      // Guardar referencia al plugin
      this.plugins.set(plugin.id, plugin);

      console.log(`Plugin "${plugin.name}" (${plugin.id}) registrado correctamente.`);
    } catch (error) {
      console.error(`Error al registrar plugin "${plugin.name}" (${plugin.id}):`, error);
    }
  }
  /*
   * Elimina un plugin del sistema
   */
  public unregisterPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);

    if (!plugin) {
      console.warn(`No existe plugin con ID ${pluginId}`);
      return;
    }

    try {
      // Dar oportunidad al plugin para limpiar recursos
      plugin.destroy();

      // Eliminar referencia
      this.plugins.delete(pluginId);

      console.log(`Plugin "${plugin.name}" (${plugin.id}) eliminado correctamente.`);
    } catch (error) {
      console.error(`Error al eliminar plugin "${plugin.name}" (${plugin.id}):`, error);
    }
  }
  /*
  * Obtiene un plugin por su ID
  */
  public getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }
  /*
   * Lista todos los plugins registrados
   */
  public getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
  /*
   * Carga plugins desde un directorio o URL
   */
  public async loadPluginsFromDirectory(directoryPath: string): Promise<void> {
    // Esta implementación dependería del entorno (navegador o Node.js)
    console.log(`Cargando plugins desde: ${directoryPath}`);
    // Aquí iría la implementación específica
  }
}
// Clase base para facilitar la creación de plugins
export abstract class BasePlugin {
  public id: string;
  public name: string;
  public version: string;
  protected context?: BuilderContext;

  constructor(id: string, name: string, version: string) {
    this.id = id;
    this.name = name;
    this.version = version;
  }
  public initialize(context: BuilderContext): void {
    this.context = context;
    this.onInitialize();
  }
  public destroy(): void {
    this.onDestroy();
    this.context = undefined;
  }
  protected abstract onInitialize(): void;
  protected abstract onDestroy(): void;
}
export const pluginManager = new PluginManager(builder);