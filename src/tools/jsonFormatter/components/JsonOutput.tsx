// JSON Output component - Shows formatted JSON or error message
interface JsonOutputProps {
  output: string
  error: string | null
}

export const JsonOutput = ({ output, error }: JsonOutputProps) => {
  if (error) {
    return (
      <div className="w-full p-4 border border-red-300 rounded-lg bg-red-50">
        <p className="text-red-800 font-semibold mb-2">Error:</p>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    )
  }

  if (!output) {
    return (
      <div className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Formatted JSON will appear here...</p>
      </div>
    )
  }

  return (
    <pre className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto font-mono text-sm">
      {output}
    </pre>
  )
}
