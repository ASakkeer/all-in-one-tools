// Transformations component - Always visible transformation options
interface TransformationsProps {
  onSortKeys: (ascending: boolean) => void
  onRemoveNulls: () => void
  onConvertToPlainText: () => void
  onConvertFromPlainText: () => void
}

export const Transformations = ({
  onSortKeys,
  onRemoveNulls,
  onConvertToPlainText,
  onConvertFromPlainText,
}: TransformationsProps) => {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-0.5">Transform JSON</h3>
        <p className="text-xs text-gray-500">Optional tools to modify JSON structure</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSortKeys(true)}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
        >
          Sort Keys (Ascending)
        </button>
        <button
          onClick={() => onSortKeys(false)}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
        >
          Sort Keys (Descending)
        </button>
        <button
          onClick={onRemoveNulls}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
        >
          Remove Null / Empty Values
        </button>
        <button
          onClick={onConvertToPlainText}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
        >
          Convert JSON → Plain Text
        </button>
        <button
          onClick={onConvertFromPlainText}
          className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-150 text-sm border border-gray-200 shadow-sm"
        >
          Convert Plain Text → JSON
        </button>
      </div>
    </div>
  )
}
