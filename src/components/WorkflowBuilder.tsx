import React, { useCallback, useRef } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	Position,
	BaseEdge,
	EdgeLabelRenderer,
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
import { Trash2 } from "lucide-react";
import "reactflow/dist/style.css";
import { useWorkflowStore, type WorkflowNode } from "../stores/workflowStore";
import SidebarPalette from "./SidebarPalette";

const rfSnapGrid: [number, number] = [16, 16];

// Custom edge with hover delete icon
const RemovableSmoothEdge: React.FC<EdgeProps> = (props) => {
	const { id, sourceX, sourceY, targetX, targetY, markerEnd, style } = props;
	const deleteEdge = useWorkflowStore((state) => state.deleteEdge);
	const [hovered, setHovered] = React.useState(false);

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
							deleteEdge(id);
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
	// Zustand store
	const {
		nodes,
		edges,
		selectedEdgeIds,
		addNode,
		updateNodePosition,
		connectNodes,
		deleteEdge,
		setSelectedEdgeIds,
	} = useWorkflowStore();

	const reactFlowWrapperRef = useRef<HTMLDivElement | null>(null);
	const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

	const onNodesChange = useCallback((changes: any[]) => {
		changes.forEach((change) => {
			if (change.type === "position" && change.position) {
				updateNodePosition(change.id, change.position);
			}
		});
	}, [updateNodePosition]);

	const onConnect = useCallback((connection: Connection) => {
		connectNodes(connection);
	}, [connectNodes]);

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
		const newNode: WorkflowNode = {
			id,
			type: type as Node["type"],
			position,
			data: { label: label || type },
			sourcePosition: Position.Right,
			targetPosition: Position.Left,
			config: {},
			meta: { x: position.x, y: position.y },
		};
		addNode(newNode);
	}, [addNode]);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onEdgesDelete: OnEdgesDelete = useCallback((deleted) => {
		const toDelete = new Set(deleted.map((e) => e.id));
		setSelectedEdgeIds((prev: Set<string>) => {
			const next = new Set(prev);
			toDelete.forEach((id) => next.delete(id));
			return next;
		});
	}, [setSelectedEdgeIds]);

	const onSelectionChange = useCallback((params: { nodes: Node[]; edges: Edge[] }) => {
		setSelectedEdgeIds(new Set(params.edges.map((e) => e.id)));
	}, [setSelectedEdgeIds]);

	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		if ((event.key === "Delete" || event.key === "Backspace") && selectedEdgeIds.size > 0) {
			selectedEdgeIds.forEach((id) => deleteEdge(id));
		}
	}, [selectedEdgeIds, deleteEdge]);

	const nodeColor = useCallback((n: Node) => {
		if (n.type === "input") return "#16a34a"; // green
		if (n.type === "output") return "#2563eb"; // blue
		return "#6b7280"; // gray
	}, []);

	// Zoom controls
	const handleZoomIn = useCallback(() => {
		reactFlowInstanceRef.current?.zoomIn();
	}, []);

	const handleZoomOut = useCallback(() => {
		reactFlowInstanceRef.current?.zoomOut();
	}, []);

	const handleFitView = useCallback(() => {
		reactFlowInstanceRef.current?.fitView({ padding: 0.2 });
	}, []);

	return (
		<div className="flex h-svh w-full" onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Sidebar Palette */}
			<SidebarPalette
				onZoomIn={handleZoomIn}
				onZoomOut={handleZoomOut}
				onFitView={handleFitView}
			/>

			{/* Canvas */}
			<div className="relative flex-1" ref={reactFlowWrapperRef}>
				<ReactFlow
					className="h-full w-full"
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
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
				>
					<Background variant={BackgroundVariant.Dots} gap={16} size={1} />
					<Controls position="bottom-right" />
					<MiniMap nodeColor={nodeColor} zoomable pannable />
				</ReactFlow>
			</div>
		</div>
	);
}


