// Home page component - Landing page with tool cards
import { useNavigate } from "react-router-dom"

type ToolStatus = "active" | "coming-soon"

interface ToolConfig {
  id: string
  name: string
  description: string
  route: string
  status: ToolStatus
}

const tools: ToolConfig[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON data",
    route: "/tools/json-formatter",
    status: "active",
  },
  {
    id: "text-cleaner",
    name: "Text Cleaner",
    description: "Clean and normalize messy text",
    route: "/tools/text-cleaner",
    status: "active",
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality",
    route: "/tools/image-compressor",
    status: "coming-soon",
  },
]

const Home = () => {
  const navigate = useNavigate()

  const handleToolClick = (tool: ToolConfig) => {
    if (tool.status === "active") {
      navigate(tool.route)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Free Web Tools
          </h1>
          <p className="text-lg text-gray-600">
            No login. No ads. Everything runs in your browser.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className={`
                bg-white rounded-lg shadow-sm border border-gray-200 p-6
                transition-all duration-200
                ${
                  tool.status === "active"
                    ? "cursor-pointer hover:shadow-md hover:border-gray-300"
                    : "opacity-60 cursor-not-allowed"
                }
              `}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tool.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
              {tool.status !== "active" && (
                <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
