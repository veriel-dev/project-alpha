# ARQUITECTURA GENERAL DEL WEB BUILDER 
El sistema contará de los siguientes componentes principales:
- `Core Engine` - Motor central del sistema 
- `Component Registry` - Registro de componentes disponibles
- `Editor Interface` - Interfaz de edición visual drag-on-drop 
- `Rendering Engine` - Motor de renderizado para mostrar el contenido 
- `Plugin System` - Sistema de extensiones para amplicar funcionalidad 

```bash
web-builder/
├── src/
│   ├── core/             # Motor principal
│   ├── components/       # Componentes predefinidos
│   ├── editor/           # Interfaz del editor visual
│   ├── storage/          # Sistema de persistencia
│   ├── rendering/        # Motor de renderizado
│   ├── plugins/          # Sistema de plugins
│   └── utils/            # Utilidades generales
├── public/               # Archivos estáticos
├── server/               # Código del servidor
└── tsconfig.json         # Configuración de TypeScript
```

## Core Engine 

El core engine es el componente central del web builder. Es responsable de manejar toda la lógica principal del sistema, incluyendo el registro de componentes, la creación de instancias y la gestión de plugins. 

### Clase `WebBuilder`

```javascript
export class WebBuilder implements BuilderContext {
  private components: Map<string, ComponentConfig> = new Map();
  private propEditors: Map<string, any> = new Map();
  private hooks: Map<string, Function[]> = new Map();
  private plugins: Map<string, Plugin> = new Map();
  private currentPage: Page | null = null;
  private componentInstances: Map<string, Component> = new Map();

  constructor() {
    // Inicialización del constructor
  }
  
  // ...
}
```
### Variables de clase:
- `components:` Almacena todas las configuraciones de componentes registrados, indexadas por tipo.
- `propEditors:` Almacena editores de propiedades personalizados (por ejemplo, editores de color, selector de imágenes, etc.).
- `hooks:` Sistema de eventos para que diferentes partes del sistema se comuniquen.	
- `plugins:` Plugins cargados ene el sistema.
- `componentInstances:` Todas las instancias de componentes creadas, indexadas por ID.

### Métodos principales:
#### Registro de componentes:

```javascript
public registerComponent(config: ComponentConfig): void {
  this.components.set(config.type, config);
  this.invokeHook('componentRegistered', config);
}
```
Este método:
- Añade un nuevo tipo de componente al registro de componentes.
- Notifica a los observadores (a través de hooks) que se ha registrado un componente.

#### Sistema de Hooks (Eventos):

```javascript
public registerHook(hookName: string, callback: Function): void {
  if (!this.hooks.has(hookName)) {
    this.hooks.set(hookName, []);
  }
  this.hooks.get(hookName)!.push(callback);
}
public invokeHook(hookName: string, ...args: any[]): any[] {
  const hooks = this.hooks.get(hookName) || [];
  return hooks.map(hook => hook(...args));
}
```
Este sistema permite:
- Registrar funciones de callback para eventos específicos.
- Invocar todos los callbacks registrados para un evento, pasando parámetros. 
- Retornar un array con los resultados de todos los callbacks.

#### Sistema de Plugins:

```javascript
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
```
Estos métodos:

- Añaden o eliminan plugins del sistema.
- Inicializan los plugins con el contexto del builder.
- Permiten que los plugins liberen recuros cuando se eliminan.
- Notifican a observadores sobre cambios en los plugins.

#### Creación de Componentes:

```javascript
public createComponent(type: string, props: Record<string, any> = {}): Component | null {
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
      return null as any;
    }
  };

  this.componentInstances.set(component.id, component);
  this.invokeHook('componentCreated', component);
  return component;
}
```

Este método:
- Busca la configuración del tipo de componente solicitado.
- Combina las propiedades predeterminadas con las proporcionadas.
- Crea una nueva instancia del componente con ID único.
- Guarda la instancia en el registro de instancias.
- Notifica que se ha creado un componente.
- Devuelve la instancia del componente.

