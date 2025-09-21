import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import type { NodeEditorProps } from '../../types/node';

export default function FilterNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const handleConditionChange = (condition: string) => {
    const newConfig = { ...config, condition };
    setConfig(newConfig);
  };
  
  const handleValueChange = (value: string) => {
    const newConfig = { ...config, value };
    setConfig(newConfig);
  };
  
  const handleCaseSensitiveChange = (caseSensitive: boolean) => {
    const newConfig = { ...config, caseSensitive };
    setConfig(newConfig);
  };
  
  return (
    <div className="p-3 min-w-[250px]">
      <h4 className="text-sm font-medium mb-3 text-gray-700">{manifest.displayName}</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Condition
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md bg-background hover:bg-muted h-8">
                <span>{config.condition || 'contains'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleConditionChange('contains')}>
                Contains
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConditionChange('equals')}>
                Equals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConditionChange('startsWith')}>
                Starts With
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConditionChange('endsWith')}>
                Ends With
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Filter Value
          </label>
          <Input
            type="text"
            value={config.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter filter value..."
            className="w-full text-sm h-8"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="caseSensitive"
            checked={config.caseSensitive || false}
            onCheckedChange={handleCaseSensitiveChange}
          />
          <label htmlFor="caseSensitive" className="text-xs font-medium text-gray-600">
            Case Sensitive
          </label>
        </div>
      </div>
    </div>
  );
}
