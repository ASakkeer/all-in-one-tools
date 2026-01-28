// Diff Checker tool - Side-by-side and inline text comparison with live diff
import { useMemo, useRef } from "react"
import { useDiffChecker } from "./hooks/useDiffChecker"
import { DiffOptionsControls } from "./components/DiffOptions"
import { DiffSummaryBar } from "./components/DiffSummary"
import { DiffView } from "./components/DiffView"
import type { DiffViewMode } from "./hooks/useDiffChecker"
import { ArrowLeftRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

export const DiffChecker = () => {
  const {
    leftText,
    rightText,
    setLeftText,
    setRightText,
    blocks,
    options,
    viewMode,
    summary,
    activeDiffIndex,
    hasDiffs,
    showUnchanged,
    toggleOption,
    toggleShowUnchanged,
    setView,
    goToNextDiff,
    goToPreviousDiff,
    applyChangeLeftToRight,
    applyChangeRightToLeft,
  } = useDiffChecker()

  const handleViewChange = (mode: DiffViewMode) => {
    setView(mode)
  }

  const leftLines = useMemo(() => leftText.split(/\r?\n/), [leftText])
  const rightLines = useMemo(() => rightText.split(/\r?\n/), [rightText])

  const leftGutterRef = useRef<HTMLDivElement | null>(null)
  const rightGutterRef = useRef<HTMLDivElement | null>(null)
  const diffSectionRef = useRef<HTMLDivElement | null>(null)

  const handleLeftScroll: React.UIEventHandler<HTMLTextAreaElement> = (event) => {
    if (leftGutterRef.current) {
      leftGutterRef.current.scrollTop = event.currentTarget.scrollTop
    }
  }

  const handleRightScroll: React.UIEventHandler<HTMLTextAreaElement> = (event) => {
    if (rightGutterRef.current) {
      rightGutterRef.current.scrollTop = event.currentTarget.scrollTop
    }
  }

  const handleScrollToDiff = () => {
    if (!diffSectionRef.current) return

    const headerOffset = 96 // approximate sticky header height
    const rect = diffSectionRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top - headerOffset

    window.scrollTo({ top: Math.max(scrollTop, 0), behavior: "smooth" })
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-8">
      {/* Diff controls bar - options, view mode, summary */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Group A: Ignore options */}
        <DiffOptionsControls
          options={options}
          onToggleOption={toggleOption}
          showUnchanged={showUnchanged}
          onToggleShowUnchanged={toggleShowUnchanged}
        />

        {/* Group B & C: View mode + summary */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          {/* Group B: View mode */}
          <div className="inline-flex items-center whitespace-nowrap rounded-md border border-gray-200 bg-white p-0.5 text-[11px] shadow-sm">
            <button
              type="button"
              onClick={() => handleViewChange("side-by-side")}
              className={`rounded px-3 py-1 text-[11px] font-medium ${
                viewMode === "side-by-side"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-pressed={viewMode === "side-by-side"}
            >
              Side by side
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("inline")}
              className={`rounded px-3 py-1 text-[11px] font-medium ${
                viewMode === "inline"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-pressed={viewMode === "inline"}
            >
              Inline
            </button>
          </div>

          {/* Group C: Summary */}
          <DiffSummaryBar summary={summary} />
        </div>
      </div>

      {/* Action bar - merge and navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Apply all actions */}
        <div className="inline-flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
          <span className="text-gray-500 whitespace-nowrap">Apply all</span>
            <button
              type="button"
              onClick={() => applyChangeLeftToRight("all")}
              disabled={!hasDiffs}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Apply all changes from left to right"
            title="Apply all changes from left to right"
          >
            <ArrowLeftRight className="h-3 w-3 rotate-180" />
            <span>Left → Right</span>
          </button>
          <button
            type="button"
            onClick={() => applyChangeRightToLeft("all")}
            disabled={!hasDiffs}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Apply all changes from right to left"
            title="Apply all changes from right to left"
          >
            <ArrowLeftRight className="h-3 w-3" />
            <span>Right → Left</span>
          </button>
        </div>

        {/* Navigation actions */}
        <div className="inline-flex items-center justify-end gap-2 text-[11px] text-gray-600">
          <span className="text-gray-500 whitespace-nowrap">Navigate</span>
          <button
            type="button"
            onClick={goToPreviousDiff}
            disabled={!hasDiffs}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous difference"
            title="Previous difference"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Prev</span>
          </button>
          <button
            type="button"
            onClick={goToNextDiff}
            disabled={!hasDiffs}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next difference"
            title="Next difference"
          >
            <ChevronRight className="h-3 w-3" />
            <span>Next</span>
          </button>
        </div>
      </div>

      {/* Main workspace: editors + diff viewer */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        {/* Input editors section */}
        <div className="flex flex-[3] min-h-0 gap-4">
          {/* Original text editor */}
          <div className="flex flex-1 flex-col min-w-0">
            <label
              htmlFor="diff-left-text"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Original text
            </label>
            <div className="flex flex-1 max-h-[27rem] sm:max-h-[30rem] rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <div
                ref={leftGutterRef}
                className="hidden h-full select-none border-r border-gray-200 bg-gray-100 px-2 py-3 text-xs text-gray-400 sm:block sm:overflow-hidden"
                aria-hidden="true"
              >
                {leftLines.map((_, index) => (
                  <div key={index} className="leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
              <textarea
                id="diff-left-text"
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                onScroll={handleLeftScroll}
                className="block h-full w-full flex-1 resize-none border-0 bg-transparent p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                placeholder="Paste or type the original text here..."
              />
            </div>
          </div>

          {/* Modified text editor */}
          <div className="flex flex-1 flex-col min-w-0">
            <label
              htmlFor="diff-right-text"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Modified text
            </label>
            <div className="flex flex-1 max-h-[26rem] sm:max-h-[30rem] rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              <div
                ref={rightGutterRef}
                className="hidden h-full select-none border-r border-gray-200 bg-gray-100 px-2 py-3 text-xs text-gray-400 sm:block sm:overflow-hidden"
                aria-hidden="true"
              >
                {rightLines.map((_, index) => (
                  <div key={index} className="leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
              <textarea
                id="diff-right-text"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                onScroll={handleRightScroll}
                className="block h-full w-full flex-1 resize-none border-0 bg-transparent p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                placeholder="Paste or type the modified text here..."
              />
            </div>
          </div>
        </div>

        {/* Diff viewer section */}
        <div
          ref={diffSectionRef}
          className="flex flex-[2] min-h-0 overflow-hidden"
        >
          {hasDiffs ? (
            <DiffView
              blocks={blocks}
              viewMode={viewMode}
              activeDiffIndex={activeDiffIndex}
              onApplyLeftToRight={applyChangeLeftToRight}
              onApplyRightToLeft={applyChangeRightToLeft}
              showUnchanged={showUnchanged}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-green-100 bg-green-50 px-4 py-6 text-sm text-gray-700">
              <div className="text-center">
                {leftText || rightText ? (
                  <>
                    <p className="font-medium text-gray-900">
                      No differences found. The texts are identical.
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      This comparison respects the current ignore options.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-900">
                      Paste text on both sides to see differences here.
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      This area will show a line-by-line comparison once you add content.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating View differences button - centered at bottom of viewport */}
      {hasDiffs && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
            <button
              type="button"
              onClick={handleScrollToDiff}
              className="pointer-events-auto inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#088108] px-4 py-1.5 text-xs font-medium text-white shadow-md transition-colors duration-150 hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
            aria-label="Scroll to diff results"
            title="Scroll to diff results"
          >
            <span>View differences</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}