#### Métodos de utilidad:

```javascript
private generateUniqueId(): string {
  return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```
Este método:
- Genera IDs únicos para los componentes.
- Utiliza una combinación de timestamp y números aleatorios para evitar colisiones.

#### Patrón Singleton:

```javascript
// Exportar una instancia singleton
export const builder = new WebBuilder();
```

Al final del archivo, exportamos una instancia única del WebBuilder. Esto asegura que: 
- Solo exista una instancia del motor en toa la aplicación.
- Todos los módulos comaprten el mismo estado del builder.
- Se evitan problema de sincronización.

### Flujo de Trabajo del Core Engine 

- `Inicialización:` El sistema registra componentes y plugins base durante el arranque.
- `Creación de Página:`Cuando un usuario crea una página,se establece cómo página actual .
- `Edición:` El usuario añade componentes a la página, que se crean con el método `createComponent()`.
- `Actualización:` Las propiedades de los componentes se modifican a través de la interfaz de usuario.
- `Guardado:` La estructura de la página se serializa y se guarda en el sistema de almacenamiento.
- `Eventos:` Durante el proceso, los hooks permite que las diferentes partes del sistema reaccionen a los cambios.

---


## Sistema de Componentes 

El sistema de compoentnes es un elemento fundamental en nuestro web builder, ya que proporciona los bloques de construcción básicos que los usuarios pueden arrancar, solatar y configurar para crear sus páginas web. Vamos a analizar con detalle cómo está implementado: 

### Estructura General 

El sistema de componentes está implementado en el directorio `src/components/baseComponents` y consta de:
- `config`: Contiene la configuración de los componentes, incluyendo su etiqueta, categoría, icono, propiedades predeterminadas, editores de propiedades y si se permite o no añadir hijos.
- `reactComponents`: Contiene los componentes React que se utilizan para representar los componentes en el editor.

### Componentes básicos implemntados

#### Componente Contenedor
```javascript
// Componente de Contenedor
export const ContainerComponent: React.FC<{
  id: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <div 
      id={props.id} 
      className={`wb-container ${props.className || ''}`} 
      style={props.style}
    >
      {props.children}
    </div>
  );
};
```
Las características principales: 

- Funciona como un contenedor deiv que puede albergar otros componentes 
- Acepta estilos personalizados y clases CSS
- Agrega una clase específica`wb-container` para facilitart la estilización global 
- Permite componentes hijos anidados

#### Configuración del componente

```javascript
export const ContainerComponentConfig: ComponentConfig = {
  type: 'container',
  label: 'Contenedor',
  category: 'Layout',
  icon: 'box',
  defaultProps: {
    style: {
      padding: '20px',
      margin: '0px',
      minHeight: '100px',
      backgroundColor: '#ffffff',
    },
    className: '',
  },
  propEditors: [
    {
      propName: 'style.padding',
      label: 'Padding',
      editorType: 'text',
      defaultValue: '20px',
    },
    {
      propName: 'style.backgroundColor',
      label: 'Color de fondo',
      editorType: 'color',
      defaultValue: '#ffffff',
    },
    {
      propName: 'className',
      label: 'Clases CSS',
      editorType: 'text',
      defaultValue: '',
    },
  ],
  allowChildren: true,
};
```

Los detalles de la configuración del componente:
- `type`: Identificador único del tipo de componente.
- `label`: Nombre amigable para mostrar en la interfaz del editor.
- `category`: Agrupación para organizar componentes en la paleta
- `icon`: Referencia al icono a mostrar (se implementará en la UI)
- `defaultProps`: Valores inciales cuando se crea una instancia del componente
- `propEditors`: Configuración de los editores de propiedades que aparecerán en el panel de propiedades 
- `allowChildren`: Si se permite o no añadir hijos al componente

La misma explicación para los otros compoenntes básicos

