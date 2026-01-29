// Table preview component - scrollable table for CSV verification before download
import type { FC } from "react"

type TablePreviewProps = {
  headers: string[]
  rows: string[][]
  maxRows?: number
}

export const TablePreview: FC<TablePreviewProps> = ({ headers, rows, maxRows = 50 }) => {
  const visibleRows = rows.slice(0, maxRows)

  return (
    <div className="h-full w-full overflow-auto rounded-md border border-gray-200 bg-gray-50">
      <table className="min-w-full border-collapse text-[11px]">
        <thead className="sticky top-0 bg-gray-100 text-[10px] uppercase tracking-wide text-gray-500">
          <tr>
            <th className="w-12 px-2 py-2 text-right font-medium">#</th>
            {headers.map((h) => (
              <th key={h} className="px-2 py-2 text-left font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((r, idx) => (
            <tr key={idx} className="odd:bg-white">
              <td className="border-b border-gray-100 px-2 py-1.5 text-right text-[10px] text-gray-400 align-top">
                {idx + 1}
              </td>
              {headers.map((h, colIdx) => (
                <td
                  key={`${h}-${colIdx}`}
                  className="border-b border-gray-100 px-2 py-1.5 text-gray-800 align-top whitespace-nowrap"
                >
                  <span className="font-mono">
                    {r[colIdx] === undefined || r[colIdx] === "" ? (
                      <span className="text-gray-400 italic">empty</span>
                    ) : (
                      r[colIdx]
                    )}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length > maxRows && (
        <div className="border-t border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
          Showing first {maxRows} rows for preview. Download CSV to export the full dataset.
        </div>
      )}
    </div>
  )
}

