import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useWorkflowStore } from '../../stores/workflowStore';
import { nodeRegistry } from '../../nodes';
import { InputNode, LlmNode, TextNode, OutputNode } from '../../nodes';

interface NodeData {
  label: string;
}

export default function GenericReactFlowNode(props: NodeProps<NodeData>) {
  const { id } = props;
  const { nodes, updateNodeConfig } = useWorkflowStore();
  
  // Find the node in store to get its type and config
  const node = nodes.find(n => n.id === id);
  if (!node) return null;
  
  // Get manifest from registry
  const manifest = nodeRegistry.getManifest(node.type || '');
  if (!manifest) return null;

  // Helper function to render the actual UI component inline
  const renderNodeUI = () => {
    const editorProps = {
      nodeId: node.id,
      manifest,
      config: node.config,
      setConfig: (patch: Record<string, any>) => updateNodeConfig(node.id, patch),
    };

    switch (node.type) {
      case 'input-node':
        return (
          <div >
            <InputNode.NodeEditor {...editorProps} />
          </div>
        );
        
      case 'text-node':
        return (
          <div >
            <TextNode.NodeEditor {...editorProps} />
          </div>
        );
        
      case 'llm-node':
        return (
          <div >
            <LlmNode.NodeEditor {...editorProps} />
          </div>
        );
        
      case 'output-node':
        return (
          <div >
            <OutputNode.NodeEditor {...editorProps} />
          </div>
        );
        
      default:
        return <div className="p-2 text-xs text-gray-500">Unknown node type</div>;
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md relative">
      {/* Input Handles */}
      {manifest.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ 
            top: manifest.inputs.length === 1 ? '50%' : `${((index + 1) / (manifest.inputs.length + 1)) * 100}%`,
            transform: 'translateY(-50%)'
          }}
        />
      ))}
      
      {/* Output Handles */}
      {manifest.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ 
            top: manifest.outputs.length === 1 ? '50%' : `${((index + 1) / (manifest.outputs.length + 1)) * 100}%`,
            transform: 'translateY(-50%)'
          }}
        />
      ))}
      
      {/* Embedded Node UI */}
      {renderNodeUI()}
    </div>
  );
}
