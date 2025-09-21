import { create } from "zustand";
import type { Node, Edge, Connection } from "reactflow";
import { addEdge } from "reactflow";
import type { NodeSerializable, ValidationResult } from "../types/node";
import { nodeRegistry } from "../nodes/index";
import { validateAgainstSchema } from "../lib/validation";

export interface WorkflowNode extends Node {
	config: Record<string, any>;
	meta: {
		x: number;
		y: number;
		collapsed?: boolean;
	};
}

export interface WorkflowGraph {
	nodes: Record<string, NodeSerializable>;
	edges: Record<string, Edge>;
}

interface WorkflowStore {
	// State
	nodes: WorkflowNode[];
	edges: Edge[];
	
	// UI state
	selectedEdgeIds: Set<string>;
	
	// Actions
	addNode: (node: WorkflowNode) => void;
	updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
	deleteNode: (id: string) => void;
	addEdge: (edge: Edge) => void;
	deleteEdge: (id: string) => void;
	connectNodes: (connection: Connection) => void;
	updateNodePosition: (id: string, position: { x: number; y: number }) => void;
	updateNodeConfig: (nodeId: string, configPatch: Record<string, any>) => Promise<ValidationResult>;
	
	// Graph operations
	importGraph: (graph: WorkflowGraph) => void;
	exportGraph: () => WorkflowGraph;
	clearGraph: () => void;
	
	// Selection
	setSelectedEdgeIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
}

export const useWorkflowStore = create<WorkflowStore>()((set, get) => ({
			// Initial state
			nodes: [],
			edges: [],
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

			updateNodeConfig: async (nodeId: string, configPatch: Record<string, any>): Promise<ValidationResult> => {
				const state = get();
				const node = state.nodes.find(n => n.id === nodeId);
				
				if (!node) {
					return { ok: false, errors: { root: 'Node not found' } };
				}
				
				// Get node definition from registry
				const nodeDefinition = nodeRegistry.getDefinition(node.type || '');
				if (!nodeDefinition) {
					return { ok: false, errors: { root: 'Node type not found in registry' } };
				}
				
				// Merge config with patch
				const mergedConfig = { ...node.config, ...configPatch };
				
				// Validate merged config
				const validationResult = validateAgainstSchema(nodeDefinition.manifest.configSchema, mergedConfig);
				
				if (validationResult.ok) {
					// Update the node config
					set((state) => ({
						nodes: state.nodes.map((n) =>
							n.id === nodeId ? { ...n, config: mergedConfig } : n
						),
					}));
				}
				
				return validationResult;
			},


			importGraph: (graph: WorkflowGraph) => {
				// Convert from serializable format to WorkflowNode format
				const nodes: WorkflowNode[] = Object.values(graph.nodes).map(nodeData => ({
					id: nodeData.id,
					type: nodeData.type,
					position: { x: nodeData.meta.x || 0, y: nodeData.meta.y || 0 },
					data: { label: nodeData.type },
					config: nodeData.config,
					meta: { 
						x: nodeData.meta.x || 0, 
						y: nodeData.meta.y || 0,
						collapsed: nodeData.meta.collapsed || false
					},
				}));
				
				const edges = Object.values(graph.edges);
				
				set(() => ({
					nodes,
					edges,
				}));
			},

			exportGraph: (): WorkflowGraph => {
				const state = get();
				
				// Convert to serializable format
				const nodes: Record<string, NodeSerializable> = {};
				state.nodes.forEach(node => {
					if (node.id) {
						nodes[node.id] = {
							id: node.id,
							type: node.type || '',
							version: 1, // Default version
							config: node.config,
							meta: node.meta,
						};
					}
				});
				
				const edges: Record<string, Edge> = {};
				state.edges.forEach(edge => {
					if (edge.id) {
						edges[edge.id] = edge;
					}
				});
				
				const workflowGraph = { nodes, edges };
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
		}));
