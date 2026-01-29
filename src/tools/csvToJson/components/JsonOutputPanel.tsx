// JSON output panel - stats bar + output actions + textarea/table preview
import type { FC } from "react"
import { TablePreview } from "./TablePreview"

type JsonOutputPanelProps = {
  jsonOutput: string
  onCopy: () => void
  onDownload: () => void
  onClearOutput: () => void
  onToggleMinify: () => void
  minifyOutput: boolean
  success: string | null
  stats: {
    rows: number
    columns: number
    fileSizeLabel: string
    fileName: string | null
  }
  showTable: boolean
  onToggleTable: () => void
  tableData: { headers: string[]; rows: (string | null)[][] } | null
}

export const JsonOutputPanel: FC<JsonOutputPanelProps> = ({
  jsonOutput,
  onCopy,
  onDownload,
  onClearOutput,
  onToggleMinify,
  minifyOutput,
  success,
  stats,
  showTable,
  onToggleTable,
  tableData,
}) => {
  const hasOutput = Boolean(jsonOutput)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">JSON output</h2>
            <p className="mt-1 text-xs text-gray-600">Copy, download, or preview as a table.</p>
          </div>

          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTable}
              disabled={!tableData}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-pressed={showTable}
              title="View as table"
            >
              {showTable ? "Hide table" : "View as table"}
            </button>
          </div>
        </div>

        {/* Stats bar (mandatory) */}
        <div className="mt-3 flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
            <span className="inline-flex items-center rounded-full bg-white px-2 py-1 border border-gray-200">
              <span className="text-gray-500 mr-1">Rows</span>
              <span className="font-medium text-gray-900">{stats.rows.toLocaleString()}</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-white px-2 py-1 border border-gray-200">
              <span className="text-gray-500 mr-1">Columns</span>
              <span className="font-medium text-gray-900">{stats.columns.toLocaleString()}</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-white px-2 py-1 border border-gray-200">
              <span className="text-gray-500 mr-1">File size</span>
              <span className="font-medium text-gray-900">{stats.fileSizeLabel}</span>
            </span>
          </div>
          {stats.fileName && (
            <p className="text-xs text-gray-500 truncate" title={stats.fileName}>
              {stats.fileName}
            </p>
          )}
        </div>
      </div>

      {/* Output actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            disabled={!hasOutput}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy JSON
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!hasOutput}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={onClearOutput}
            disabled={!hasOutput}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear output
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleMinify}
          disabled={!hasOutput}
          className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-pressed={minifyOutput}
        >
          {minifyOutput ? "Pretty" : "Minify"}
        </button>
      </div>

      {success && (
        <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
          {success}
        </p>
      )}

      <div className="mt-3">
        {showTable && tableData ? (
          <div className="h-[26rem] sm:h-[30rem]">
            <TablePreview headers={tableData.headers} rows={tableData.rows} />
          </div>
        ) : (
          <>
            <label htmlFor="json-output" className="block text-sm font-medium text-gray-700 mb-2">
              JSON
            </label>
            <textarea
              id="json-output"
              value={jsonOutput}
              readOnly
              rows={12}
              className="block w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              placeholder="Converted JSON will appear here…"
            />
          </>
        )}
      </div>
    </div>
  )
}

