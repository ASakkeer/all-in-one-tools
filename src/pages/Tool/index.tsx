// Tool page component - Displays individual tool pages
import { useParams } from "react-router-dom"
import { JsonFormatter } from "@/tools/jsonFormatter"

const Tool = () => {
  const { toolId } = useParams<{ toolId: string }>()

  if (toolId === "json-formatter") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              JSON Formatter
            </h1>
            <p className="text-gray-600">
              Format and validate JSON data in your browser
            </p>
          </div>
          {/* Tool Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <JsonFormatter />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600">Tool not found</p>
        </div>
      </div>
    </div>
  )
}

export default Tool
