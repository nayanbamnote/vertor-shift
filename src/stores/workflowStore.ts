import { create } from "zustand";
import type { Node, Edge, Connection } from "reactflow";
import { addEdge } from "reactflow";
import type { NodeSerializable, ValidationResult } from "../types/node";
import { nodeRegistry } from "../nodes/index";
import { validateAgainstSchema } from "../lib/validation";
import type { Variable } from "../lib/variableUtils";
import { substituteVariables } from "../lib/variableUtils";

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
	
	// Variable operations
	getAvailableVariables: (nodeId: string) => Variable[];
	getVariableValue: (nodeId: string, variableName: string) => string | undefined;
	executeNodeWithVariables: (nodeId: string) => any;
	
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

			// Variable operations
			getAvailableVariables: (nodeId: string): Variable[] => {
				const state = get();
				const variables: Variable[] = [];
				
				// Find all input nodes that are connected to this node (directly or indirectly)
				const connectedInputNodes = state.nodes.filter(node => {
					if (node.type !== 'input-node') return false;
					
					// Check if there's a path from this input node to the target node
					return state.edges.some(edge => 
						edge.source === node.id && 
						(edge.target === nodeId || isConnectedToNode(edge.target, nodeId, state.edges))
					);
				});
				
				// Extract variables from connected input nodes
				connectedInputNodes.forEach(node => {
					if (node.config.variableName && node.config.variableName.trim()) {
						variables.push({
							name: node.config.variableName,
							value: node.config.value || '',
							type: node.config.dataType || 'text',
							nodeId: node.id
						});
					}
				});
				
				return variables;
			},

			getVariableValue: (nodeId: string, variableName: string): string | undefined => {
				const variables = get().getAvailableVariables(nodeId);
				const variable = variables.find(v => v.name === variableName);
				return variable?.value;
			},

			executeNodeWithVariables: (nodeId: string): any => {
				const state = get();
				const node = state.nodes.find(n => n.id === nodeId);
				
				if (!node) {
					return { error: 'Node not found' };
				}

				// Get available variables for this node
				const variables = get().getAvailableVariables(nodeId);

				// Handle different node types
				switch (node.type) {
					case 'text-node': {
						const template = node.config.text || '';
						const processedText = substituteVariables(template, variables);
						return {
							type: 'text',
							value: processedText,
							template,
							variables: variables.map(v => ({ name: v.name, value: v.value, type: v.type }))
						};
					}
					
					case 'input-node': {
						return {
							type: 'variable',
							name: node.config.variableName,
							value: node.config.value,
							dataType: node.config.dataType
						};
					}
					
					default: {
						return {
							type: 'unknown',
							nodeType: node.type,
							config: node.config
						};
					}
				}
			},
		}));

// Helper function to check if nodes are connected
function isConnectedToNode(sourceId: string, targetId: string, edges: Edge[]): boolean {
	if (sourceId === targetId) return true;
	
	const directConnections = edges.filter(edge => edge.source === sourceId);
	return directConnections.some(edge => 
		edge.target === targetId || isConnectedToNode(edge.target, targetId, edges)
	);
}