### Registro de componentes 

```javascript
export function registerBaseComponents() {
  builder.registerComponent(ContainerComponentConfig);
  builder.registerComponent(TextComponentConfig);
  builder.registerComponent(ImageComponentConfig);
}
```

Esta función:
- Registra todos los componentes básicos en el sistema.
- Se llama durante la inicialización de la aplicación.
- Permite que el Core Engine conozca qué componentes están disponibles para el usuario 

### Características importantes del Sistema de Componentes 

#### Estructura Declarativa 
Cada componente tiene una clara separación entre:
- El componente React 
- La configuración de metadatos para el Editor 

#### Edición de propiedades detallada 

Los `propEditors` espeifica:
- Qué propiedades puedens er editadas 
- Qué tipo de editor se usa para cada propiedad
- Valores por defecto para cada propiedad 
- Opciones para propiedades con selección limitada 
- También presenta notación de punto para propiedades anidadas del componente

#### Categorización 
Los componentes se agrupan en categorías lógicas: 
- `Layout`: Componentes para crear estructuras de páginas web
- `Básicos`: Componentes básicos para crear contenido

#### Extensibilidad 
El sistema está diseñado para ser fácilemente extendido con nuevos componentes: 
- Crear el componente React
- Definir su configuración
- Registrarlo enm el Core Engine


```javascript
mi-web-builder/
│
├── .gitignore                # Archivos ignorados por Git
├── package.json              # Configuración de npm
├── tsconfig.json             # Configuración de TypeScript
├── tsconfig.server.json      # Configuración de TS para el servidor
├── webpack.config.js         # Configuración de Webpack
│
├── public/                   # Archivos estáticos
│   ├── index.html            # Plantilla HTML base
│   ├── favicon.ico           # Favicon
│   └── assets/               # Otros activos estáticos
│
├── src/                      # Código fuente del frontend
│   ├── index.tsx             # Punto de entrada
│   ├── App.tsx               # Componente principal
│   ├── types.ts              # Definiciones de tipos globales
│   │
│   ├── core/                 # Motor principal del web builder
│   │   ├── Builder.ts        # Clase principal del builder
│   │   └── ...
│   │
│   ├── components/           # Componentes React
│   │   ├── BaseComponents.tsx # Componentes base
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   │
│   ├── editor/               # Componentes del editor visual
│   │   ├── EditorApp.tsx
│   │   ├── ComponentPalette.tsx
│   │   ├── EditorCanvas.tsx
│   │   ├── PropertiesPanel.tsx
│   │   └── EditorApp.css
│   │
│   ├── storage/              # Sistema de persistencia
│   │   └── StorageSystem.ts
│   │
│   ├── rendering/            # Motor de renderizado
│   │   └── RenderEngine.tsx
│   │
│   ├── plugins/              # Sistema de plugins
│   │   └── PluginSystem.ts
│   │
│   ├── context/              # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── pages/                # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Editor.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── PageList.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/             # Servicios para API, etc.
│   │   ├── api.ts
│   │   └── pageService.ts
│   │
│   ├── styles/               # Estilos globales
│   │   └── global.css
│   │
│   └── utils/                # Utilidades
│       └── helpers.ts
│
├── server/                   # Código del servidor (backend)
│   ├── index.ts              # Punto de entrada del servidor
│   ├── config.ts             # Configuración
│   │
│   ├── models/               # Modelos de datos (Mongoose)
│   │   ├── Page.ts
│   │   └── User.ts
│   │
│   ├── routes/               # Rutas de API
│   │   ├── pageRoutes.ts
│   │   ├── assetRoutes.ts
│   │   └── userRoutes.ts
│   │
│   └── middleware/           # Middleware
│       └── auth.ts
│
├── dist/                     # Código compilado (generado)
│   ├── client/               # Frontend compilado
│   └── server/               # Backend compilado
│
└── uploads/                  # Carpeta para archivos subidos
```
