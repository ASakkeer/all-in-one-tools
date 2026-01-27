// Utility functions for computing text statistics for the Word Counter tool

export interface TextStats {
  wordCount: number
  charCountWithSpaces: number
  charCountWithoutSpaces: number
  sentenceCount: number
  lineCount: number
  paragraphCount: number
}

export const getTextStats = (text: string): TextStats => {
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      wordCount: 0,
      charCountWithSpaces: 0,
      charCountWithoutSpaces: 0,
      sentenceCount: 0,
      lineCount: 0,
      paragraphCount: 0,
    }
  }

  const charCountWithSpaces = text.length
  const charCountWithoutSpaces = text.replace(/\s+/g, "").length

  const words = trimmed.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  const sentences = trimmed
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter(Boolean)
  const sentenceCount = sentences.length

  const lines = text.split(/\r?\n/).length

  const paragraphs = trimmed
    .split(/\r?\n\r?\n+/g)
    .map((p) => p.trim())
    .filter(Boolean)
  const paragraphCount = paragraphs.length

  return {
    wordCount,
    charCountWithSpaces,
    charCountWithoutSpaces,
    sentenceCount,
    lineCount: lines,
    paragraphCount,
  }
}

