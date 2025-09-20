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
import { Copy, Download } from "lucide-react";
import { useWorkflowStore } from "../stores/workflowStore";

export default function ExportDialog() {
	const [open, setOpen] = useState(false);
	const exportGraph = useWorkflowStore((state) => state.exportGraph);
	const [copied, setCopied] = useState(false);

	const handleExport = () => {
		const graph = exportGraph();
		return JSON.stringify(graph, null, 2);
	};

	const handleCopy = async () => {
		try {
			const jsonString = handleExport();
			await navigator.clipboard.writeText(jsonString);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
		}
	};

	const handleDownload = () => {
		const jsonString = handleExport();
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "workflow.json";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full">
					<Download size={16} className="mr-2" />
					Export
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Export Workflow</DialogTitle>
					<DialogDescription>
						Copy or download your workflow configuration as JSON.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Textarea
						value={handleExport()}
						readOnly
						className="min-h-[300px] max-h-[400px] font-mono text-sm"
						placeholder="Workflow JSON will appear here..."
					/>
					<div className="flex gap-2">
						<Button onClick={handleCopy} className="flex-1">
							<Copy size={16} className="mr-2" />
							{copied ? "Copied!" : "Copy to Clipboard"}
						</Button>
						<Button onClick={handleDownload} variant="outline" className="flex-1">
							<Download size={16} className="mr-2" />
							Download JSON
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
