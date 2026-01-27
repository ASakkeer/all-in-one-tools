// Word Counter tool - Simple text input with real-time statistics
import { useWordCounter } from "./hooks/useWordCounter"
import { TextInput } from "./components/TextInput"
import { StatsPanel } from "./components/StatsPanel"

export const WordCounter = () => {
  const { text, setText, stats, clear } = useWordCounter()

  const hasText = text.trim().length > 0

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Main workspace - input on the left, stats on the right */}
      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col min-w-0">
          <TextInput value={text} onChange={setText} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Updates in real time as you type. No data leaves your browser.
            </p>
            <button
              type="button"
              onClick={clear}
              disabled={!hasText}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-w-0">
          <StatsPanel stats={stats} />
        </div>
      </div>
    </div>
  )
}

