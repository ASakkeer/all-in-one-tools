// Transform Actions component - Horizontal action strip
// Always visible, clearly labeled, no icons
interface TransformActionsProps {
  onSortKeys: (ascending: boolean) => void
  onRemoveNulls: () => void
  onConvertToPlainText: () => void
  onConvertFromPlainText: () => void
}

export const TransformActions = ({
  onSortKeys,
  onRemoveNulls,
  onConvertToPlainText,
  onConvertFromPlainText,
}: TransformActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Transform JSON (optional)</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSortKeys(true)}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
        >
          Sort Keys (Asc)
        </button>
        <button
          onClick={() => onSortKeys(false)}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
        >
          Sort Keys (Desc)
        </button>
        <button
          onClick={onRemoveNulls}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
        >
          Remove Null / Empty
        </button>
        <button
          onClick={onConvertToPlainText}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
        >
          JSON → Text
        </button>
        <button
          onClick={onConvertFromPlainText}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 shadow-sm"
        >
          Text → JSON
        </button>
      </div>
    </div>
  )
}
