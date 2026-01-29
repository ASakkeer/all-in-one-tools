// Date Converter state hook - owns input, options, results, and actions
import { useCallback, useMemo, useState } from "react"
import {
  convertDate,
  DateParseError,
  type DateConversionResult,
  type DateDetectedFormat,
  type DateTimezoneMode,
  formatCustomPattern,
} from "../utils/dateUtils"

type DateState = {
  input: string
  timezone: DateTimezoneMode
  autoDetect: boolean
  explicitFormat: DateDetectedFormat | null
  customPattern: string
}

const defaultState: DateState = {
  input: "",
  timezone: "local",
  autoDetect: true,
  explicitFormat: null,
  customPattern: "YYYY-MM-DD",
}

const formatDetectedLabel = (fmt: DateDetectedFormat): string => {
  if (fmt === "yyyy-mm-dd") return "YYYY-MM-DD"
  if (fmt === "dd/mm/yyyy") return "DD/MM/YYYY"
  if (fmt === "mm/dd/yyyy") return "MM/DD/YYYY"
  if (fmt === "iso-8601-date") return "ISO 8601 date"
  if (fmt === "textual") return "Textual date"
  return "Unknown format"
}

export const useDateConverter = () => {
  const [state, setState] = useState<DateState>(defaultState)
  const [result, setResult] = useState<DateConversionResult | null>(null)
  const [customResult, setCustomResult] = useState<string>("")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const statsBar = useMemo(() => {
    if (!result) {
      return {
        detectedFormat: "—",
        timezone: state.timezone === "local" ? "Local date" : "UTC date",
        calendar: "Gregorian",
      }
    }
    return {
      detectedFormat: formatDetectedLabel(result.detectedFormat),
      timezone: result.timezoneUsed === "local" ? "Local date" : "UTC date",
      calendar: result.calendarSystem,
    }
  }, [result, state.timezone])

  const setInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, input: value }))
  }, [])

  const setTimezone = useCallback((tz: DateTimezoneMode) => {
    setState((prev) => ({ ...prev, timezone: tz }))
  }, [])

  const setAutoDetect = useCallback((autoDetect: boolean) => {
    setState((prev) => ({
      ...prev,
      autoDetect,
      explicitFormat: autoDetect ? null : prev.explicitFormat ?? "yyyy-mm-dd",
    }))
  }, [])

  const setExplicitFormat = useCallback((fmt: DateDetectedFormat) => {
    setState((prev) => ({ ...prev, explicitFormat: fmt }))
  }, [])

  const clearFeedback = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const clearAll = useCallback(() => {
    setState(defaultState)
    setResult(null)
    setError(null)
    setSuccess(null)
  }, [])

  const useToday = useCallback(() => {
    clearFeedback()
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    setState((prev) => ({ ...prev, input: `${y}-${m}-${d}` }))
  }, [clearFeedback])

  const convert = useCallback(() => {
    setIsConverting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = convertDate(state.input, state.timezone, state.autoDetect, state.explicitFormat ?? undefined)
      setResult(res)
      setCustomResult(formatCustomPattern(res.date, state.timezone, state.customPattern))
      setSuccess("Conversion successful")
    } catch (err) {
      if (err instanceof DateParseError) {
        setError(err.message)
      } else {
        setError("Something went wrong while converting this date. Please check the input and try again.")
      }
      setResult(null)
      setCustomResult("")
    } finally {
      setIsConverting(false)
    }
  }, [state.input, state.timezone, state.autoDetect, state.explicitFormat])

  const setCustomPattern = useCallback(
    (pattern: string) => {
      setState((prev) => ({ ...prev, customPattern: pattern }))
      setCustomResult((prevResult) => {
        if (!result) return prevResult
        return formatCustomPattern(result.date, state.timezone, pattern)
      })
    },
    [result, state.timezone]
  )

  const copyValue = useCallback(async (value: string): Promise<boolean> => {
    clearFeedback()
    if (!value) return false
    try {
      await navigator.clipboard.writeText(value)
      setSuccess("Copied to clipboard")
      window.setTimeout(() => setSuccess(null), 1200)
      return true
    } catch {
      setError("Could not copy to clipboard. Please copy manually.")
      return false
    }
  }, [clearFeedback])

  return {
    state,
    result,
    customResult,
    error,
    success,
    isConverting,
    statsBar,

    setInput,
    setTimezone,
    setAutoDetect,
    setExplicitFormat,
    setCustomPattern,
    clearAll,
    useToday,
    convert,
    copyValue,
    clearFeedback,
  }
}

