import { useState } from 'react';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDown, Variable as VariableIcon } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function InputNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleVariableNameChange = (variableName: string) => {
    const newConfig = { ...localConfig, variableName };
    setLocalConfig(newConfig);
    setConfig(newConfig);
  };
  
  const handleValueChange = (value: string) => {
    const newConfig = { ...localConfig, value };
    setLocalConfig(newConfig);
    setConfig(newConfig);
  };
  
  const handleDataTypeChange = (dataType: string) => {
    const newConfig = { ...localConfig, dataType };
    setLocalConfig(newConfig);
    setConfig(newConfig);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'text-red-600 bg-red-50 border-red-200';
      case 'boolean': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'text': 
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };
  
  return (
    <div className="p-3 min-w-[280px]">
      <div className="flex items-center gap-2 mb-3">
        <VariableIcon className="h-4 w-4 text-purple-600" />
        <h4 className="text-sm font-medium text-gray-700">{manifest.displayName}</h4>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Variable Name
          </label>
          <Input
            type="text"
            value={localConfig.variableName || ''}
            onChange={(e) => handleVariableNameChange(e.target.value)}
            placeholder="e.g., userName, count, isActive"
            className="w-full text-sm h-8 font-mono"
          />
          {localConfig.variableName && (
            <div className="text-xs text-gray-500 mt-1">
              Use as: <code className="bg-gray-100 px-1 rounded">{'{{' + localConfig.variableName + '}}'}</code>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Data Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md hover:bg-muted h-8 ${getTypeColor(localConfig.dataType || 'text')}`}>
                <span className="capitalize">{localConfig.dataType || 'text'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleDataTypeChange('text')}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Text
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDataTypeChange('number')}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Number
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDataTypeChange('boolean')}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Boolean
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Value
          </label>
          <Input
            type={localConfig.dataType === 'number' ? 'number' : 'text'}
            value={localConfig.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={
              localConfig.dataType === 'number' ? 'Enter number...' :
              localConfig.dataType === 'boolean' ? 'true or false' :
              'Enter text...'
            }
            className="w-full text-sm h-8"
          />
          {localConfig.dataType === 'boolean' && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleValueChange('true')}
                className={`px-2 py-1 text-xs rounded ${localConfig.value === 'true' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                true
              </button>
              <button
                onClick={() => handleValueChange('false')}
                className={`px-2 py-1 text-xs rounded ${localConfig.value === 'false' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              >
                false
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
