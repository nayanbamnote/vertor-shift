//@ts-ignore
import React from 'react';
import  GenericReactFlowNode  from '../components/nodes/GenericReactFlowNode';
import { nodeRegistry, InputNode, LlmNode, TextNode, OutputNode, FilterNode, TransformNode, ConditionNode, MathNode, DelayNode } from '../nodes/index';
import type { ValidationResult } from '../types/node';

// Node types for ReactFlow - using generic component for all types
export const nodeTypes = {
  'input-node': GenericReactFlowNode,
  'llm-node': GenericReactFlowNode,
  'text-node': GenericReactFlowNode,
  'output-node': GenericReactFlowNode,
  'filter-node': GenericReactFlowNode,
  'transform-node': GenericReactFlowNode,
  'condition-node': GenericReactFlowNode,
  'math-node': GenericReactFlowNode,
  'delay-node': GenericReactFlowNode,
};

// Helper function to render the actual UI component
export const renderNodeUI = (node: any, updateNodeConfig: (nodeId: string, patch: Record<string, any>) => Promise<ValidationResult>) => {
  const manifest = nodeRegistry.getManifest(node.type || '');
  if (!manifest) return null;

  const editorProps = {
    nodeId: node.id,
    manifest,
    config: node.config,
    setConfig: async (patch: Record<string, any>) => await updateNodeConfig(node.id, patch),
  };

  switch (node.type) {
    case 'input-node':
      return (
        <div>
          <InputNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'text-node':
      return (
        <div>
          <TextNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'llm-node':
      return (
        <div>
          <LlmNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'output-node':
      return (
        <div>
          <OutputNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'filter-node':
      return (
        <div>
          <FilterNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'transform-node':
      return (
        <div>
          <TransformNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'condition-node':
      return (
        <div>
          <ConditionNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'math-node':
      return (
        <div>
          <MathNode.NodeEditor {...editorProps} />
        </div>
      );
      
    case 'delay-node':
      return (
        <div>
          <DelayNode.NodeEditor {...editorProps} />
        </div>
      );
      
    default:
      return <div className="p-2 text-xs text-gray-500">Unknown node type</div>;
  }
};
