import type { NodeEditorProps } from '../../types/node';

export default function OutputNodeEditor({ manifest: _manifest }: NodeEditorProps) {
  return (
    <div className="p-3 min-w-[150px]">
      <h4 className="text-sm font-medium text-center text-gray-700">Output Node</h4>
      <div className="text-center text-xs text-gray-500 mt-2">
        Result Display
      </div>
    </div>
  );
}
