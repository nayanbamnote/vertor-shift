import type { NodeDefinition, BaseNode, NodeManifest } from '../types/node';

class NodeRegistry {
  private definitions = new Map<string, NodeDefinition>();
  private factories = new Map<string, (id: string, config?: any, meta?: any) => BaseNode>();

  register(definition: NodeDefinition, factory: (id: string, config?: any, meta?: any) => BaseNode) {
    this.definitions.set(definition.type, definition);
    this.factories.set(definition.type, factory);
  }

  getDefinition(type: string): NodeDefinition | undefined {
    return this.definitions.get(type);
  }

  getManifest(type: string): NodeManifest | undefined {
    const definition = this.definitions.get(type);
    return definition?.manifest;
  }

  createNode(type: string, id: string, config?: any, meta?: any): BaseNode | undefined {
    const factory = this.factories.get(type);
    if (!factory) {
      console.error(`Node type '${type}' not found in registry`);
      return undefined;
    }
    return factory(id, config, meta);
  }

  getAllTypes(): string[] {
    return Array.from(this.definitions.keys());
  }

  getAllDefinitions(): NodeDefinition[] {
    return Array.from(this.definitions.values());
  }
}

export const nodeRegistry = new NodeRegistry();
