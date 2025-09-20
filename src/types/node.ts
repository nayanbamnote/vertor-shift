export interface PortDefinition {
  id: string;
  label: string;
  type?: string;
}

export interface JsonSchemaObject {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: any;
}

export interface ValidationResult {
  ok: boolean;
  errors?: Record<string, string>;
}

export interface NodeSerializable {
  id: string;
  type: string;
  version: number;
  config: Record<string, any>;
  meta: Record<string, any>;
}

export interface NodeManifest {
  type: string;
  displayName: string;
  version: number;
  category: 'ai' | 'utility' | 'data' | 'transform';
  icon?: string;
  description: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  configSchema: JsonSchemaObject;
  ui: {
    editor: string;
  };
  capabilities?: {
    canRunFrontend?: boolean;
    requiresBackend?: boolean;
    streamable?: boolean;
  };
  permissions?: string[];
}

export interface BaseNode {
  // Instance properties
  id: string;
  type: string;
  version: number;
  displayName: string;
  config: Record<string, any>;
  meta: Record<string, any>;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  
  // Required methods
  getConfigSchema(): JsonSchemaObject;
  validateConfig(config: any): ValidationResult;
  serialize(): NodeSerializable;
  deserialize(snapshot: NodeSerializable): void;
  
  // Optional lifecycle hooks
  onAttach?(): void;
  onDetach?(): void;
  migrate?(oldConfig: any, oldVersion: number): any;
}

export interface NodeDefinition {
  type: string;
  version: number;
  manifest: NodeManifest;
}

export interface NodeEditorProps {
  nodeId: string;
  manifest: NodeManifest;
  config: Record<string, any>;
  setConfig: (patch: Record<string, any>) => Promise<ValidationResult>;
  position?: { x: number; y: number };
  onClose?: () => void;
}
