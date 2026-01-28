// Primary Actions component - Most common actions
interface PrimaryActionsProps {
  onFormat: () => void
  onMinify: () => void
  onCopy: () => void
  onClear: () => void
  copied: boolean
  hasOutput: boolean
  hasInput: boolean
}

export const PrimaryActions = ({
  onFormat,
  onMinify,
  onCopy,
  onClear,
  copied,
  hasOutput,
  hasInput,
}: PrimaryActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Action - Format */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onFormat()
        }}
        disabled={!hasInput}
        className="px-6 py-2.5 rounded-lg bg-[#088108] text-white font-medium shadow-sm hover:bg-[#066306] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#088108] disabled:hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-150 text-sm"
        onMouseDown={(e) => e.preventDefault()}
      >
        Format JSON
      </button>
      
      {/* Secondary Actions */}
      <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onMinify()
          }}
          disabled={!hasInput}
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
          onMouseDown={(e) => e.preventDefault()}
        >
          Minify
        </button>
        {hasOutput && (
          <button
            onClick={onCopy}
            className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
        <button
          onClick={onClear}
          disabled={!hasInput && !hasOutput}
          className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
