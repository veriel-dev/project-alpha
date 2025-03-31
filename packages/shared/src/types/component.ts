// shared/types/component.ts

/**
 * Represents a component instance in the web builder system
 */
export interface Component<T = Record<string, unknown>> {
  id: string;
  type: string;
  label: string;
  props: T;
  children: Component[];
  //@ts-ignore
  render(): JSX.Element;
}

/**
 * Configuration for a component type in the editor
 */
export interface ComponentConfig<T = Record<string, unknown>> {
  description: any;
  type: string;
  label: string;
  category: string;
  icon: string;
  defaultProps: T;
  propEditors: PropEditor[];
  allowChildren: boolean;
  maxChildren?: number;
}
/**
 * Configuration for property editors in the component panel
 */
export interface PropEditor<T = unknown> {
  description: any;
  max: string | number | undefined;
  min: string | number | undefined;
  step: number;
  required: any;
  group: string;
  propName: string;
  label: string;
  editorType: 'text' | 'number' | 'select' | 'color' | 'image' | 'toggle';
  options?: Array<{ value: T; label: string }>;
  defaultValue: T;
}
