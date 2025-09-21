import { VariableInput } from '../../components/VariableInput';
import { useWorkflowStore } from '../../stores/workflowStore';
import { substituteVariables } from '../../lib/variableUtils';
import { Type } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function TextNodeEditor({ manifest, config, setConfig, nodeId }: NodeEditorProps) {
  const getAvailableVariables = useWorkflowStore(state => state.getAvailableVariables);
  
  const availableVariables = nodeId ? getAvailableVariables(nodeId) : [];
  
  const handleTextChange = (text: string) => {
    const newConfig = { ...config, text };
    setConfig(newConfig);
  };

  const previewText = substituteVariables(config.text || '', availableVariables);
  const hasVariables = (config.text || '').includes('{{');
  
  return (
    <div className="p-3 min-w-[400px]">
      <div className="flex items-center gap-2 mb-3">
        <Type className="h-4 w-4 text-blue-600" />
        <h4 className="text-sm font-medium text-gray-700">{manifest.displayName}</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Text Template
          </label>
          <VariableInput
            value={config.text || ''}
            onChange={handleTextChange}
            availableVariables={availableVariables}
            placeholder="Enter text with {{variables}}..."
          />
          {/* <div className="text-xs text-gray-500 mt-1">
            Use <code className="bg-gray-100 px-1 rounded">{'{{variableName}}'}</code> to insert variables
          </div> */}
        </div>

        {/* Variable summary */}
        {availableVariables.length > 0 && (
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              Available Variables ({availableVariables.length})
            </label>
            <div className="flex flex-wrap gap-1">
              {availableVariables.map((variable) => (
                <button
                  key={variable.name}
                  onClick={() => {
                    const currentText = config.text || '';
                    const newText = currentText + `{{${variable.name}}}`;
                    handleTextChange(newText);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                  title={`Click to insert • Value: ${variable.value}`}
                >
                  <span className="font-mono">{variable.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    variable.type === 'number' ? 'bg-red-500' :
                    variable.type === 'boolean' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview - Always visible when there are variables */}
        {hasVariables && (
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              Preview (with variables substituted)
            </label>
            <div className="p-2 bg-gray-50 border rounded text-sm font-mono">
              {previewText || <span className="text-gray-400 italic">Empty result</span>}
            </div>
          </div>
        )}


        {/* No variables message */}
        {availableVariables.length === 0 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            💡 Connect input nodes to this text node to use variables
          </div>
        )}
      </div>
    </div>
  );
}
