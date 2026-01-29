// CSV to JSON Converter state hook - owns tool state and actions (convert/copy/download/reset)
import { useCallback, useMemo, useRef, useState } from "react"
import { CsvParseError, type CsvParseOptions, parseCsv, type CsvParseResult } from "../utils/parseCsv"

export type CsvToJsonDelimiterChoice = CsvParseOptions["delimiter"]

export type CsvToJsonStats = {
  rows: number
  columns: number
  fileSizeBytes: number | null
  fileName: string | null
}

const defaultOptions: CsvParseOptions = {
  delimiter: "comma",
  customDelimiter: ",",
  firstRowHeader: true,
  trimValues: true,
  skipEmptyLines: true,
  handleQuotedValues: true,
  allowInconsistentColumnCounts: false,
}

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

export const getSampleCsv = (): string => {
  // Realistic sample: orders / customers style data with commas and quotes
  return [
    "order_id,customer_name,email,country,created_at,total_usd,status",
    '10001,"Asha Perera",asha.perera@example.com,Sri Lanka,2026-01-18,129.99,paid',
    '10002,"John ""Jack"" Miller",john.miller@example.com,United States,2026-01-19,42.5,pending',
    '10003,"Fatima Khan",fatima.khan@example.com,United Arab Emirates,2026-01-20,79.0,paid',
    '10004,"Liam O\'Connor",liam.oconnor@example.com,Ireland,2026-01-21,15.25,refunded',
    '10005,"Wei Chen",wei.chen@example.com,Singapore,2026-01-22,310.0,paid',
    '10006,"María García",maria.garcia@example.com,Spain,2026-01-23,8.99,cancelled',
  ].join("\r\n")
}

export const useCsvToJson = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [csvText, setCsvText] = useState("")
  const [options, setOptions] = useState<CsvParseOptions>(defaultOptions)
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null)
  const [jsonOutput, setJsonOutput] = useState("")
  const [minifyOutput, setMinifyOutput] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null)

  const stats: CsvToJsonStats = useMemo(() => {
    return {
      rows: parseResult?.stats.rows ?? 0,
      columns: parseResult?.stats.columns ?? 0,
      fileSizeBytes,
      fileName,
    }
  }, [parseResult, fileName, fileSizeBytes])

  const formattedFileSize = useMemo(() => {
    return fileSizeBytes === null ? "—" : formatBytes(fileSizeBytes)
  }, [fileSizeBytes])

  const setOption = useCallback(
    <K extends keyof CsvParseOptions>(key: K, value: CsvParseOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const clearFeedback = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const clearOutput = useCallback(() => {
    setParseResult(null)
    setJsonOutput("")
    setSuccess(null)
    setError(null)
  }, [])

  const clearAll = useCallback(() => {
    setCsvText("")
    setOptions(defaultOptions)
    setParseResult(null)
    setJsonOutput("")
    setMinifyOutput(false)
    setError(null)
    setSuccess(null)
    setFileName(null)
    setFileSizeBytes(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onFileSelected = useCallback((file: File | null) => {
    clearFeedback()
    if (!file) return

    setFileName(file.name)
    setFileSizeBytes(file.size)

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = (event.target?.result as string) ?? ""
      setCsvText(content)
    }
    reader.onerror = () => {
      setError("Could not read the file. Please try again with a different CSV file.")
    }
    reader.readAsText(file)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [clearFeedback])

  const convert = useCallback(() => {
    setIsConverting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = parseCsv(csvText, options)
      setParseResult(result)

      const json = minifyOutput
        ? JSON.stringify(result.objects)
        : JSON.stringify(result.objects, null, 2)
      setJsonOutput(json)
      setSuccess("Conversion successful")
    } catch (err) {
      if (err instanceof CsvParseError) {
        setError(err.message)
      } else {
        setError("Something went wrong while parsing this CSV. Please check the input and try again.")
      }
      setParseResult(null)
      setJsonOutput("")
    } finally {
      setIsConverting(false)
    }
  }, [csvText, options, minifyOutput])

  const toggleMinify = useCallback(() => {
    setMinifyOutput((prev) => {
      const next = !prev
      // Re-render output without re-parsing if we already have parsed objects.
      setJsonOutput((current) => {
        if (!parseResult) return current
        return next ? JSON.stringify(parseResult.objects) : JSON.stringify(parseResult.objects, null, 2)
      })
      return next
    })
  }, [parseResult])

  const copyJson = useCallback(async (): Promise<boolean> => {
    clearFeedback()
    if (!jsonOutput) return false
    try {
      await navigator.clipboard.writeText(jsonOutput)
      setSuccess("Copied JSON to clipboard")
      window.setTimeout(() => setSuccess(null), 1500)
      return true
    } catch {
      setError("Could not copy to clipboard. Please copy manually.")
      return false
    }
  }, [jsonOutput, clearFeedback])

  const downloadJson = useCallback(() => {
    clearFeedback()
    if (!jsonOutput) return

    const blob = new Blob([jsonOutput], { type: "application/json;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = (fileName ? fileName.replace(/\.(csv|txt)$/i, "") : "data") + ".json"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setSuccess("Download started")
    window.setTimeout(() => setSuccess(null), 1500)
  }, [jsonOutput, clearFeedback, fileName])

  return {
    // Refs
    fileInputRef,

    // Input
    csvText,
    setCsvText,

    // Options
    options,
    setOption,

    // Output + parse
    parseResult,
    jsonOutput,
    minifyOutput,

    // File
    fileName,
    formattedFileSize,

    // Feedback
    error,
    success,
    isConverting,

    // Actions
    triggerUpload,
    onFileSelected,
    convert,
    toggleMinify,
    copyJson,
    downloadJson,
    clearOutput,
    clearAll,
    clearFeedback,

    // Helpers
    stats,
    loadSample: () => {
      clearFeedback()
      setFileName(null)
      setFileSizeBytes(null)
      setCsvText(getSampleCsv())
    },
  }
}

