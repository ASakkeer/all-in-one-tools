// Days Between Two Dates – left panel: date inputs, options, and actions
import type { FC } from "react"

type DaysBetweenInputPanelProps = {
  startInput: string
  endInput: string
  includeEndDate: boolean
  weekdaysOnly: boolean
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  onIncludeEndDateChange: (value: boolean) => void
  onWeekdaysOnlyChange: (value: boolean) => void
  onCalculate: () => void
  onClearAll: () => void
  onUseTodayStart: () => void
  onUseTodayEnd: () => void
  error: string | null
}

export const DaysBetweenInputPanel: FC<DaysBetweenInputPanelProps> = ({
  startInput,
  endInput,
  includeEndDate,
  weekdaysOnly,
  onStartChange,
  onEndChange,
  onIncludeEndDateChange,
  onWeekdaysOnlyChange,
  onCalculate,
  onClearAll,
  onUseTodayStart,
  onUseTodayEnd,
  error,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Date inputs</h2>
          <p className="mt-1 text-xs text-gray-600">
            Choose start and end dates. Calculate runs only when you click the button.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {/* Start date */}
        <div>
          <label htmlFor="days-between-start" className="block text-xs font-medium text-gray-700 mb-1">
            Start date
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="days-between-start"
              type="date"
              value={startInput}
              onChange={(e) => onStartChange(e.target.value)}
              className="block rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            />
            <button
              type="button"
              onClick={onUseTodayStart}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
            >
              Today
            </button>
          </div>
        </div>

        {/* End date */}
        <div>
          <label htmlFor="days-between-end" className="block text-xs font-medium text-gray-700 mb-1">
            End date
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="days-between-end"
              type="date"
              value={endInput}
              onChange={(e) => onEndChange(e.target.value)}
              className="block rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            />
            <button
              type="button"
              onClick={onUseTodayEnd}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calculation options */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
          <p className="text-xs font-medium text-gray-700">Calculation options</p>
          <label className="inline-flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={includeEndDate}
              onChange={(e) => onIncludeEndDateChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
            />
            Include end date (adds 1 day)
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-gray-700 block mt-2">
            <input
              type="checkbox"
              checked={weekdaysOnly}
              onChange={(e) => onWeekdaysOnlyChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
            />
            Count only weekdays
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onCalculate}
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Calculate
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
