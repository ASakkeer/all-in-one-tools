// Advanced Tools component - Collapsible advanced features
import { useState } from "react"

interface AdvancedToolsProps {
  onValidate: () => void
  onDownload: () => void
  validationResult: { valid: boolean; message: string } | null
  sizeInfo: { characters: number; bytes: number } | null
  hasOutput: boolean
}

export const AdvancedTools = ({
  onValidate,
  onDownload,
  validationResult,
  sizeInfo,
  hasOutput,
}: AdvancedToolsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="space-y-2">
      {/* Always visible header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-0.5">Advanced</h3>
          <p className="text-xs text-gray-500">Validation, size info, and export options</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          <span className="text-base font-light">{isOpen ? "−" : "+"}</span>
        </button>
      </div>
      
      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-2 space-y-3">
          {/* Validation */}
          <div className="space-y-2">
            <button
              onClick={onValidate}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
            >
              Validate JSON
            </button>
            {validationResult && (
              <div
                className={`p-2.5 rounded text-xs transition-opacity duration-200 ${
                  validationResult.valid
                    ? "text-green-700 bg-green-50/60"
                    : "text-red-700 bg-red-50/60"
                }`}
              >
                {validationResult.message}
              </div>
            )}
          </div>

          {/* Size Info */}
          {sizeInfo && (
            <div className="p-3 bg-white rounded border border-gray-200 shadow-sm">
              <p className="text-xs font-medium text-gray-600 mb-1">JSON Size</p>
              <p className="text-sm text-gray-700">
                {sizeInfo.characters.toLocaleString()} characters • {sizeInfo.bytes.toLocaleString()} bytes
              </p>
            </div>
          )}

          {/* Download */}
          {hasOutput && (
            <button
              onClick={onDownload}
              className="w-full px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
            >
              Download Formatted JSON
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
