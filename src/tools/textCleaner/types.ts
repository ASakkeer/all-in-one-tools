// Shared types for the Text Cleaner tool

export type CleanerOptionCategory =
  | "whitespace"
  | "case"
  | "duplicates"
  | "punctuation"
  | "advanced"

export type CleanerOptionKey =
  // whitespace
  | "trimEdges"
  | "collapseSpaces"
  | "removeEmptyLines"
  | "lineBreaksToSpaces"
  | "consolidateBlankLines"
  // case
  | "lowercase"
  | "uppercase"
  | "titleCase"
  | "sentenceCase"
  // duplicates
  | "removeDuplicateLines"
  | "removeDuplicateWords"
  // punctuation
  | "normalizeSpacing"
  // advanced
  | "stripNonPrintable"
  | "normalizeQuotes"
  | "normalizeDashes"
  | "removeAccents"

export interface CleanerOptions {
  whitespace: {
    trimEdges: boolean
    collapseSpaces: boolean
    removeEmptyLines: boolean
    lineBreaksToSpaces: boolean
    consolidateBlankLines: boolean
  }
  case: {
    lowercase: boolean
    uppercase: boolean
    titleCase: boolean
    sentenceCase: boolean
  }
  duplicates: {
    removeDuplicateLines: boolean
    removeDuplicateWords: boolean
  }
  punctuation: {
    normalizeSpacing: boolean
  }
  advanced: {
    stripNonPrintable: boolean
    normalizeQuotes: boolean
    normalizeDashes: boolean
    removeAccents: boolean
  }
}

