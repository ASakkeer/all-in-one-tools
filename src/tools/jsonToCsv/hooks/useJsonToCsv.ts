// JSON to CSV Converter state hook - owns tool state and actions (convert/copy/download/reset)
import { useCallback, useMemo, useRef, useState } from "react"
import {
  jsonToCsv,
  JsonToCsvError,
  type JsonToCsvOptions,
  type LineEndingMode,
} from "../utils/jsonToCsv"

const defaultOptions: JsonToCsvOptions = {
  structure: "array",
  flattenObjects: true,
  arrayHandling: "join",
  includeAllKeys: true,
  preserveKeyOrder: true,
  delimiter: ",",

  missingValue: "empty",
  escapeDoubleQuotes: true,
  wrapAllValuesInQuotes: false,
  stringifyBooleansAndNumbers: false,
  lineEndings: "LF",
}

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

export const getSampleJson = (): string => {
  const sample = [
    {
      id: 101,
      name: "Asha Perera",
      email: "asha.perera@example.com",
      is_active: true,
      address: { city: "Colombo", country: "Sri Lanka", zip: "00100" },
      tags: ["vip", "newsletter"],
      last_order: { id: "A-9001", total: 129.99, items: 3 },
    },
    {
      id: 102,
      name: 'John "Jack" Miller',
      email: "john.miller@example.com",
      is_active: false,
      address: { city: "Austin", country: "United States", zip: "73301" },
      tags: ["trial"],
      last_order: null,
    },
    {
      id: 103,
      name: "María García",
      email: "maria.garcia@example.com",
      is_active: true,
      address: { city: "Madrid", country: "Spain" },
      tags: [],
      preferences: { currency: "EUR", language: "es" },
    },
  ]
  return JSON.stringify(sample, null, 2)
}

export const useJsonToCsv = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [jsonText, setJsonText] = useState("")
  const [options, setOptions] = useState<JsonToCsvOptions>(defaultOptions)

  const [csvOutput, setCsvOutput] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [tableRows, setTableRows] = useState<string[][]>([])

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null)

  const stats = useMemo(() => {
    return {
      rows: tableRows.length,
      columns: headers.length,
      fileSizeLabel: fileSizeBytes === null ? "—" : formatBytes(fileSizeBytes),
      fileName,
    }
  }, [tableRows.length, headers.length, fileSizeBytes, fileName])

  const setOption = useCallback(<K extends keyof JsonToCsvOptions>(key: K, value: JsonToCsvOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFeedback = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const clearOutput = useCallback(() => {
    setCsvOutput("")
    setHeaders([])
    setTableRows([])
    setError(null)
    setSuccess(null)
  }, [])

  const clearAll = useCallback(() => {
    setJsonText("")
    setOptions(defaultOptions)
    setCsvOutput("")
    setHeaders([])
    setTableRows([])
    setError(null)
    setSuccess(null)
    setFileName(null)
    setFileSizeBytes(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileSelected = useCallback(
    (file: File | null) => {
      clearFeedback()
      if (!file) return

      setFileName(file.name)
      setFileSizeBytes(file.size)

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = (event.target?.result as string) ?? ""
        setJsonText(content)
      }
      reader.onerror = () => {
        setError("Could not read the file. Please try again with a different JSON file.")
      }
      reader.readAsText(file)

      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    [clearFeedback]
  )

  const convert = useCallback(() => {
    setIsConverting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = jsonToCsv(jsonText, options)
      setCsvOutput(result.csv)
      setHeaders(result.headers)
      setTableRows(result.tableRows)
      setSuccess("Conversion successful")
    } catch (err) {
      if (err instanceof JsonToCsvError) {
        if (err.code === "INVALID_JSON" && err.line && err.column) {
          setError(`Invalid JSON: ${err.message} (line ${err.line}, column ${err.column})`)
        } else {
          setError(err.message)
        }
      } else {
        setError("Something went wrong while converting this JSON. Please check the input and try again.")
      }
      setCsvOutput("")
      setHeaders([])
      setTableRows([])
    } finally {
      setIsConverting(false)
    }
  }, [jsonText, options])

  const setLineEndings = useCallback(
    (mode: LineEndingMode) => {
      setOption("lineEndings", mode)
      // Recompute output without re-parsing JSON by normalizing current output lines.
      setCsvOutput((prev) => {
        if (!prev) return prev
        const normalized = prev.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
        const joiner = mode === "CRLF" ? "\r\n" : "\n"
        return normalized.split("\n").join(joiner)
      })
    },
    [setOption]
  )

  const copyCsv = useCallback(async (): Promise<boolean> => {
    clearFeedback()
    if (!csvOutput) return false
    try {
      await navigator.clipboard.writeText(csvOutput)
      setSuccess("Copied CSV to clipboard")
      window.setTimeout(() => setSuccess(null), 1500)
      return true
    } catch {
      setError("Could not copy to clipboard. Please copy manually.")
      return false
    }
  }, [csvOutput, clearFeedback])

  const downloadCsv = useCallback(() => {
    clearFeedback()
    if (!csvOutput) return

    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = (fileName ? fileName.replace(/\.(json|txt)$/i, "") : "data") + ".csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setSuccess("Download started")
    window.setTimeout(() => setSuccess(null), 1500)
  }, [csvOutput, clearFeedback, fileName])

  return {
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
    clearFeedback,

    stats,
    loadSample: () => {
      clearFeedback()
      setFileName(null)
      setFileSizeBytes(null)
      setJsonText(getSampleJson())
    },
  }
}

