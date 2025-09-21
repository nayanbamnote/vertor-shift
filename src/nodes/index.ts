import { nodeRegistry } from '../lib/nodeRegistry';

// Import all node definitions and factories
import * as InputNode from './inputNode';
import * as LlmNode from './llmNode';
import * as TextNode from './textNode';
import * as OutputNode from './outputNode';
import * as FilterNode from './filterNode';
import * as TransformNode from './transformNode';
import * as ConditionNode from './conditionNode';
import * as MathNode from './mathNode';
import * as DelayNode from './delayNode';

// Register all nodes
nodeRegistry.register(InputNode.nodeDefinition, InputNode.Node);
nodeRegistry.register(LlmNode.nodeDefinition, LlmNode.Node);
nodeRegistry.register(TextNode.nodeDefinition, TextNode.Node);
nodeRegistry.register(OutputNode.nodeDefinition, OutputNode.Node);
nodeRegistry.register(FilterNode.nodeDefinition, FilterNode.Node);
nodeRegistry.register(TransformNode.nodeDefinition, TransformNode.Node);
nodeRegistry.register(ConditionNode.nodeDefinition, ConditionNode.Node);
nodeRegistry.register(MathNode.nodeDefinition, MathNode.Node);
nodeRegistry.register(DelayNode.nodeDefinition, DelayNode.Node);

// Export everything
export { nodeRegistry };
export { InputNode, LlmNode, TextNode, OutputNode, FilterNode, TransformNode, ConditionNode, MathNode, DelayNode };
