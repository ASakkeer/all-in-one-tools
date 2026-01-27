// Advanced Panel component - Secondary informational panel
interface AdvancedPanelProps {
  onValidate: () => void
  validationResult: { valid: boolean; message: string } | null
  sizeInfo: { characters: number; bytes: number } | null
  hasOutput: boolean
}

export const AdvancedPanel = ({
  onValidate,
  validationResult,
  sizeInfo,
  hasOutput,
}: AdvancedPanelProps) => {
  return (
    <div className="bg-gray-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Advanced</h4>
      
      {/* Validation */}
      <div className="space-y-2">
        <button
          onClick={onValidate}
          className="w-full px-3 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
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

      {!hasOutput && (
        <p className="text-xs text-gray-400 italic">Format JSON to see size information</p>
      )}
    </div>
  )
}
