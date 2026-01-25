// Custom hook for JSON Formatter logic
import { useState, useEffect } from "react"
import { formatJson } from "../utils/formatJson"

const STORAGE_KEY = "json-formatter-input"

export const useJsonFormatter = () => {
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

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

  const format = () => {
    try {
      setError(null)
      const formatted = formatJson(input)
      setOutput(formatted)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON"
      setError(errorMessage)
      setOutput("")
    }
  }

  const clear = () => {
    setInput("")
    setOutput("")
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    input,
    setInput,
    output,
    error,
    format,
    clear,
  }
}
