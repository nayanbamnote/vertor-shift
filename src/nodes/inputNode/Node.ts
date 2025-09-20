import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';

const manifest: NodeManifest = {
  type: 'input-node',
  displayName: 'Input Node',
  version: 1,
  category: 'data',
  icon: 'input.svg',
  description: 'Input node for entering text or integers',
  inputs: [],
  outputs: [
    { id: 'output', label: 'Output' }
  ],
  configSchema: {
    type: 'object',
    properties: {
      value: { 
        type: 'string', 
        default: '' 
      },
      dataType: { 
        type: 'string', 
        default: 'Text'
      }
    },
    required: ['value', 'dataType'],
    additionalProperties: false
  },
  ui: {
    editor: './ui.tsx'
  },
  capabilities: {
    canRunFrontend: true,
    requiresBackend: false,
    streamable: false
  }
};

export const nodeDefinition: NodeDefinition = {
  type: 'input-node',
  version: 1,
  manifest
};

export function createInputNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createInputNode;
