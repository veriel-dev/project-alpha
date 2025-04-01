
import { builder } from "../../../core/builder/Builder";
import { ComponentConfig } from "@web-builder/shared/src/types/component";
// Container Component Config
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
}
export const RootContainerComponentConfig: ComponentConfig = {
  type: 'container-root',
  label: 'Contenedor',
  category: 'main',
  icon: 'box',
  defaultProps: {},
  propEditors: [],
  allowChildren: true,
}
export const TextComponentConfig: ComponentConfig = {
  type: 'text',
  label: 'Texto',
  category: 'Básicos',
  icon: 'type',
  defaultProps: {
    content: 'Texto de ejemplo',
    tag: 'p',
    style: {
      fontSize: '16px',
      color: '#333333',
      fontWeight: 'normal',
    },
  },
  propEditors: [
    {
      propName: 'content',
      label: 'Contenido',
      editorType: 'text',
      defaultValue: 'Texto de ejemplo',
    },
    {
      propName: 'tag',
      label: 'Etiqueta HTML',
      editorType: 'select',
      options: [
        { value: 'p', label: 'Párrafo (p)' },
        { value: 'h1', label: 'Título 1 (h1)' },
        { value: 'h2', label: 'Título 2 (h2)' },
        { value: 'h3', label: 'Título 3 (h3)' },
        { value: 'h4', label: 'Título 4 (h4)' },
        { value: 'h5', label: 'Título 5 (h5)' },
        { value: 'h6', label: 'Título 6 (h6)' },
      ],
      defaultValue: 'p',
    },
    {
      propName: 'style.fontSize',
      label: 'Tamaño de fuente',
      editorType: 'text',
      defaultValue: '16px',
    },
    {
      propName: 'style.color',
      label: 'Color de texto',
      editorType: 'color',
      defaultValue: '#333333',
    },
    {
      propName: 'style.fontWeight',
      label: 'Peso de fuente',
      editorType: 'select',
      options: [
        { value: 'normal', label: 'Normal' },
        { value: 'bold', label: 'Negrita' },
        { value: '300', label: 'Ligero (300)' },
        { value: '500', label: 'Medio (500)' },
        { value: '700', label: 'Negrita (700)' },
      ],
      defaultValue: 'normal',
    },
  ],
  allowChildren: false,
}
export const ImageComponentConfig: ComponentConfig = {
  type: 'image',
  label: 'Imagen',
  category: 'Básicos',
  icon: 'image',
  defaultProps: {
    src: 'https://image-placeholder.com/images/actual-size/320x200.png',
    alt: 'Imagen de ejemplo',
    style: {
      width: '100%',
      height: 'auto',
    },
  },
  propEditors: [
    {
      propName: 'src',
      label: 'URL de la imagen',
      editorType: 'image',
      defaultValue: 'https://image-placeholder.com/images/actual-size/320x200.png',
    },
    {
      propName: 'alt',
      label: 'Texto alternativo',
      editorType: 'text',
      defaultValue: 'Imagen de ejemplo',
    },
    {
      propName: 'style.maxWidth',
      label: 'Ancho máximo',
      editorType: 'text',
      defaultValue: '100%',
    },
  ],
  allowChildren: false,
}
// Registrar all components en el sistem 

export function registerBaseComponents() {
  builder.registerComponent(ContainerComponentConfig);
  builder.registerComponent(TextComponentConfig);
  builder.registerComponent(ImageComponentConfig);
  builder.registerComponent(RootContainerComponentConfig);
}