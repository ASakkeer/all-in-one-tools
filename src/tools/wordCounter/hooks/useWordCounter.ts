// Custom hook for Word Counter logic and derived statistics
import { useState, useMemo } from "react"
import { getTextStats, type TextStats } from "../utils/textStats"

export const useWordCounter = () => {
  const [text, setText] = useState<string>("")

  const stats: TextStats = useMemo(() => getTextStats(text), [text])

  const clear = () => {
    setText("")
  }

  return {
    text,
    setText,
    stats,
    clear,
  }
}

