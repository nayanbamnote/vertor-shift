import type { NodeDefinition, BaseNode, NodeManifest } from '../types/node';

// Registry state
const definitions = new Map<string, NodeDefinition>();
const factories = new Map<string, (id: string, config?: any, meta?: any) => BaseNode>();

// Registry functions
export const registerNode = (definition: NodeDefinition, factory: (id: string, config?: any, meta?: any) => BaseNode) => {
  definitions.set(definition.type, definition);
  factories.set(definition.type, factory);
};

export const getNodeDefinition = (type: string): NodeDefinition | undefined => {
  return definitions.get(type);
};

export const getNodeManifest = (type: string): NodeManifest | undefined => {
  const definition = definitions.get(type);
  return definition?.manifest;
};

export const createNode = (type: string, id: string, config?: any, meta?: any): BaseNode | undefined => {
  const factory = factories.get(type);
  if (!factory) {
    console.error(`Node type '${type}' not found in registry`);
    return undefined;
  }
  return factory(id, config, meta);
};

export const getAllNodeTypes = (): string[] => {
  return Array.from(definitions.keys());
};

export const getAllNodeDefinitions = (): NodeDefinition[] => {
  return Array.from(definitions.values());
};

// Legacy object interface for backward compatibility
export const nodeRegistry = {
  register: registerNode,
  getDefinition: getNodeDefinition,
  getManifest: getNodeManifest,
  createNode,
  getAllTypes: getAllNodeTypes,
  getAllDefinitions: getAllNodeDefinitions,
};
