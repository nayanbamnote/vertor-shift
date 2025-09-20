import { nodeRegistry } from '../lib/nodeRegistry';

// Import all node definitions and factories
import * as InputNode from './inputNode';
import * as LlmNode from './llmNode';
import * as TextNode from './textNode';
import * as OutputNode from './outputNode';

// Register all nodes
nodeRegistry.register(InputNode.nodeDefinition, InputNode.Node);
nodeRegistry.register(LlmNode.nodeDefinition, LlmNode.Node);
nodeRegistry.register(TextNode.nodeDefinition, TextNode.Node);
nodeRegistry.register(OutputNode.nodeDefinition, OutputNode.Node);

// Export everything
export { nodeRegistry };
export { InputNode, LlmNode, TextNode, OutputNode };
