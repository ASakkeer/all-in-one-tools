// textUtils - pure utilities for cleaning and normalizing text
// All functions are:
// - pure
// - accept a string
// - return a string

// ---------- Whitespace management ----------

// Trim leading and trailing whitespace from the whole text
export const trimEdges = (text: string): string => text.trim()

// Collapse consecutive spaces and tabs into a single space, preserving line breaks
export const collapseSpacesAndTabs = (text: string): string =>
  text.replace(/[ \t]+/g, " ")

// Remove lines that are completely empty or contain only whitespace
export const removeEmptyLines = (text: string): string =>
  text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .join("\n")

// Convert all line breaks into spaces (single line output)
export const lineBreaksToSpaces = (text: string): string =>
  text.replace(/\r?\n|\r/g, " ")

// Consolidate multiple consecutive blank lines into a single blank line
export const consolidateBlankLines = (text: string): string => {
  // Replace 2+ consecutive blank lines with a single blank line
  return text.replace(/(\r?\n){3,}/g, "\n\n")
}

// Backwards-compatible helpers used by the initial version of the tool
export const removeExtraSpaces = (text: string): string =>
  collapseSpacesAndTabs(text)

export const removeLineBreaks = (text: string): string =>
  lineBreaksToSpaces(text)

// ---------- Case conversion ----------

export const toLowercase = (text: string): string => text.toLowerCase()

export const toUppercase = (text: string): string => text.toUpperCase()

// Naive Title Case: capitalise first letter of each word, lower-case the rest
export const toTitleCase = (text: string): string =>
  text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  )

// Sentence case: capitalise first letter after a period/exclamation/question mark.
export const toSentenceCase = (text: string): string => {
  const lower = text.toLowerCase()
  return lower.replace(
    /(^\s*\w|[.!?]\s+\w)/g,
    (match) => match.toUpperCase(),
  )
}

// ---------- Duplicate removal ----------

// Remove duplicate lines while preserving the first occurrence order
export const removeDuplicateLines = (text: string): string => {
  const seen = new Set<string>()
  const lines = text.split(/\r?\n/)
  const result: string[] = []

  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line)
      result.push(line)
    }
  }

  return result.join("\n")
}

// Remove duplicate words within the whole text (very naive, whitespace-delimited)
export const removeDuplicateWords = (text: string): string => {
  const tokens = text.split(/\s+/)
  const seen = new Set<string>()
  const result: string[] = []

  for (const token of tokens) {
    if (!seen.has(token)) {
      seen.add(token)
      result.push(token)
    }
  }

  return result.join(" ")
}

// ---------- Advanced cleaning ----------

// Strip non-printable / control characters, while keeping standard whitespace
export const stripNonPrintable = (text: string): string =>
  text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")

// Normalize spacing around punctuation: ensure a single space after , ; : . ! ? if followed by a word
export const normalizePunctuationSpacing = (text: string): string =>
  text
    // Remove spaces before punctuation
    .replace(/\s+([,;:.!?])/g, "$1")
    // Ensure exactly one space after punctuation when followed by a word
    .replace(/([,;:.!?]){1}\s*/g, "$1 ")

// Convert smart/curly quotation marks to straight quotes
export const normalizeQuotes = (text: string): string =>
  text
    // Double quotes
    .replace(/[“”«»„‟]/g, '"')
    // Single quotes / apostrophes
    .replace(/[‘’‚‛]/g, "'")

// Normalize em/en dashes to basic hyphen-minus
export const normalizeDashes = (text: string): string =>
  text.replace(/[–—]/g, "-")

// Remove accents / diacritics using Unicode normalization where available
export const removeAccents = (text: string): string => {
  if (typeof text.normalize === "function") {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }
  return text
}

