// Timestamp Converter state hook - owns input, options, results, and actions
import { useCallback, useMemo, useRef, useState } from "react"
import {
  convertTimestamp,
  TimestampParseError,
  type DetectedFormat,
  type TimestampUnit,
  type TimezoneMode,
  type TimestampConversionResult,
} from "../utils/timestampUtils"

export type TimestampState = {
  input: string
  unit: TimestampUnit
  timezone: TimezoneMode
  autoDetect: boolean
}

const defaultState: TimestampState = {
  input: "",
  unit: "milliseconds",
  timezone: "local",
  autoDetect: true,
}

const formatDetectedLabel = (fmt: DetectedFormat): string => {
  if (fmt === "unix-seconds") return "Unix timestamp (seconds)"
  if (fmt === "unix-milliseconds") return "Unix timestamp (milliseconds)"
  if (fmt === "iso-8601") return "ISO 8601"
  if (fmt === "rfc-2822") return "RFC 2822"
  if (fmt === "date-time") return "Date + time"
  if (fmt === "date-only") return "Date only"
  return "Unknown format"
}

export const useTimestampConverter = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [state, setState] = useState<TimestampState>(defaultState)
  const [result, setResult] = useState<TimestampConversionResult | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  const statsBar = useMemo(() => {
    if (!result) {
      return {
        detectedFormat: "—",
        timezone: state.timezone === "local" ? "Local time" : "UTC",
        precision: state.unit === "milliseconds" ? "Milliseconds" : "Seconds",
      }
    }
    return {
      detectedFormat: formatDetectedLabel(result.detectedFormat),
      timezone: result.timezoneUsed === "local" ? "Local time" : "UTC",
      precision: result.unitUsed === "milliseconds" ? "Milliseconds" : "Seconds",
    }
  }, [result, state.timezone, state.unit])

  const setInput = useCallback((input: string) => {
    setState((prev) => ({ ...prev, input }))
  }, [])

  const setUnit = useCallback((unit: TimestampUnit) => {
    setState((prev) => ({ ...prev, unit }))
  }, [])

  const setTimezone = useCallback((timezone: TimezoneMode) => {
    setState((prev) => ({ ...prev, timezone }))
  }, [])

  const setAutoDetect = useCallback((autoDetect: boolean) => {
    setState((prev) => ({ ...prev, autoDetect }))
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

  const useCurrentTime = useCallback(() => {
    clearFeedback()
    const now = Date.now()
    const value = state.unit === "milliseconds" ? String(now) : String(Math.floor(now / 1000))
    setState((prev) => ({ ...prev, input: value }))
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [clearFeedback, state.unit])

  const convert = useCallback(() => {
    setIsConverting(true)
    setError(null)
    setSuccess(null)

    try {
      const res = convertTimestamp(state.input, state.unit, state.timezone, state.autoDetect)
      setResult(res)
      setSuccess("Conversion successful")
    } catch (err) {
      if (err instanceof TimestampParseError) {
        setError(err.message)
      } else {
        setError("Something went wrong while converting this timestamp. Please check the input and try again.")
      }
      setResult(null)
    } finally {
      setIsConverting(false)
    }
  }, [state.input, state.unit, state.timezone, state.autoDetect])

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
    inputRef,
    state,
    result,
    error,
    success,
    isConverting,
    statsBar,

    setInput,
    setUnit,
    setTimezone,
    setAutoDetect,
    clearAll,
    useCurrentTime,
    convert,
    copyValue,
    clearFeedback,
  }
}

