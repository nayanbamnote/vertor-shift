import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Upload, AlertCircle } from "lucide-react";
import { useWorkflowStore, type WorkflowGraph } from "../stores/workflowStore";

export default function ImportDialog() {
	const [open, setOpen] = useState(false);
	const [jsonInput, setJsonInput] = useState("");
	const [error, setError] = useState("");
	const importGraph = useWorkflowStore((state) => state.importGraph);

	const handleImport = () => {
		try {
			setError("");
			const parsedGraph: WorkflowGraph = JSON.parse(jsonInput);
			
			// Validate the structure
			if (!parsedGraph.nodes || !parsedGraph.edges) {
				throw new Error("Invalid workflow format: missing nodes or edges");
			}
			
			if (typeof parsedGraph.nodes !== 'object' || Array.isArray(parsedGraph.nodes) || 
				typeof parsedGraph.edges !== 'object' || Array.isArray(parsedGraph.edges)) {
				throw new Error("Invalid workflow format: nodes and edges must be objects");
			}

			// Import the graph
			importGraph(parsedGraph);
			
			// Clear the input and close dialog
			setJsonInput("");
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Invalid JSON format");
		}
	};

	const handleClear = () => {
		setJsonInput("");
		setError("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<Upload size={16} className="mr-2" />
					Import
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Import Workflow</DialogTitle>
					<DialogDescription>
						Paste your workflow JSON configuration to load it into the editor.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Textarea
						value={jsonInput}
						onChange={(e) => setJsonInput(e.target.value)}
						className="min-h-[300px] max-h-[400px] font-mono text-sm"
						placeholder="Paste your workflow JSON here..."
					/>
					{error && (
						<div className="flex items-center gap-2 text-destructive text-sm">
							<AlertCircle size={16} />
							{error}
						</div>
					)}
					<div className="flex gap-2">
						<Button onClick={handleImport} className="flex-1" disabled={!jsonInput.trim()}>
							<Upload size={16} className="mr-2" />
							Import Workflow
						</Button>
						<Button onClick={handleClear} variant="outline">
							Clear
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
