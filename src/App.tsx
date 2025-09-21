import WorkflowBuilder from "@/components/WorkflowBuilder"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { useWorkflowStore } from "@/stores/workflowStore"
import { useState } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"

function App() {
  const exportGraph = useWorkflowStore((state) => state.exportGraph)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const workflowData = exportGraph()
      const jsonString = JSON.stringify(workflowData, null, 2)
      
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonString,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const prettifiedResult = JSON.stringify(result, null, 2)
      
      toast.success(
        <div className="space-y-2">
          {/* <div className="font-semibold">✅ Workflow submitted successfully!</div> */}
          <div className="text-sm">
            <div className="font-medium mb-1">Response:</div>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {prettifiedResult}
            </pre>
          </div>
        </div>,
        {
          duration: 10000, // Show for 10 seconds
        }
      )
      console.log("API Response:", prettifiedResult)
    } catch (error) {
      console.error("Failed to submit workflow:", error)
      toast.error("Failed to submit workflow. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <WorkflowBuilder />
      
      {/* Submit Button - Absolute positioned at middle bottom */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Send size={20} className="mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Workflow"}
        </Button>
      </div>

      <Toaster />
    </>
  )
}

export default App