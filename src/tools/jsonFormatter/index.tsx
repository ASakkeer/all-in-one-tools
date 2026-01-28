// JSON Formatter tool - Main container component with editor-first layout
// Primary actions always visible, editors always editable, errors inline
import { useJsonFormatter } from "./hooks/useJsonFormatter"
import { JsonInput } from "./components/JsonInput"
import { JsonOutput } from "./components/JsonOutput"
import { EditorPanel } from "./components/EditorPanel"
import { useRef, useState } from "react"
import { Trash2, Copy, Check, Sparkles, Minus, ArrowUp, ArrowDown, Filter } from "lucide-react"

export const JsonFormatter = () => {
  const {
    input,
    setInput,
    output,
    error,
    errorLine,
    errorColumn,
    copied,
    sizeInfo,
    outputRef,
    format,
    minify,
    sortKeys,
    removeNulls,
    convertToPlainText,
    convertFromPlainText,
    sortOutputKeys,
    removeOutputNulls,
    convertOutputToPlainText,
    convertOutputFromPlainText,
    downloadJson,
    clear,
    copyToClipboard,
  } = useJsonFormatter()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCopyInputSuccess, setShowCopyInputSuccess] = useState(false)
  const [showCopyOutputSuccess, setShowCopyOutputSuccess] = useState(false)
  const [lastInputAction, setLastInputAction] = useState<string | null>(null)
  const [lastOutputAction, setLastOutputAction] = useState<string | null>(null)

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

  const handleFormat = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    format()
    setLastInputAction("format")
    // Reset output highlights when Format is pressed
    setLastOutputAction(null)
  }

  const handleMinify = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    minify()
    setLastInputAction("minify")
    // Reset output highlights when Minify is pressed
    setLastOutputAction(null)
  }

  const handleCopyInput = async () => {
    if (input.trim()) {
      try {
        await navigator.clipboard.writeText(input)
        setShowCopyInputSuccess(true)
        setLastInputAction("copy")
        setTimeout(() => {
          setShowCopyInputSuccess(false)
          setLastInputAction(null)
        }, 1500)
      } catch (err) {
        console.warn("Failed to copy to clipboard")
      }
    }
  }

  const handleCopyOutput = () => {
    copyToClipboard()
    setShowCopyOutputSuccess(true)
    setLastOutputAction("copy")
    setTimeout(() => {
      setShowCopyOutputSuccess(false)
      setLastOutputAction(null)
    }, 1500)
  }

  const handleClearInput = () => {
    clear()
    setLastInputAction("clear")
    setTimeout(() => setLastInputAction(null), 2000)
  }

  const handleSortOutputKeys = (ascending: boolean) => {
    sortOutputKeys(ascending)
    // Highlight persists until another action is pressed
    setLastOutputAction(ascending ? "sortAsc" : "sortDesc")
  }

  const handleRemoveOutputNulls = () => {
    removeOutputNulls()
    // Highlight persists until another action is pressed
    setLastOutputAction("removeNulls")
  }

  return (
    <div>
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
                onClick={handleFormat}
                disabled={!input.trim()}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastInputAction === "format"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Format JSON"
                aria-label="Format JSON"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={handleMinify}
                disabled={!input.trim()}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastInputAction === "minify"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Minify JSON"
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Minify JSON"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyInput}
                disabled={!input.trim()}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300 ${
                  showCopyInputSuccess
                    ? "text-emerald-700 hover:bg-emerald-50"
                    : lastInputAction === "copy"
                      ? "text-emerald-700 bg-emerald-50"
                      : input.trim()
                        ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        : "text-gray-300 cursor-not-allowed"
                }`}
                title={showCopyInputSuccess ? "Copied!" : "Copy input"}
                aria-label="Copy input"
              >
                {showCopyInputSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleClearInput}
                disabled={!input.trim()}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastInputAction === "clear"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
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
        <div>
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
            <>
              <button
                onClick={() => handleSortOutputKeys(true)}
                disabled={!output}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastOutputAction === "sortAsc"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Sort keys ascending"
                aria-label="Sort keys ascending"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSortOutputKeys(false)}
                disabled={!output}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastOutputAction === "sortDesc"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Sort keys descending"
                aria-label="Sort keys descending"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveOutputNulls}
                disabled={!output}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 ${
                  lastOutputAction === "removeNulls"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Remove null / empty"
                aria-label="Remove null / empty"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyOutput}
                disabled={!output}
                className={`p-1.5 rounded transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-300 ${
                  showCopyOutputSuccess
                    ? "text-emerald-700 hover:bg-emerald-50"
                    : lastOutputAction === "copy"
                      ? "text-emerald-700 bg-emerald-50"
                      : output
                        ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        : "text-gray-300 cursor-not-allowed"
                }`}
                title={showCopyOutputSuccess ? "Copied!" : "Copy output"}
                aria-label="Copy output"
              >
                {showCopyOutputSuccess ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </>
          }
          >
            <JsonOutput output={output} outputRef={outputRef} />
          </EditorPanel>
          
          {/* Size information - Below Output editor */}
          <div className="flex justify-end mt-2">
            {sizeInfo && output ? (
              <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  {sizeInfo.characters.toLocaleString()} chars • {sizeInfo.bytes.toLocaleString()} bytes
                </p>
              </div>
            ) : !output ? (
              <p className="text-xs text-gray-400 italic">Format JSON to see size information</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

    </div>
  )
}
