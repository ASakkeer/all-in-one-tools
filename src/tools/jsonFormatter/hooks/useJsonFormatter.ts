// Custom hook for JSON Formatter logic
import { useState, useEffect, useRef } from "react"
import { formatJson } from "../utils/formatJson"
import {
  minifyJson,
  sortJsonKeys,
  removeNullAndEmpty,
  jsonToPlainText,
  plainTextToJson,
  validateJson,
  getJsonSize,
} from "../utils/jsonTransformations"
import { parseJsonError } from "../utils/jsonErrorParser"

const STORAGE_KEY = "json-formatter-input"

export const useJsonFormatter = () => {
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [errorLine, setErrorLine] = useState<number | null>(null)
  const [errorColumn, setErrorColumn] = useState<number | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [sizeInfo, setSizeInfo] = useState<{ characters: number; bytes: number } | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Restore input from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setInput(saved)
    }
  }, [])

  // Save input to localStorage whenever it changes
  useEffect(() => {
    if (input) {
      localStorage.setItem(STORAGE_KEY, input)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [input])

  // Update size info when output changes
  useEffect(() => {
    if (output) {
      setSizeInfo(getJsonSize(output))
    } else {
      setSizeInfo(null)
    }
  }, [output])

  // Auto-validate and clear errors when input becomes valid
  useEffect(() => {
    if (input.trim() && error) {
      try {
        JSON.parse(input)
        // JSON is valid, clear errors
        setError(null)
        setErrorLine(null)
        setErrorColumn(null)
      } catch (err) {
        // JSON is still invalid, but don't update error here
        // Let the user trigger validation or formatting to see the error
      }
    } else if (!input.trim()) {
      // Clear errors when input is empty
      setError(null)
      setErrorLine(null)
      setErrorColumn(null)
    }
  }, [input, error])

  const processJson = (processor: () => string) => {
    try {
      setError(null)
      setErrorLine(null)
      setErrorColumn(null)
      const result = processor()
      setOutput(result)
      // Removed scroll behavior to prevent page scrolling on format/minify
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON. Please check your input."
      setError(errorMessage)
      setOutput("")
      
      // Parse error to get line and column
      if (err instanceof Error) {
        const errorInfo = parseJsonError(err, input)
        if (errorInfo) {
          setErrorLine(errorInfo.line)
          setErrorColumn(errorInfo.column)
        } else {
          setErrorLine(null)
          setErrorColumn(null)
        }
      } else {
        setErrorLine(null)
        setErrorColumn(null)
      }
    }
  }

  const format = () => {
    processJson(() => formatJson(input))
  }

  const minify = () => {
    processJson(() => minifyJson(input))
  }

  const sortKeys = (ascending: boolean) => {
    processJson(() => sortJsonKeys(input, ascending))
  }

  const removeNulls = () => {
    processJson(() => removeNullAndEmpty(input))
  }

  const convertToPlainText = () => {
    processJson(() => jsonToPlainText(input))
  }

  const convertFromPlainText = () => {
    processJson(() => plainTextToJson(input))
  }

  // Transform functions that operate on output
  const transformOutput = (processor: (json: string) => string) => {
    if (!output) return
    try {
      const result = processor(output)
      setOutput(result)
    } catch (err) {
      // Errors in transform don't affect input editor
      console.warn("Transform failed:", err)
    }
  }

  const sortOutputKeys = (ascending: boolean) => {
    transformOutput((json) => sortJsonKeys(json, ascending))
  }

  const removeOutputNulls = () => {
    transformOutput((json) => removeNullAndEmpty(json))
  }

  const convertOutputToPlainText = () => {
    transformOutput((json) => jsonToPlainText(json))
  }

  const convertOutputFromPlainText = () => {
    transformOutput((json) => plainTextToJson(json))
  }

  const validate = () => {
    const result = validateJson(input)
    setValidationResult(result)
    if (result.valid) {
      setError(null)
      setErrorLine(null)
      setErrorColumn(null)
    } else {
      setError(result.message)
      // Try to parse error for line/column
      try {
        JSON.parse(input)
      } catch (err) {
        if (err instanceof Error) {
          const errorInfo = parseJsonError(err, input)
          if (errorInfo) {
            setErrorLine(errorInfo.line)
            setErrorColumn(errorInfo.column)
          } else {
            setErrorLine(null)
            setErrorColumn(null)
          }
        }
      }
    }
  }

  const downloadJson = () => {
    if (output) {
      const blob = new Blob([output], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "formatted.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const clear = () => {
    setInput("")
    setOutput("")
    setError(null)
    setValidationResult(null)
    setSizeInfo(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output).then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      })
    }
  }

  return {
    input,
    setInput,
    output,
    error,
    errorLine,
    errorColumn,
    copied,
    validationResult,
    sizeInfo,
    outputRef,
    format,
    minify,
    sortKeys,
    removeNulls,
    convertToPlainText,
    convertFromPlainText,
    sortOutputKeys,
    removeOutputNulls,
    convertOutputToPlainText,
    convertOutputFromPlainText,
    validate,
    downloadJson,
    clear,
    copyToClipboard,
  }
}
