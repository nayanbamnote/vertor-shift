import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';

const manifest: NodeManifest = {
  type: 'text-node',
  displayName: 'Text Node',
  version: 1,
  category: 'transform',
  icon: 'text.svg',
  description: 'Text processing and transformation node',
  inputs: [
    { id: 'input', label: 'Input' }
  ],
  outputs: [
    { id: 'output', label: 'Output' }
  ],
  configSchema: {
    type: 'object',
    properties: {
      text: { 
        type: 'string', 
        default: '' 
      }
    },
    required: ['text'],
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
  type: 'text-node',
  version: 1,
  manifest
};

export function createTextNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createTextNode;
