import type { BaseNode, NodeSerializable, ValidationResult, NodeManifest, JsonSchemaObject } from '../types/node';
import { validateAgainstSchema } from './validation';

export function createBaseNode(
  id: string,
  manifest: NodeManifest,
  config: Record<string, any> = {},
  meta: Record<string, any> = {}
): BaseNode {
  const getDefaultConfig = (): Record<string, any> => {
    const schema = manifest.configSchema;
    const defaults: Record<string, any> = {};
    
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, prop]: [string, any]) => {
        if (prop && typeof prop === 'object' && prop.default !== undefined) {
          defaults[key] = prop.default;
        }
      });
    }
    
    return defaults;
  };

  const defaultConfig = getDefaultConfig();
  const mergedConfig = { ...defaultConfig, ...config };

  // Create the base node object
  const baseNode: BaseNode = {
    id,
    type: manifest.type,
    version: manifest.version,
    displayName: manifest.displayName,
    config: mergedConfig,
    meta,
    inputs: manifest.inputs,
    outputs: manifest.outputs,
    
    getConfigSchema(): JsonSchemaObject {
      return manifest.configSchema;
    },
    
    validateConfig(config: any): ValidationResult {
      return validateAgainstSchema(baseNode.getConfigSchema(), config);
    },
    
    serialize(): NodeSerializable {
      return {
        id: baseNode.id,
        type: baseNode.type,
        version: baseNode.version,
        config: baseNode.config,
        meta: baseNode.meta
      };
    },
    
    deserialize(snapshot: NodeSerializable): void {
      baseNode.id = snapshot.id;
      baseNode.config = snapshot.config;
      baseNode.meta = snapshot.meta;
    }
  };

  return baseNode;
}
