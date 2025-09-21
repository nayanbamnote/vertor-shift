import { useState } from 'react';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function ConditionNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleOperatorChange = (operator: string) => {
    const newConfig = { ...localConfig, operator };
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
  
  return (
    <div className="p-3 min-w-[250px]">
      <h4 className="text-sm font-medium mb-3 text-gray-700">{manifest.displayName}</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Operator
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md bg-background hover:bg-muted h-8">
                <span>{localConfig.operator || 'equals'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleOperatorChange('equals')}>
                Equals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperatorChange('notEquals')}>
                Not Equals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperatorChange('greaterThan')}>
                Greater Than
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperatorChange('lessThan')}>
                Less Than
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperatorChange('contains')}>
                Contains
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Compare Value
          </label>
          <Input
            type="text"
            value={localConfig.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter value to compare..."
            className="w-full text-sm h-8"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Data Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md bg-background hover:bg-muted h-8">
                <span>{localConfig.dataType || 'string'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleDataTypeChange('string')}>
                String
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDataTypeChange('number')}>
                Number
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDataTypeChange('boolean')}>
                Boolean
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
