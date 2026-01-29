// CSV input panel - parsing options + textarea + upload/sample actions
import type { FC } from "react"
import type { CsvParseOptions, CsvDelimiterPreset } from "../utils/parseCsv"

type CsvInputPanelProps = {
  csvText: string
  onChangeCsvText: (next: string) => void
  options: CsvParseOptions
  onSetOption: <K extends keyof CsvParseOptions>(key: K, value: CsvParseOptions[K]) => void
  onConvert: () => void
  onUpload: () => void
  onLoadSample: () => void
  onClearAll: () => void
  error: string | null
  isConverting: boolean
}

const delimiterLabel = (preset: CsvDelimiterPreset): string => {
  if (preset === "comma") return "Comma (,)"
  if (preset === "semicolon") return "Semicolon (;)"
  if (preset === "tab") return "Tab (\\t)"
  if (preset === "pipe") return "Pipe (|)"
  return "Custom"
}

export const CsvInputPanel: FC<CsvInputPanelProps> = ({
  csvText,
  onChangeCsvText,
  options,
  onSetOption,
  onConvert,
  onUpload,
  onLoadSample,
  onClearAll,
  error,
  isConverting,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">CSV input</h2>
          <p className="mt-1 text-xs text-gray-600">
            Paste CSV, upload a file, or load a sample. Parsing runs only when you click Convert.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear all"
          title="Clear all"
        >
          Clear all
        </button>
      </div>

      {/* Options */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="csv-delimiter" className="block text-xs font-medium text-gray-700 mb-1">
              Delimiter
            </label>
            <div className="flex items-center gap-2">
              <select
                id="csv-delimiter"
                value={options.delimiter}
                onChange={(e) => onSetOption("delimiter", e.target.value as CsvDelimiterPreset)}
                className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {(["comma", "semicolon", "tab", "pipe", "custom"] as CsvDelimiterPreset[]).map((p) => (
                  <option key={p} value={p}>
                    {delimiterLabel(p)}
                  </option>
                ))}
              </select>

              {options.delimiter === "custom" && (
                <input
                  aria-label="Custom delimiter"
                  value={options.customDelimiter}
                  onChange={(e) => onSetOption("customDelimiter", e.target.value)}
                  maxLength={1}
                  placeholder=","
                  className="w-14 rounded-md border border-gray-200 bg-white px-2 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-medium text-gray-700">Basic options</label>
            <div className="flex flex-wrap gap-3 text-xs text-gray-700">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.firstRowHeader}
                  onChange={(e) => onSetOption("firstRowHeader", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                First row is header
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.trimValues}
                  onChange={(e) => onSetOption("trimValues", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Trim spaces around values
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.skipEmptyLines}
                  onChange={(e) => onSetOption("skipEmptyLines", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Skip empty lines
              </label>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-3">
          <details className="group">
            <summary className="cursor-pointer select-none text-xs font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none">
              Advanced options
              <span className="ml-2 text-[11px] text-gray-500 group-open:hidden">(show)</span>
              <span className="ml-2 text-[11px] text-gray-500 hidden group-open:inline">(hide)</span>
            </summary>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-700">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.handleQuotedValues}
                  onChange={(e) => onSetOption("handleQuotedValues", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Handle quoted values (supports delimiters inside quotes)
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.allowInconsistentColumnCounts}
                  onChange={(e) => onSetOption("allowInconsistentColumnCounts", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Allow inconsistent column counts (fill missing with null)
              </label>
            </div>
          </details>
        </div>
      </div>

      {/* Input actions */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUpload}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
          >
            Upload CSV
          </button>
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
          >
            Load sample
          </button>
        </div>

        <button
          type="button"
          onClick={onConvert}
          disabled={isConverting}
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#088108] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConverting ? "Converting…" : "Convert to JSON"}
        </button>
      </div>

      {/* CSV textarea */}
      <div className="mt-3">
        <label htmlFor="csv-input" className="block text-sm font-medium text-gray-700 mb-2">
          CSV
        </label>
        <textarea
          id="csv-input"
          value={csvText}
          onChange={(e) => onChangeCsvText(e.target.value)}
          rows={12}
          className="block w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          placeholder="Paste your CSV here…"
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

