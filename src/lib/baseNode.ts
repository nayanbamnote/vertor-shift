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

  return {
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
      return validateAgainstSchema(this.getConfigSchema(), config);
    },
    
    serialize(): NodeSerializable {
      return {
        id: this.id,
        type: this.type,
        version: this.version,
        config: this.config,
        meta: this.meta
      };
    },
    
    deserialize(snapshot: NodeSerializable): void {
      this.id = snapshot.id;
      this.config = snapshot.config;
      this.meta = snapshot.meta;
    }
  };
}
