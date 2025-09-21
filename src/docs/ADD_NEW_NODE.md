# Adding New Nodes to the Workflow Builder

This guide explains how to add new nodes to the workflow builder system. Each node follows a consistent pattern with specific files and structure.

## Node Structure

Each node is contained in its own directory under `src/nodes/` and consists of four files:

```
src/nodes/yourNodeName/
├── manifest.json    # Node configuration and schema
├── Node.ts          # Node definition and factory function
├── ui.tsx           # React component for node editor UI
└── index.ts         # Exports for the node
```

## Step-by-Step Guide

### 1. Create Node Directory

Create a new directory for your node:
```bash
mkdir src/nodes/yourNodeName
```

### 2. Create manifest.json

The manifest defines the node's metadata, inputs/outputs, and configuration schema:

```json
{
  "type": "your-node-type",
  "displayName": "Your Node Display Name",
  "version": 1,
  "category": "data|logic|control|ai",
  "icon": "your-icon.svg",
  "description": "Brief description of what this node does",
  "inputs": [
    { "id": "input1", "label": "Input Label" }
  ],
  "outputs": [
    { "id": "output1", "label": "Output Label" }
  ],
  "configSchema": {
    "type": "object",
    "properties": {
      "propertyName": { 
        "type": "string", 
        "default": "defaultValue" 
      }
    },
    "required": ["propertyName"],
    "additionalProperties": false
  },
  "ui": {
    "editor": "./ui.tsx"
  },
  "capabilities": {
    "canRunFrontend": true,
    "requiresBackend": false
  }
}
```

### 3. Create Node.ts

This file defines the node definition and factory function:

```typescript
import type { BaseNode, NodeDefinition, NodeManifest } from '../../types/node';
import { createBaseNode } from '../../lib/baseNode';
import manifestData from './manifest.json';

const manifest: NodeManifest = manifestData as NodeManifest;

export const nodeDefinition: NodeDefinition = {
  type: 'your-node-type',
  version: 1,
  manifest
};

export function createYourNode(id: string, config = {}, meta = {}): BaseNode {
  return createBaseNode(id, manifest, config, meta);
}

export default createYourNode;
```

### 4. Create ui.tsx

This React component provides the node's editor interface:


### 5. Create index.ts

Export the node components:

```typescript
export { nodeDefinition, createYourNode } from './Node';
export { default as NodeEditor } from './ui';
```

### 6. Register the Node

Update `src/nodes/index.ts` to register your new node:

```typescript
// Add import
import * as YourNode from './yourNodeName';

// Add registration
nodeRegistry.register(YourNode.nodeDefinition, YourNode.Node);

// Add to exports
export { YourNode };
```

### 7. Update Node Utils

Update `src/lib/nodeUtils.tsx` to include your node:

```typescript
// Add import
import { nodeRegistry, InputNode, LlmNode, TextNode, OutputNode, YourNode } from '../nodes/index';

// Add to nodeTypes
export const nodeTypes = {
  // ... existing nodes
  'your-node-type': GenericReactFlowNode,
};

// Add to switch statement
switch (node.type) {
  // ... existing cases
  case 'your-node-type':
    return (
      <div>
        <YourNode.NodeEditor {...editorProps} />
      </div>
    );
}
```
