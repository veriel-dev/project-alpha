import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { builder } from '../core/Builder';


interface RenderOptions {
  includeEditorMetadata?: boolean;
  optimizeForProduction?: boolean;
  addScripts?: boolean;
}

export class RenderEngine {
  /* 
   * Renderiza una página completa a HTML  
  */
  public renderPageToHtml(page: Page, options: RenderOptions = {}): string {
    const { includeEditorMetadata = false, optimizeForProduction = false, addScripts = true } = options;
    const htmlStructure = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${page.title}</title>
          <meta name="description" content="${page.metadata.description || ''}">
          <meta name="keywords" content="${page.metadata.keywords || ''}">
          ${this.generateStyles(page, optimizeForProduction)}
          ${includeEditorMetadata ? `<meta name="generator" content="Web Builder TypeScript">` : ''}
        </head>
        <body>
          <div id="page-root">${this.renderComponentToHtml(page.rootComponent, { includeEditorMetadata })}</div>
          ${addScripts ? this.generateScripts(page, optimizeForProduction) : ''}
        </body>
      </html>
    `;
    
    return htmlStructure;
  }
  /*
   * Renderiza un componente individual a HTML
  */
  public renderComponentToHtml(component: Component, options: RenderOptions = {}): string {
    const { includeEditorMetadata = false } = options;
    // Añadir atributos de editor si es necesario
    const editorProps = includeEditorMetadata ? {
      'data-component-id': component.id,
      'data-component-type': component.type,
    } : {};
    // Renderizar el componente basado en su tipo
    switch (component.type) {
      case 'container': {
        const containerProps = {
          id: component.id,
          className: `wb-container ${component.props.className || ''}`,
          style: component.props.style,
          ...editorProps,
        };
        // Renderizar hijos recursivamente
        const childrenHtml = (component.children || []).map(child => 
          this.renderComponentToHtml(child, options)).join('');
        
        const containerElement = React.createElement('div', { ...containerProps }, 
          React.createElement('div', { dangerouslySetInnerHTML: { __html: childrenHtml } }));
        
        return ReactDOMServer.renderToString(containerElement);
      }
      case 'text': {
        const { tag = 'p', content, style } = component.props;
        const textProps = {
          id: component.id,
          className: 'wb-text',
          style,
          ...editorProps,
        };
        
        const textElement = React.createElement(tag, textProps, content);
        return ReactDOMServer.renderToString(textElement);
      }
      case 'image': {
        const { src, alt, style } = component.props;
        const imageProps = {
          id: component.id,
          className: 'wb-image',
          src,
          alt,
          style,
          ...editorProps,
        };
        
        const imageElement = React.createElement('img', {...imageProps});
        return ReactDOMServer.renderToString(imageElement);
      }
      default:
        return `<!-- Componente desconocido: ${component.type} -->`;
    }
  }
  /* 
  * Genera los estilos para la página
  */
  private generateStyles(page: Page, optimize: boolean): string {
    // Estilos base para todos los componentes
    const baseStyles = `
      <style>
        .wb-container {
          box-sizing: border-box;
        }
        
        .wb-text {
          margin: 0;
        }
        
        .wb-image {
          max-width: 100%;
          height: auto;
        }
      </style>
    `;
    // Aquí se podría implementar la extracción y optimización de estilos inline
    // para producción si optimize = true
    return baseStyles;
  }
  /*
   * Genera los scripts JS necesarios para la página
  */
  private generateScripts(page: Page, optimize: boolean): string {
    // Scripts base para funcionalidad en el frontend
    const baseScripts = `
      <script>
        // Scripts básicos para la página renderizada
        document.addEventListener('DOMContentLoaded', function() {
          console.log('Página renderizada por Web Builder TypeScript');
        });
      </script>
    `;
    // Aquí se podrían añadir scripts adicionales según los componentes usados
    return baseScripts;
  }
}

// Exportar una instancia singleton
export const renderer = new RenderEngine();