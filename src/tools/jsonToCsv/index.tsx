// JSON to CSV Converter tool - two-panel workspace with options, table preview, and export actions
import { useState } from "react"
import { JsonInputPanel } from "./components/JsonInputPanel"
import { CsvOutputPanel } from "./components/CsvOutputPanel"
import { useJsonToCsv } from "./hooks/useJsonToCsv"

export const JsonToCsv = () => {
  const {
    fileInputRef,
    jsonText,
    setJsonText,
    options,
    setOption,
    csvOutput,
    headers,
    tableRows,
    error,
    success,
    isConverting,
    triggerUpload,
    onFileSelected,
    convert,
    setLineEndings,
    copyCsv,
    downloadCsv,
    clearOutput,
    clearAll,
    stats,
    loadSample,
    clearFeedback,
  } = useJsonToCsv()

  const [showTable, setShowTable] = useState(false)

  const handleConvert = () => {
    clearFeedback()
    setShowTable(false)
    convert()
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JsonInputPanel
          jsonText={jsonText}
          onChangeJsonText={setJsonText}
          options={options}
          onSetOption={setOption}
          onConvert={handleConvert}
          onUpload={triggerUpload}
          onLoadSample={loadSample}
          onClearAll={clearAll}
          error={error}
          isConverting={isConverting}
        />

        <CsvOutputPanel
          csvOutput={csvOutput}
          onCopy={() => void copyCsv()}
          onDownload={downloadCsv}
          onClearOutput={clearOutput}
          success={success}
          stats={stats}
          showTable={showTable}
          onToggleTable={() => setShowTable((p) => !p)}
          headers={headers}
          tableRows={tableRows}
          lineEndings={options.lineEndings}
          onToggleLineEndings={setLineEndings}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
        className="hidden"
      />
    </div>
  )
}

