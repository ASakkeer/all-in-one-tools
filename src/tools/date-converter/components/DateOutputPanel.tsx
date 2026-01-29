// Date output panel - primary formats, regional formats, technical formats, and metadata
import type { FC } from "react"
import type { DateConversionResult } from "../utils/dateUtils"

type CopyHandler = (value: string) => void

type DateOutputPanelProps = {
  result: DateConversionResult | null
  onCopy: CopyHandler
  success: string | null
  statsBar: {
    detectedFormat: string
    timezone: string
    calendar: string
  }
  customPattern: string
  onChangeCustomPattern: (value: string) => void
  customResult: string
}

const OutputField: FC<{ label: string; value: string; onCopy: CopyHandler }> = ({ label, value, onCopy }) => {
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

export const DateOutputPanel: FC<DateOutputPanelProps> = ({
  result,
  onCopy,
  success,
  statsBar,
  customPattern,
  onChangeCustomPattern,
  customResult,
}) => {
  return (
    <div className="h-full max-h-[700px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Converted dates</h2>
          <p className="mt-1 text-xs text-gray-600">
            Essential formats are shown first. Expand sections below for regional, technical, and metadata views.
          </p>
        </div>
      </div>

      {/* Context bar */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-700 min-h-[45px] max-h-[45px]">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Detected</span>
          <span className="font-medium text-gray-900">{statsBar.detectedFormat}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Timezone</span>
          <span className="font-medium text-gray-900">{statsBar.timezone}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 border border-gray-200">
          <span className="text-gray-500">Calendar</span>
          <span className="font-medium text-gray-900">{statsBar.calendar}</span>
        </span>
      </div>

      <div className="date-formats-container">

        {/* Primary formats */}
        <section aria-label="Primary date formats" className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-gray-800">Primary date formats</h3>
            <p className="text-[11px] text-gray-500">Most commonly needed formats, always visible.</p>
          </div>
          {result ? (
            <div className="grid grid-cols-1 gap-2">
              <OutputField label="ISO date (YYYY-MM-DD)" value={result.primary.isoDate} onCopy={onCopy} />
              <OutputField label="Human-readable date" value={result.primary.humanReadable} onCopy={onCopy} />
              <OutputField label="Local date" value={result.primary.localDate} onCopy={onCopy} />
              <OutputField label="UTC date" value={result.primary.utcDate} onCopy={onCopy} />
              <OutputField label="Short numeric date" value={result.primary.shortNumeric} onCopy={onCopy} />
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Convert a date to see primary formats like ISO date, human-readable text, and local/UTC here.
            </p>
          )}
        </section>

        {/* Custom format builder */}
        <section aria-label="Custom date format builder" className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-gray-800">Custom format builder</h3>
            <p className="text-[11px] text-gray-500">Use Moment-style tokens to build your own format.</p>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="custom-date-format" className="text-xs font-medium text-gray-700">
                Format pattern
              </label>
              <input
                id="custom-date-format"
                type="text"
                value={customPattern}
                onChange={(e) => onChangeCustomPattern(e.target.value)}
                className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                placeholder="e.g. YYYY-MM-DD HH:mm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Result</label>
              {result ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={customResult}
                    className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => onCopy(customResult)}
                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500">
                  Convert a date first, then adjust the format pattern to see live updates here.
                </p>
              )}
            </div>

            {/* Token helper */}
            <div className="mt-1 space-y-1.5">
              <p className="text-[11px] font-medium text-gray-700">Tokens</p>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Common</span>
                  {[
                    { token: "YYYY", label: "Year" },
                    { token: "MM", label: "Month" },
                    { token: "DD", label: "Day" },
                  ].map(({ token, label }) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => onChangeCustomPattern(customPattern + (customPattern ? " " : "") + token)}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                    >
                      <span className="font-mono mr-1">{token}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Time</span>
                  {[
                    { token: "HH", label: "Hours" },
                    { token: "mm", label: "Minutes" },
                    { token: "ss", label: "Seconds" },
                  ].map(({ token, label }) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => onChangeCustomPattern(customPattern + (customPattern ? " " : "") + token)}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                    >
                      <span className="font-mono mr-1">{token}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">Text</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeCustomPattern(
                        customPattern + (customPattern ? " " : "") + "[on] YYYY-MM-DD"
                      )
                    }
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                  >
                    <span className="font-mono mr-1">[text]</span>
                    <span>Literal text</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common regional formats */}
        <section aria-label="Common regional formats" className="rounded-lg border border-gray-200 bg-white">
          <details className="group">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
              <div>
                <h3 className="text-xs font-semibold text-gray-800">Common regional formats</h3>
                <p className="text-[11px] text-gray-500">
                  Popular numeric formats used across different regions.
                </p>
              </div>
              <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
              <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
            </summary>
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
              {result ? (
                <div className="grid grid-cols-1 gap-2">
                  <OutputField label="DD/MM/YYYY" value={result.common.ddMmYyyySlashes} onCopy={onCopy} />
                  <OutputField label="MM/DD/YYYY" value={result.common.mmDdYyyySlashes} onCopy={onCopy} />
                  <OutputField label="YYYY/MM/DD" value={result.common.yyyyMmDdSlashes} onCopy={onCopy} />
                  <OutputField label="DD-MM-YYYY" value={result.common.ddMmYyyyDashes} onCopy={onCopy} />
                  <OutputField label="MM-DD-YYYY" value={result.common.mmDdYyyyDashes} onCopy={onCopy} />
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Convert a date to see regional-friendly numeric formats here.
                </p>
              )}
            </div>
          </details>
        </section>

        {/* Technical & system formats */}
        <section aria-label="Technical and system formats" className="rounded-lg border border-gray-200 bg-white">
          <details className="group">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
              <div>
                <h3 className="text-xs font-semibold text-gray-800">Technical &amp; system formats</h3>
                <p className="text-[11px] text-gray-500">
                  RFC 3339 date, ISO week date, Julian date, and language-specific representations.
                </p>
              </div>
              <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
              <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
            </summary>
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-2">
              {result ? (
                <div className="grid grid-cols-1 gap-2">
                  <OutputField label="RFC 3339 date" value={result.technical.rfc3339Date} onCopy={onCopy} />
                  <OutputField label="ISO week date" value={result.technical.isoWeekDate} onCopy={onCopy} />
                  <OutputField label="Julian date" value={result.technical.julianDate} onCopy={onCopy} />
                  <OutputField
                    label="Day number since epoch"
                    value={result.technical.daysSinceEpoch}
                    onCopy={onCopy}
                  />
                  <OutputField
                    label="Database-friendly date"
                    value={result.technical.databaseDate}
                    onCopy={onCopy}
                  />
                  <OutputField label="Java date" value={result.technical.javaDate} onCopy={onCopy} />
                  <OutputField label="Python date" value={result.technical.pythonDate} onCopy={onCopy} />
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Convert a date to see technical/system-friendly formats for code and databases here.
                </p>
              )}
            </div>
          </details>
        </section>

        {/* Metadata & context */}
        <section aria-label="Date metadata and context" className="rounded-lg border border-gray-200 bg-white">
          <details className="group">
            <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
              <div>
                <h3 className="text-xs font-semibold text-gray-800">Metadata &amp; context</h3>
                <p className="text-[11px] text-gray-500">
                  Day of week, day of year, week number, month name, quarter, and leap year details.
                </p>
              </div>
              <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
              <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
            </summary>
            <div className="border-t border-gray-200 bg-gray-50 px-3 py-3">
              {result ? (
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs text-gray-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-gray-800">Day of week</dt>
                    <dd className="mt-0.5 text-gray-700">{result.metadata.dayOfWeek}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-800">Day of year</dt>
                    <dd className="mt-0.5 text-gray-700">{result.metadata.dayOfYear}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-800">Week number</dt>
                    <dd className="mt-0.5 text-gray-700">{result.metadata.weekNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-800">Month name</dt>
                    <dd className="mt-0.5 text-gray-700">{result.metadata.monthName}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-800">Quarter</dt>
                    <dd className="mt-0.5 text-gray-700">{result.metadata.quarter}</dd>
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
                  Convert a date to see contextual information like day of week, week number, and leap year status here.
                </p>
              )}
            </div>
          </details>
        </section>

      </div>

      {success && (
        <p className="mt-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
          {success}
        </p>
      )}
    </div>
  )
}

