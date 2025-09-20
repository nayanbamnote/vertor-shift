import React from "react";
import {
	MousePointer2,
	Webhook,
	Code2,
	Settings2,
	ZoomIn,
	ZoomOut,
	ScanSearch,
} from "lucide-react";
import ExportDialog from "./ExportDialog";
import ImportDialog from "./ImportDialog";

type PaletteItem = {
	id: string;
	label: string;
	icon: React.ReactNode;
	type: string;
};

const paletteItems: PaletteItem[] = [
	{ id: "trigger", label: "Trigger", icon: <MousePointer2 size={16} />, type: "default" },
	{ id: "http", label: "HTTP Request", icon: <Webhook size={16} />, type: "input" },
	{ id: "code", label: "Code", icon: <Code2 size={16} />, type: "default" },
	{ id: "set", label: "Set", icon: <Settings2 size={16} />, type: "output" },
];

interface SidebarPaletteProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onFitView: () => void;
}

export default function SidebarPalette({ onZoomIn, onZoomOut, onFitView }: SidebarPaletteProps) {
	return (
		<aside className="flex w-64 shrink-0 flex-col gap-2 border-r bg-card p-3">
			<div className="mb-2 text-sm font-medium">Nodes</div>
			<div className="flex flex-col gap-2">
				{paletteItems.map((item) => (
					<button
						key={item.id}
						className="flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
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
						<span className="text-foreground/60">drag</span>
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
