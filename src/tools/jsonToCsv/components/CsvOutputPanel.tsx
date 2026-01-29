// CSV output panel - stats bar + output actions + textarea/table preview
import type { FC } from "react"
import type { LineEndingMode } from "../utils/jsonToCsv"
import { TablePreview } from "./TablePreview"

type CsvOutputPanelProps = {
  csvOutput: string
  onCopy: () => void
  onDownload: () => void
  onClearOutput: () => void
  success: string | null
  stats: {
    rows: number
    columns: number
    fileSizeLabel: string
    fileName: string | null
  }
  showTable: boolean
  onToggleTable: () => void
  headers: string[]
  tableRows: string[][]
  lineEndings: LineEndingMode
  onToggleLineEndings: (next: LineEndingMode) => void
}

export const CsvOutputPanel: FC<CsvOutputPanelProps> = ({
  csvOutput,
  onCopy,
  onDownload,
  onClearOutput,
  success,
  stats,
  showTable,
  onToggleTable,
  headers,
  tableRows,
  lineEndings,
  onToggleLineEndings,
}) => {
  const hasOutput = Boolean(csvOutput)
  const hasTable = headers.length > 0 && tableRows.length > 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="mb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">CSV output</h2>
            <p className="mt-1 text-xs text-gray-600">Copy, download, or preview as a table.</p>
          </div>

          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTable}
              disabled={!hasTable}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-pressed={showTable}
              title="Preview table"
            >
              {showTable ? "Hide table" : "Preview table"}
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
            Copy CSV
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!hasOutput}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download CSV
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

        <div className="inline-flex items-center whitespace-nowrap rounded-md border border-gray-200 bg-white p-0.5 text-[11px] shadow-sm">
          <button
            type="button"
            onClick={() => onToggleLineEndings("LF")}
            className={`rounded px-3 py-1 text-[11px] font-medium ${
              lineEndings === "LF" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-pressed={lineEndings === "LF"}
          >
            LF
          </button>
          <button
            type="button"
            onClick={() => onToggleLineEndings("CRLF")}
            className={`rounded px-3 py-1 text-[11px] font-medium ${
              lineEndings === "CRLF" ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-pressed={lineEndings === "CRLF"}
          >
            CRLF
          </button>
        </div>
      </div>

      {success && (
        <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
          {success}
        </p>
      )}

      <div className="mt-3">
        {showTable && hasTable ? (
          <div className="h-[26rem] sm:h-[30rem]">
            <TablePreview headers={headers} rows={tableRows} />
          </div>
        ) : (
          <>
            <label htmlFor="csv-output" className="block text-sm font-medium text-gray-700 mb-2">
              CSV
            </label>
            <textarea
              id="csv-output"
              value={csvOutput}
              readOnly
              rows={12}
              className="block w-full resize-y rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              placeholder="Converted CSV will appear here…"
            />
          </>
        )}
      </div>
    </div>
  )
}

