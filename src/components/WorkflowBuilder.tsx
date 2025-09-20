import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
	addEdge,
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	useEdgesState,
	useNodesState,
	Position,
	BaseEdge,
	EdgeLabelRenderer,
	useReactFlow,
	getBezierPath,
} from "reactflow";
import type {
	Connection,
	Edge,
	Node,
	OnEdgesDelete,
	ReactFlowInstance,
	EdgeProps,
} from "reactflow";
import {
	MousePointer2,
	Webhook,
	Code2,
	Settings2,
	Trash2,
	ZoomIn,
	ZoomOut,
	ScanSearch,
} from "lucide-react";
import "reactflow/dist/style.css";

type PaletteItem = {
	id: string;
	label: string;
	icon: React.ReactNode;
	type: string;
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const paletteItems: PaletteItem[] = [
	{ id: "trigger", label: "Trigger", icon: <MousePointer2 size={16} />, type: "default" },
	{ id: "http", label: "HTTP Request", icon: <Webhook size={16} />, type: "input" },
	{ id: "code", label: "Code", icon: <Code2 size={16} />, type: "default" },
	{ id: "set", label: "Set", icon: <Settings2 size={16} />, type: "output" },
];

const rfSnapGrid: [number, number] = [16, 16];

// Custom edge with hover delete icon
const RemovableSmoothEdge: React.FC<EdgeProps> = (props) => {
	const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
	const { setEdges } = useReactFlow();
	const [hovered, setHovered] = useState(false);

	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return (
		<g>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<path
				d={edgePath}
				fill="none"
				stroke="transparent"
				strokeWidth={20}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						pointerEvents: "all",
					}}
					className={`z-10 rounded border bg-background/90 p-1 shadow transition-opacity ${
						hovered ? "opacity-100" : "opacity-0"
					}`}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					<button
						title="Delete edge"
						className="flex h-5 w-5 items-center justify-center rounded hover:bg-destructive/10"
						onClick={(e) => {
							e.stopPropagation();
							setEdges((eds) => eds.filter((e) => e.id !== id));
						}}
					>
						<Trash2 size={12} />
					</button>
				</div>
			</EdgeLabelRenderer>
		</g>
	);
};

export default function WorkflowBuilder() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [selectedEdgeIds, setSelectedEdgeIds] = useState<Set<string>>(new Set());
	const reactFlowWrapperRef = useRef<HTMLDivElement | null>(null);
	const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

	const onConnect = useCallback((connection: Connection) => {
		setEdges((eds) => addEdge({ ...connection, type: "removable" }, eds));
	}, [setEdges]);

	const onInit = useCallback((instance: ReactFlowInstance) => {
		reactFlowInstanceRef.current = instance;
		setTimeout(() => instance.fitView({ padding: 0.2 }), 0);
	}, []);

	const onDrop = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();
		const type = event.dataTransfer.getData("application/reactflow");
		const label = event.dataTransfer.getData("application/reactflow/label");
		if (!type || !reactFlowBounds || !reactFlowInstanceRef.current) return;

		const position = reactFlowInstanceRef.current.project({
			x: event.clientX - reactFlowBounds.left,
			y: event.clientY - reactFlowBounds.top,
		});
		const id = `${type}-${Date.now()}`;
		const newNode: Node = {
			id,
			type: type as Node["type"],
			position,
			data: { label: label || type },
			sourcePosition: Position.Right,
			targetPosition: Position.Left,
		};
		setNodes((nds) => nds.concat(newNode));
	}, [setNodes]);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onEdgesDelete: OnEdgesDelete = useCallback((deleted) => {
		const toDelete = new Set(deleted.map((e) => e.id));
		setSelectedEdgeIds((prev) => {
			const next = new Set(prev);
			toDelete.forEach((id) => next.delete(id));
			return next;
		});
	}, []);

	const onSelectionChange = useCallback((params: { nodes: Node[]; edges: Edge[] }) => {
		setSelectedEdgeIds(new Set(params.edges.map((e) => e.id)));
	}, []);

	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		if ((event.key === "Delete" || event.key === "Backspace") && selectedEdgeIds.size > 0) {
			setEdges((eds) => eds.filter((e) => !selectedEdgeIds.has(e.id)));
		}
	}, [selectedEdgeIds, setEdges]);

	const nodeColor = useCallback((n: Node) => {
		if (n.type === "input") return "#16a34a"; // green
		if (n.type === "output") return "#2563eb"; // blue
		return "#6b7280"; // gray
	}, []);

	const palette = useMemo(() => paletteItems, []);

	return (
		<div className="flex h-svh w-full" onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Sidebar Palette */}
			<aside className="flex w-64 shrink-0 flex-col gap-2 border-r bg-card p-3">
				<div className="mb-2 text-sm font-medium">Nodes</div>
				<div className="flex flex-col gap-2">
					{palette.map((item) => (
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
					<div className="flex items-center gap-2">
						<button
							className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
							onClick={() => reactFlowInstanceRef.current?.zoomIn()}
							title="Zoom In"
						>
							<ZoomIn size={16} />
						</button>
						<button
							className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
							onClick={() => reactFlowInstanceRef.current?.zoomOut()}
							title="Zoom Out"
						>
							<ZoomOut size={16} />
						</button>
						<button
							className="flex flex-1 items-center justify-center rounded-md border p-2 hover:bg-muted"
							onClick={() => reactFlowInstanceRef.current?.fitView({ padding: 0.2 })}
							title="Fit View"
						>
							<ScanSearch size={16} />
						</button>
					</div>
				</div>
			</aside>

			{/* Canvas */}
			<div className="relative flex-1" ref={reactFlowWrapperRef}>
				<ReactFlow
					className="h-full w-full"
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onInit={onInit}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onEdgesDelete={onEdgesDelete}
					onSelectionChange={onSelectionChange}
					edgeTypes={{ removable: RemovableSmoothEdge }}
					fitView
					snapToGrid
					snapGrid={rfSnapGrid}
					panOnScroll
					selectionOnDrag
					/* deleteKeyCode prop removed: using manual key handler on wrapper */
				>
					<Background variant={BackgroundVariant.Dots} gap={16} size={1} />
					<Controls position="bottom-right" />
					<MiniMap nodeColor={nodeColor} zoomable pannable />
				</ReactFlow>
			</div>
		</div>
	);
}


