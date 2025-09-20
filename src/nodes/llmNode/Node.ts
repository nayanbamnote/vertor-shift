import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';

const manifest: NodeManifest = {
  type: 'llm-node',
  displayName: 'LLM Node',
  version: 1,
  category: 'ai',
  icon: 'llm.svg',
  description: 'Large Language Model processing node',
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
    canRunFrontend: false,
    requiresBackend: true,
    streamable: true
  }
};

export const nodeDefinition: NodeDefinition = {
  type: 'llm-node',
  version: 1,
  manifest
};

export function createLlmNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createLlmNode;
