// Actions component - Format and Clear buttons
interface ActionsProps {
  onFormat: () => void
  onClear: () => void
}

export const Actions = ({ onFormat, onClear }: ActionsProps) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onFormat}
        className="px-6 py-2 rounded-lg bg-[#088108] text-white hover:bg-[#066306] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-colors"
      >
        Format JSON
      </button>
      <button
        onClick={onClear}
        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
