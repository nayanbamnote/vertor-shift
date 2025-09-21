import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function MathNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const handleOperationChange = (operation: string) => {
    const newConfig = { ...config, operation };
    setConfig(newConfig);
  };
  
  const handleConstantChange = (constant: string) => {
    const numValue = parseFloat(constant) || 0;
    const newConfig = { ...config, constant: numValue };
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
                <span>{config.operation || 'add'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleOperationChange('add')}>
                Add (+)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('subtract')}>
                Subtract (-)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('multiply')}>
                Multiply (×)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('divide')}>
                Divide (÷)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('power')}>
                Power (^)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOperationChange('modulo')}>
                Modulo (%)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Constant Value
          </label>
          <Input
            type="number"
            value={config.constant || 0}
            onChange={(e) => handleConstantChange(e.target.value)}
            placeholder="Enter constant..."
            className="w-full text-sm h-8"
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Input 1: First operand</p>
          <p>Input 2: Second operand</p>
          <p>Constant: Additional value for operations</p>
        </div>
      </div>
    </div>
  );
}
