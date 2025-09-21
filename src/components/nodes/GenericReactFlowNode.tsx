import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useWorkflowStore } from '../../stores/workflowStore';
import { nodeRegistry } from '../../nodes/index';
import { renderNodeUI } from '@/lib/nodeUtils';

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
      {renderNodeUI(node, updateNodeConfig)}
    </div>
  );
}
