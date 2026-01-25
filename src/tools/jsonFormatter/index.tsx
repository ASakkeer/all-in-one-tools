// JSON Formatter tool - Main container component
import { useJsonFormatter } from "./hooks/useJsonFormatter"
import { JsonInput } from "./components/JsonInput"
import { JsonOutput } from "./components/JsonOutput"
import { Actions } from "./components/Actions"

export const JsonFormatter = () => {
  const { input, setInput, output, error, format, clear } = useJsonFormatter()

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input JSON
        </label>
        <JsonInput value={input} onChange={setInput} />
      </div>

      <Actions onFormat={format} onClear={clear} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Formatted Output
        </label>
        <JsonOutput output={output} error={error} />
      </div>
    </div>
  )
}
