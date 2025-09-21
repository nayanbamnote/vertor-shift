import React, { useMemo } from "react";
import {
	MousePointer2,
	ZoomIn,
	ZoomOut,
	ScanSearch,
} from "lucide-react";
import ExportDialog from "./ExportDialog";
import ImportDialog from "./ImportDialog";
import { nodeRegistry } from "../lib/nodeRegistry";

type PaletteItem = {
	id: string;
	label: string;
	icon: React.ReactNode;
	type: string;
};

// Icon component - uses SVG file or MousePointer2 as default
const IconComponent: React.FC<{ iconName?: string }> = ({ iconName }) => {
	const [imageError, setImageError] = React.useState(false);

	// If no icon name provided, use MousePointer2 as default
	if (!iconName) {
		return <MousePointer2 size={16} />;
	}

	// If image failed to load, show MousePointer2 as fallback
	if (imageError) {
		return <MousePointer2 size={16} />;
	}

	// Otherwise, load the SVG file directly
	return (
		<img 
			src={`/icons/${iconName}`} 
			alt="Node icon" 
			className="w-4 h-4"
			onError={() => setImageError(true)}
		/>
	);
};

const getIconComponent = (iconName?: string): React.ReactNode => {
	return <IconComponent iconName={iconName} />;
};

// Generate palette items dynamically from node registry
const generatePaletteItems = (): PaletteItem[] => {
	const nodeDefinitions = nodeRegistry.getAllDefinitions();
	
	return nodeDefinitions.map((definition) => ({
		id: definition.type.replace("-node", ""), // Remove "-node" suffix for cleaner id
		label: definition.manifest.displayName,
		icon: getIconComponent(definition.manifest.icon),
		type: definition.type,
	}));
};

interface SidebarPaletteProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onFitView: () => void;
}

export default function SidebarPalette({ onZoomIn, onZoomOut, onFitView }: SidebarPaletteProps) {
	// Generate palette items dynamically from node registry
	const paletteItems = useMemo(() => generatePaletteItems(), []);

	return (
		<aside className="flex w-64 shrink-0 flex-col gap-2 border-r bg-card p-3">
			<div className="mb-2 text-sm font-medium">Nodes</div>
			<div className="flex flex-wrap gap-2">
				{paletteItems.map((item) => (
					<button
						key={item.id}
						className="flex items-center cursor-pointer justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
						draggable
						onDragStart={(event) => {
							event.dataTransfer.setData("application/reactflow", item.type);
							event.dataTransfer.setData("application/reactflow/label", item.label);
							event.dataTransfer.effectAllowed = "move";
						}}
					>
						<span className="flex items-center gap-2">
							{item.icon}
							<span>{item.label}</span>
						</span>
					</button>
				))}
			</div>
			<div className="mt-auto flex flex-col gap-2">
				{/* Export/Import Section */}
				<div className="space-y-2">
					<div className="text-sm font-medium">Workflow</div>
					<div className="flex flex-col gap-2">
						<ExportDialog />
						<ImportDialog />
					</div>
				</div>
				
				{/* Zoom Controls */}
				<div className="flex items-center gap-2">
					<button
						className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
						onClick={onZoomIn}
						title="Zoom In"
					>
						<ZoomIn size={16} />
					</button>
					<button
						className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
						onClick={onZoomOut}
						title="Zoom Out"
					>
						<ZoomOut size={16} />
					</button>
					<button
						className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
						onClick={onFitView}
						title="Fit View"
					>
						<ScanSearch size={16} />
					</button>
				</div>
			</div>
		</aside>
	);
}
