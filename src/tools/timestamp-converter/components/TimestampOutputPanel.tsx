// Timestamp output panel - primary results, common formats, advanced details, and metadata
import type { FC } from "react"
import type { TimestampConversionResult } from "../utils/timestampUtils"

type CopyHandler = (value: string) => void

type TimestampOutputPanelProps = {
  result: TimestampConversionResult | null
  onCopy: CopyHandler
  success: string | null
  statsBar: {
    detectedFormat: string
    timezone: string
    precision: string
  }
}

const OutputField: FC<{
  label: string
  value: string
  onCopy: CopyHandler
}> = ({ label, value, onCopy }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={value}
          className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        />
        <button
          type="button"
          onClick={() => onCopy(value)}
          className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export const TimestampOutputPanel: FC<TimestampOutputPanelProps> = ({ result, onCopy, success, statsBar }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Converted values</h2>
          <p className="mt-1 text-xs text-gray-600">
            Most-used values are shown first. Open the sections below for more formats and context.
          </p>
        </div>
      </div>

      {/* Optional stats / context bar */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-700">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Detected</span>
          <span className="font-medium text-gray-900">{statsBar.detectedFormat}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Timezone</span>
          <span className="font-medium text-gray-900">{statsBar.timezone}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Precision</span>
          <span className="font-medium text-gray-900">{statsBar.precision}</span>
        </span>
      </div>

      {/* Primary results */}
      <section aria-label="Primary timestamp results" className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-gray-800">Primary results</h3>
          <p className="text-[11px] text-gray-500">Most commonly needed values, always visible.</p>
        </div>
        {result ? (
          <div className="grid grid-cols-1 gap-2">
            <OutputField label="Unix timestamp (seconds)" value={result.primary.unixSeconds} onCopy={onCopy} />
            <OutputField
              label="Unix timestamp (milliseconds)"
              value={result.primary.unixMilliseconds}
              onCopy={onCopy}
            />
            <OutputField label="ISO 8601" value={result.primary.iso8601} onCopy={onCopy} />
            <OutputField label="Local time" value={result.primary.local} onCopy={onCopy} />
            <OutputField label="UTC time" value={result.primary.utc} onCopy={onCopy} />
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Convert a timestamp to see primary results here. These will include Unix timestamps, ISO 8601, and
            local/UTC representations.
          </p>
        )}
      </section>

      {/* Common formats */}
      <section aria-label="Common date and time formats" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Common formats</h3>
              <p className="text-[11px] text-gray-500">
                Quick date and time formats without overwhelming the main view.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
            {result ? (
              <div className="grid grid-cols-1 gap-2">
                <OutputField label="RFC 2822" value={result.common.rfc2822} onCopy={onCopy} />
                <OutputField label="YYYY-MM-DD" value={result.common.yyyyMmDd} onCopy={onCopy} />
                <OutputField
                  label="YYYY-MM-DD HH:mm:ss"
                  value={result.common.yyyyMmDdHhMmSs}
                  onCopy={onCopy}
                />
                <OutputField label="DD/MM/YYYY" value={result.common.ddMmYyyy} onCopy={onCopy} />
                <OutputField label="MM/DD/YYYY" value={result.common.mmDdYyyy} onCopy={onCopy} />
                <OutputField label="12-hour time (AM/PM)" value={result.common.time12h} onCopy={onCopy} />
                <OutputField label="24-hour time" value={result.common.time24h} onCopy={onCopy} />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Convert a timestamp to see common date and time formats like RFC 2822 or YYYY-MM-DD here.
              </p>
            )}
          </div>
        </details>
      </section>

      {/* Advanced / technical formats */}
      <section aria-label="Advanced and technical formats" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Advanced &amp; technical formats</h3>
              <p className="text-[11px] text-gray-500">
                ISO week date, week number, language-specific, and database-friendly formats.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
            {result ? (
              <div className="grid grid-cols-1 gap-2">
                <OutputField label="ISO week date" value={result.advanced.isoWeekDate} onCopy={onCopy} />
                <OutputField label="Day of year" value={result.advanced.dayOfYear} onCopy={onCopy} />
                <OutputField label="Week number" value={result.advanced.weekNumber} onCopy={onCopy} />
                <OutputField label="Quarter" value={result.advanced.quarter} onCopy={onCopy} />
                <OutputField
                  label="Unix timestamp (nanoseconds, derived)"
                  value={result.advanced.unixNanoseconds}
                  onCopy={onCopy}
                />
                <OutputField label="JavaScript Date.toString()" value={result.advanced.jsDateString} onCopy={onCopy} />
                <OutputField label="Java Instant" value={result.advanced.javaInstant} onCopy={onCopy} />
                <OutputField label="Python datetime" value={result.advanced.pythonDatetime} onCopy={onCopy} />
                <OutputField
                  label="PostgreSQL / MySQL timestamp"
                  value={result.advanced.sqlTimestamp}
                  onCopy={onCopy}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Convert a timestamp to see advanced and technical formats that map to code and databases.
              </p>
            )}
          </div>
        </details>
      </section>

      {/* Metadata & context */}
      <section aria-label="Metadata and context" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Metadata &amp; context</h3>
              <p className="text-[11px] text-gray-500">
                Timezone offset, DST status, day of week, and leap year information.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3">
            {result ? (
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs text-gray-700 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-gray-800">Timezone offset</dt>
                  <dd className="mt-0.5 text-gray-700">
                    {result.metadata.timezoneOffsetLabel} (
                    {result.metadata.timezoneOffsetMinutes} minutes from UTC)
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-800">Daylight Saving Time</dt>
                  <dd className="mt-0.5 text-gray-700">
                    {result.metadata.isDst ? "In daylight saving time" : "Standard time"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-800">Day of week</dt>
                  <dd className="mt-0.5 text-gray-700">{result.metadata.dayOfWeek}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-800">Leap year</dt>
                  <dd className="mt-0.5 text-gray-700">
                    {result.metadata.isLeapYear ? "Yes, leap year" : "No, not a leap year"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-xs text-gray-500">
                Convert a timestamp to see metadata like timezone offset, DST status, and leap year info here.
              </p>
            )}
          </div>
        </details>
      </section>

      {success && (
        <p className="mt-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
          {success}
        </p>
      )}
    </div>
  )
}

