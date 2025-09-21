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

export default function DelayNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const handleDelayChange = (delay: string) => {
    const numValue = parseFloat(delay) || 1000;
    const newConfig = { ...config, delay: numValue };
    setConfig(newConfig);
  };
  
  const handleUnitChange = (unit: string) => {
    const newConfig = { ...config, unit };
    setConfig(newConfig);
  };
  
  const handleRandomDelayChange = (randomDelay: boolean) => {
    const newConfig = { ...config, randomDelay };
    setConfig(newConfig);
  };
  
  return (
    <div className="p-3 min-w-[250px]">
      <h4 className="text-sm font-medium mb-3 text-gray-700">{manifest.displayName}</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Delay Value
          </label>
          <Input
            type="number"
            value={config.delay || 1000}
            onChange={(e) => handleDelayChange(e.target.value)}
            placeholder="Enter delay..."
            className="w-full text-sm h-8"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Time Unit
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-2 py-1 text-xs border rounded-md bg-background hover:bg-muted h-8">
                <span>{config.unit || 'milliseconds'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => handleUnitChange('milliseconds')}>
                Milliseconds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUnitChange('seconds')}>
                Seconds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUnitChange('minutes')}>
                Minutes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="randomDelay"
            checked={config.randomDelay || false}
            onCheckedChange={handleRandomDelayChange}
          />
          <label htmlFor="randomDelay" className="text-xs font-medium text-gray-600">
            Random Delay (±50%)
          </label>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Adds a delay before passing data to the next node</p>
        </div>
      </div>
    </div>
  );
}
