import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';
import manifestData from './manifest.json';

const manifest: NodeManifest = manifestData as NodeManifest;

export const nodeDefinition: NodeDefinition = {
  type: 'transform-node',
  version: 1,
  manifest
};

export function createTransformNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createTransformNode;
