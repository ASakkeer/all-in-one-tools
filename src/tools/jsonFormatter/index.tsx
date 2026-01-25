// JSON Formatter tool - Main container component with editor-first layout
// Primary actions always visible, editors always editable, errors inline
import { useJsonFormatter } from "./hooks/useJsonFormatter"
import { JsonInput } from "./components/JsonInput"
import { JsonOutput } from "./components/JsonOutput"
import { EditorPanel } from "./components/EditorPanel"
import { TransformActions } from "./components/TransformActions"
import { AdvancedPanel } from "./components/AdvancedPanel"
import { useRef, useState } from "react"
import { Trash2, Clipboard, Copy, Check } from "lucide-react"

export const JsonFormatter = () => {
  const {
    input,
    setInput,
    output,
    error,
    errorLine,
    errorColumn,
    copied,
    validationResult,
    sizeInfo,
    outputRef,
    format,
    minify,
    sortKeys,
    removeNulls,
    convertToPlainText,
    convertFromPlainText,
    validate,
    downloadJson,
    clear,
    copyToClipboard,
  } = useJsonFormatter()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
    }
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch (err) {
      // Gracefully fail if permission denied
      console.warn("Clipboard read permission denied")
    }
  }

  const handleCopyOutput = () => {
    copyToClipboard()
    setShowCopySuccess(true)
    setTimeout(() => {
      setShowCopySuccess(false)
    }, 1500)
  }

  const handleClearInput = () => {
    clear()
  }

  return (
    <div className="space-y-6">
      {/* Primary Actions - Always visible horizontal toolbar */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200">
        <button
          onClick={format}
          disabled={!input.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 text-sm"
        >
          Format
        </button>
        <button
          onClick={minify}
          disabled={!input.trim()}
          className="px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
        >
          Minify
        </button>
        {output && (
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2.5 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm ${
              copied ? "bg-blue-50 text-blue-700" : "text-gray-600"
            }`}
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
        )}
        <button
          onClick={clear}
          disabled={!input.trim() && !output}
          className="px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
        >
          Clear
        </button>
      </div>

      {/* Editor-first layout - Two columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Editor Panel - Always editable */}
        <EditorPanel
          title="Input JSON"
          error={error}
          errorLine={errorLine}
          errorColumn={errorColumn}
          toolbarButtons={[
            {
              label: "Upload",
              onClick: handleUpload,
            },
          ]}
          actionIcons={
            <>
              <button
                onClick={handlePaste}
                className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                title="Paste from clipboard"
                aria-label="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearInput}
                disabled={!input.trim()}
                className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                title="Clear input"
                aria-label="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          }
        >
          <JsonInput 
            value={input} 
            onChange={setInput}
            errorLine={errorLine}
            errorColumn={errorColumn}
          />
        </EditorPanel>

        {/* Output Editor Panel - Read-only */}
        <EditorPanel
          title="Formatted Output"
          toolbarButtons={[
            {
              label: "Download",
              onClick: downloadJson,
              disabled: !output,
            },
          ]}
          actionIcons={
            <button
              onClick={handleCopyOutput}
              disabled={!output}
              className={`p-1.5 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 ${
                showCopySuccess
                  ? "text-green-600 hover:bg-green-50"
                  : output
                    ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 cursor-not-allowed"
              }`}
              title={showCopySuccess ? "Copied!" : "Copy output"}
              aria-label="Copy output"
            >
              {showCopySuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          }
        >
          <JsonOutput output={output} outputRef={outputRef} />
        </EditorPanel>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Transform Actions - Always visible, clearly labeled */}
      <div>
        <TransformActions
          onSortKeys={sortKeys}
          onRemoveNulls={removeNulls}
          onConvertToPlainText={convertToPlainText}
          onConvertFromPlainText={convertFromPlainText}
        />
      </div>

      {/* Advanced Panel - Secondary informational, always visible */}
      <div className="lg:max-w-md">
        <AdvancedPanel
          onValidate={validate}
          validationResult={validationResult}
          sizeInfo={sizeInfo}
          hasOutput={!!output}
        />
      </div>
    </div>
  )
}
