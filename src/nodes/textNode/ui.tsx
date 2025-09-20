import { useState } from 'react';
import { Input } from '../../components/ui/input';
import type { NodeEditorProps } from '../../types/node';

export default function TextNodeEditor({ manifest, config, setConfig }: NodeEditorProps) {
  const [localConfig, setLocalConfig] = useState(config);
  
  const handleTextChange = (text: string) => {
    const newConfig = { ...localConfig, text };
    setLocalConfig(newConfig);
    // Auto-save on change
    setConfig(newConfig);
  };
  
  return (
    <div className="p-3 min-w-[200px]">
      <h4 className="text-sm font-medium mb-3 text-gray-700">{manifest.displayName}</h4>
      
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">
          Text
        </label>
        <Input
          type="text"
          value={localConfig.text || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter text..."
          className="w-full text-sm h-8"
        />
      </div>
    </div>
  );
}
