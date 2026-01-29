// Timestamp input panel - primary input, options, and convert/reset actions
import type { FC, RefObject } from "react"
import type { TimestampUnit, TimezoneMode } from "../utils/timestampUtils"

type TimestampInputPanelProps = {
  input: string
  onChangeInput: (value: string) => void
  unit: TimestampUnit
  onChangeUnit: (unit: TimestampUnit) => void
  timezone: TimezoneMode
  onChangeTimezone: (tz: TimezoneMode) => void
  autoDetect: boolean
  onChangeAutoDetect: (value: boolean) => void
  onConvert: () => void
  onUseCurrentTime: () => void
  onClearAll: () => void
  error: string | null
  isConverting: boolean
  inputRef: RefObject<HTMLInputElement | null>
}

export const TimestampInputPanel: FC<TimestampInputPanelProps> = ({
  input,
  onChangeInput,
  unit,
  onChangeUnit,
  timezone,
  onChangeTimezone,
  autoDetect,
  onChangeAutoDetect,
  onConvert,
  onUseCurrentTime,
  onClearAll,
  error,
  isConverting,
  inputRef,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Timestamp input</h2>
          <p className="mt-1 text-xs text-gray-600">
            Enter a Unix timestamp or date. Conversion only runs when you click Convert.
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Timestamp unit</label>
            <div className="inline-flex items-center whitespace-nowrap rounded-md border border-gray-200 bg-white p-0.5 text-[11px] shadow-sm">
              <button
                type="button"
                onClick={() => onChangeUnit("seconds")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  unit === "seconds" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={unit === "seconds"}
              >
                Seconds
              </button>
              <button
                type="button"
                onClick={() => onChangeUnit("milliseconds")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  unit === "milliseconds" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={unit === "milliseconds"}
              >
                Milliseconds
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
            <div className="inline-flex items-center whitespace-nowrap rounded-md border border-gray-200 bg-white p-0.5 text-[11px] shadow-sm">
              <button
                type="button"
                onClick={() => onChangeTimezone("local")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  timezone === "local" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={timezone === "local"}
              >
                Local
              </button>
              <button
                type="button"
                onClick={() => onChangeTimezone("utc")}
                className={`rounded px-3 py-1 text-[11px] font-medium ${
                  timezone === "utc" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-pressed={timezone === "utc"}
              >
                UTC
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
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
            <p className="text-[11px] text-gray-500">
              With auto-detect off, input is treated as a Unix timestamp in the selected unit.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUseCurrentTime}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
          >
            Use current time
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

      <div className="mt-3">
        <label htmlFor="timestamp-input" className="block text-sm font-medium text-gray-700 mb-2">
          Timestamp or date
        </label>
        <input
          id="timestamp-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          placeholder="e.g. 1738128000000, 1738128000, 2026-01-29T10:30:00Z, or 2026-01-29 10:30:00"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

