// Tool page component - Displays individual tool pages
import { useParams } from "react-router-dom"

const Tool = () => {
  const { toolId } = useParams<{ toolId: string }>()

  // Convert toolId from kebab-case to Title Case
  const formatToolName = (id: string | undefined): string => {
    if (!id) return "Tool"
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const toolName = formatToolName(toolId)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{toolName}</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600">Tool UI will go here.</p>
        </div>
      </div>
    </div>
  )
}

export default Tool
