import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Node, Edge, Connection } from "reactflow";
import { addEdge } from "reactflow";

export interface WorkflowNode extends Node {
	config: Record<string, any>;
	meta: {
		x: number;
		y: number;
	};
}

export interface WorkflowGraph {
	nodes: WorkflowNode[];
	edges: Edge[];
}

interface WorkflowStore extends WorkflowGraph {
	// Actions
	addNode: (node: WorkflowNode) => void;
	updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
	deleteNode: (id: string) => void;
	addEdge: (edge: Edge) => void;
	deleteEdge: (id: string) => void;
	connectNodes: (connection: Connection) => void;
	updateNodePosition: (id: string, position: { x: number; y: number }) => void;
	updateNodeConfig: (id: string, config: Record<string, any>) => void;
	
	// Graph operations
	importGraph: (graph: WorkflowGraph) => void;
	exportGraph: () => WorkflowGraph;
	clearGraph: () => void;
	
	// Selection
	selectedEdgeIds: Set<string>;
	setSelectedEdgeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
}

const initialGraph: WorkflowGraph = {
	nodes: [],
	edges: [],
};

export const useWorkflowStore = create<WorkflowStore>()(
	devtools(
		(set, get) => ({
			...initialGraph,
			selectedEdgeIds: new Set(),

			addNode: (node: WorkflowNode) =>
				set((state) => ({
					nodes: [...state.nodes, node],
				})),

			updateNode: (id: string, updates: Partial<WorkflowNode>) =>
				set((state) => ({
					nodes: state.nodes.map((node) =>
						node.id === id ? { ...node, ...updates } : node
					),
				})),

			deleteNode: (id: string) =>
				set((state) => ({
					nodes: state.nodes.filter((node) => node.id !== id),
					edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
				})),

			addEdge: (edge: Edge) =>
				set((state) => ({
					edges: [...state.edges, edge],
				})),

			deleteEdge: (id: string) =>
				set((state) => ({
					edges: state.edges.filter((edge) => edge.id !== id),
				})),

			connectNodes: (connection: Connection) =>
				set((state) => ({
					edges: addEdge({ ...connection, type: "removable" }, state.edges),
				})),

			updateNodePosition: (id: string, position: { x: number; y: number }) =>
				set((state) => ({
					nodes: state.nodes.map((node) =>
						node.id === id
							? {
									...node,
									position,
									meta: { ...node.meta, x: position.x, y: position.y },
								}
							: node
					),
				})),

			updateNodeConfig: (id: string, config: Record<string, any>) =>
				set((state) => ({
					nodes: state.nodes.map((node) =>
						node.id === id ? { ...node, config: { ...node.config, ...config } } : node
					),
				})),

			importGraph: (graph: WorkflowGraph) =>
				set(() => ({
					nodes: graph.nodes,
					edges: graph.edges,
				})),

			exportGraph: () => {
				const state = get();
				const workflowGraph = {
					nodes: state.nodes,
					edges: state.edges,
				};
				console.log("📤 Final WorkflowGraph:", workflowGraph);
				return workflowGraph;
			},

			clearGraph: () =>
				set(() => ({
					nodes: [],
					edges: [],
					selectedEdgeIds: new Set(),
				})),

			setSelectedEdgeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) =>
				set((state) => ({
					selectedEdgeIds: typeof ids === "function" ? ids(state.selectedEdgeIds) : ids,
				})),
		}),
		{
			name: "workflow-store",
		}
	)
);
