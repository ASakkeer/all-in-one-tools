// Date input panel - date picker/manual input, options, and convert/reset actions
import type { FC } from "react"
import type { DateDetectedFormat, DateTimezoneMode } from "../utils/dateUtils"

type DateInputPanelProps = {
  input: string
  onChangeInput: (value: string) => void
  timezone: DateTimezoneMode
  onChangeTimezone: (tz: DateTimezoneMode) => void
  autoDetect: boolean
  onChangeAutoDetect: (value: boolean) => void
  explicitFormat: DateDetectedFormat | null
  onChangeExplicitFormat: (fmt: DateDetectedFormat) => void
  onConvert: () => void
  onUseToday: () => void
  onClearAll: () => void
  error: string | null
  isConverting: boolean
}

export const DateInputPanel: FC<DateInputPanelProps> = ({
  input,
  onChangeInput,
  timezone,
  onChangeTimezone,
  autoDetect,
  onChangeAutoDetect,
  explicitFormat,
  onChangeExplicitFormat,
  onConvert,
  onUseToday,
  onClearAll,
  error,
  isConverting,
}) => {
  const handleDatePickerChange = (value: string) => {
    // Date picker always gives YYYY-MM-DD
    onChangeInput(value)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Date input</h2>
          <p className="mt-1 text-xs text-gray-600">
            Enter or pick a date. Conversion runs only when you click Convert.
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

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date interpretation</label>
            <div className="inline-flex items-center whitespace-nowrap rounded-md border border-gray-200 bg-white p-0.5 text-[11px] shadow-sm">
              <button
                type="button"
                onClick={() => onChangeTimezone("local")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  timezone === "local" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={timezone === "local"}
              >
                Local date
              </button>
              <button
                type="button"
                onClick={() => onChangeTimezone("utc")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  timezone === "utc" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={timezone === "utc"}
              >
                UTC date
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Format detection</label>
            <div className="flex flex-col gap-1.5">
              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => onChangeAutoDetect(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Auto-detect input format
              </label>
              {!autoDetect && (
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-700">
                  <span className="text-gray-500">Treat input as:</span>
                  <select
                    value={explicitFormat ?? "yyyy-mm-dd"}
                    onChange={(e) => onChangeExplicitFormat(e.target.value as DateDetectedFormat)}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="iso-8601-date">ISO 8601 date</option>
                    <option value="textual">Textual (e.g. March 10, 2026)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUseToday}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
          >
            Use today&apos;s date
          </button>
        </div>

        <button
          type="button"
          onClick={onConvert}
          disabled={isConverting}
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#088108] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConverting ? "Converting…" : "Convert"}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Pick a date</label>
          <input
            type="date"
            value={/^\d{4}-\d{2}-\d{2}$/.test(input.trim()) ? input.trim() : ""}
            onChange={(e) => handleDatePickerChange(e.target.value)}
            className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="date-input-manual" className="text-sm font-medium text-gray-700">
            Or enter manually
          </label>
          <input
            id="date-input-manual"
            type="text"
            value={input}
            onChange={(e) => onChangeInput(e.target.value)}
            className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            placeholder="e.g. 2026-03-10, 10/03/2026, March 10, 2026"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

