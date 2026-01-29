// CSV to JSON Converter tool - two-panel workspace with options, table preview, and export actions
import { useMemo, useState } from "react"
import { CsvInputPanel } from "./components/CsvInputPanel"
import { JsonOutputPanel } from "./components/JsonOutputPanel"
import { useCsvToJson } from "./hooks/useCsvToJson"

export const CsvToJson = () => {
  const {
    fileInputRef,
    csvText,
    setCsvText,
    options,
    setOption,
    parseResult,
    jsonOutput,
    minifyOutput,
    error,
    success,
    isConverting,
    triggerUpload,
    onFileSelected,
    convert,
    toggleMinify,
    copyJson,
    downloadJson,
    clearOutput,
    clearAll,
    stats,
    formattedFileSize,
    loadSample,
    clearFeedback,
  } = useCsvToJson()

  const [showTable, setShowTable] = useState(false)

  const tableData = useMemo(() => {
    if (!parseResult) return null
    return { headers: parseResult.headers, rows: parseResult.rows }
  }, [parseResult])

  const handleConvert = () => {
    clearFeedback()
    setShowTable(false)
    convert()
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-6">
      {/* Two-panel layout: stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CsvInputPanel
          csvText={csvText}
          onChangeCsvText={setCsvText}
          options={options}
          onSetOption={setOption}
          onConvert={handleConvert}
          onUpload={triggerUpload}
          onLoadSample={loadSample}
          onClearAll={clearAll}
          error={error}
          isConverting={isConverting}
        />

        <JsonOutputPanel
          jsonOutput={jsonOutput}
          onCopy={() => void copyJson()}
          onDownload={downloadJson}
          onClearOutput={clearOutput}
          onToggleMinify={toggleMinify}
          minifyOutput={minifyOutput}
          success={success}
          stats={{
            rows: stats.rows,
            columns: stats.columns,
            fileSizeLabel: formattedFileSize,
            fileName: stats.fileName,
          }}
          showTable={showTable}
          onToggleTable={() => setShowTable((p) => !p)}
          tableData={tableData}
        />
      </div>

      {/* Hidden file input (CSV/TXT upload) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
        className="hidden"
      />
    </div>
  )
}

