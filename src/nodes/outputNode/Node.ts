import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';

const manifest: NodeManifest = {
  type: 'output-node',
  displayName: 'Output Node',
  version: 1,
  category: 'data',
  icon: 'output.svg',
  description: 'Output node for displaying results',
  inputs: [
    { id: 'input1', label: 'Input 1' },
    { id: 'input2', label: 'Input 2' }
  ],
  outputs: [
    { id: 'output', label: 'Output' }
  ],
  configSchema: {
    type: 'object',
    properties: {},
    required: [],
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
  type: 'output-node',
  version: 1,
  manifest
};

export function createOutputNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createOutputNode;
