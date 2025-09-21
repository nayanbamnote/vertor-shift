import { useState } from 'react';
import { Textarea } from '../../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function TransformNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleOperationChange = (operation: string) => {
    const newConfig = { ...localConfig, operation };
    setLocalConfig(newConfig);
    setConfig(newConfig);
  };
  
  const handleCustomFunctionChange = (customFunction: string) => {
    const newConfig = { ...localConfig, customFunction };
    setLocalConfig(newConfig);
    setConfig(newConfig);
  };
  
  return (
    <div className="p-3 min-w-[250px]">
      <h4 className="text-sm font-medium mb-3 text-gray-700">{manifest.displayName}</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Operation
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md bg-background hover:bg-muted h-8">
                <span>{localConfig.operation || 'uppercase'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleOperationChange('uppercase')}>
                Uppercase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('lowercase')}>
                Lowercase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('trim')}>
                Trim
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('reverse')}>
                Reverse
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('custom')}>
                Custom Function
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {localConfig.operation === 'custom' && (
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              Custom Function
            </label>
            <Textarea
              value={localConfig.customFunction || ''}
              onChange={(e) => handleCustomFunctionChange(e.target.value)}
              placeholder="Enter custom transformation function..."
              className="w-full text-sm min-h-[60px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
