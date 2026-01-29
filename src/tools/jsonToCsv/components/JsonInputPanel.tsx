// JSON input panel - options, textarea, upload/sample actions, and convert CTA
import type { FC } from "react"
import type {
  ArrayHandlingMode,
  JsonStructureMode,
  JsonToCsvOptions,
  MissingValueMode,
} from "../utils/jsonToCsv"

type JsonInputPanelProps = {
  jsonText: string
  onChangeJsonText: (next: string) => void
  options: JsonToCsvOptions
  onSetOption: <K extends keyof JsonToCsvOptions>(key: K, value: JsonToCsvOptions[K]) => void
  onConvert: () => void
  onUpload: () => void
  onLoadSample: () => void
  onClearAll: () => void
  error: string | null
  isConverting: boolean
}

export const JsonInputPanel: FC<JsonInputPanelProps> = ({
  jsonText,
  onChangeJsonText,
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
          <h2 className="text-sm font-semibold text-gray-900">JSON input</h2>
          <p className="mt-1 text-xs text-gray-600">Paste JSON, upload a file, or load a sample.</p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
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
            <label htmlFor="json-structure" className="block text-xs font-medium text-gray-700 mb-1">
              JSON structure
            </label>
            <select
              id="json-structure"
              value={options.structure}
              onChange={(e) => onSetOption("structure", e.target.value as JsonStructureMode)}
              className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <option value="array">Array of objects</option>
              <option value="single">Single object</option>
              <option value="nested">Nested objects</option>
            </select>

            <div className="mt-2">
              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={options.flattenObjects}
                  onChange={(e) => onSetOption("flattenObjects", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                />
                Flatten nested objects using dot notation
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="array-handling" className="block text-xs font-medium text-gray-700 mb-1">
              Arrays inside objects
            </label>
            <select
              id="array-handling"
              value={options.arrayHandling}
              onChange={(e) => onSetOption("arrayHandling", e.target.value as ArrayHandlingMode)}
              className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <option value="join">Join as comma-separated string</option>
              <option value="expand">Expand into multiple rows</option>
              <option value="ignore">Ignore arrays</option>
            </select>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-medium text-gray-700">Column options</label>
              <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.includeAllKeys}
                    onChange={(e) => onSetOption("includeAllKeys", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                  />
                  Include all keys across objects
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.preserveKeyOrder}
                    onChange={(e) => onSetOption("preserveKeyOrder", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                  />
                  Preserve key order (if possible)
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="csv-delimiter" className="block text-xs font-medium text-gray-700 mb-1">
                Custom CSV delimiter
              </label>
              <input
                id="csv-delimiter"
                value={options.delimiter}
                onChange={(e) => onSetOption("delimiter", e.target.value)}
                maxLength={1}
                placeholder=","
                className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
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
            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="missing-values" className="block text-xs font-medium text-gray-700 mb-1">
                  Missing values
                </label>
                <select
                  id="missing-values"
                  value={options.missingValue}
                  onChange={(e) => onSetOption("missingValue", e.target.value as MissingValueMode)}
                  className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="empty">Replace with empty string</option>
                  <option value="null">Replace with null</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-xs font-medium text-gray-700">Formatting</label>
                <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.escapeDoubleQuotes}
                      onChange={(e) => onSetOption("escapeDoubleQuotes", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                    />
                    Escape double quotes properly
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.wrapAllValuesInQuotes}
                      onChange={(e) => onSetOption("wrapAllValuesInQuotes", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                    />
                    Wrap all values in quotes
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.stringifyBooleansAndNumbers}
                      onChange={(e) => onSetOption("stringifyBooleansAndNumbers", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-300"
                    />
                    Convert booleans and numbers to strings
                  </label>
                </div>
              </div>
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
            Upload JSON
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
          {isConverting ? "Converting…" : "Convert to CSV"}
        </button>
      </div>

      {/* JSON textarea */}
      <div className="mt-3">
        <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 mb-2">
          JSON
        </label>
        <textarea
          id="json-input"
          value={jsonText}
          onChange={(e) => onChangeJsonText(e.target.value)}
          rows={12}
          className="block w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          placeholder="Paste your JSON here…"
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

