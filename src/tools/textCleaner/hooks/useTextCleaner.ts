// useTextCleaner hook - core state and transformation logic for Text Cleaner
// Implements an options-based, deterministic cleaning pipeline.
import { useState, useCallback, useMemo, useEffect } from "react"
import type {
  CleanerOptions,
  CleanerOptionCategory,
  CleanerOptionKey,
} from "../types"
import {
  trimEdges,
  collapseSpacesAndTabs,
  removeEmptyLines,
  lineBreaksToSpaces,
  consolidateBlankLines,
  toLowercase,
  toUppercase,
  toTitleCase,
  toSentenceCase,
  removeDuplicateLines,
  removeDuplicateWords,
  stripNonPrintable,
  normalizePunctuationSpacing,
  normalizeQuotes,
  normalizeDashes,
  removeAccents,
} from "../utils/textUtils"

const DEFAULT_OPTIONS: CleanerOptions = {
  whitespace: {
    trimEdges: true,
    collapseSpaces: true,
    removeEmptyLines: false,
    lineBreaksToSpaces: false,
    consolidateBlankLines: false,
  },
  case: {
    lowercase: false,
    uppercase: false,
    titleCase: false,
    sentenceCase: false,
  },
  duplicates: {
    removeDuplicateLines: false,
    removeDuplicateWords: false,
  },
  punctuation: {
    normalizeSpacing: false,
  },
  advanced: {
    stripNonPrintable: false,
    normalizeQuotes: false,
    normalizeDashes: false,
    removeAccents: false,
  },
}

// Build a deterministic pipeline of transforms from options
const buildPipeline = (options: CleanerOptions) => {
  const transforms: Array<(text: string) => string> = []

  // 1. Whitespace
  if (options.whitespace.trimEdges) transforms.push(trimEdges)
  if (options.whitespace.collapseSpaces) transforms.push(collapseSpacesAndTabs)
  if (options.whitespace.removeEmptyLines) transforms.push(removeEmptyLines)
  if (options.whitespace.lineBreaksToSpaces)
    transforms.push(lineBreaksToSpaces)
  if (options.whitespace.consolidateBlankLines)
    transforms.push(consolidateBlankLines)

  // 2. Duplicates
  if (options.duplicates.removeDuplicateLines)
    transforms.push(removeDuplicateLines)
  if (options.duplicates.removeDuplicateWords)
    transforms.push(removeDuplicateWords)

  // 3. Punctuation
  if (options.punctuation.normalizeSpacing)
    transforms.push(normalizePunctuationSpacing)

  // 4. Advanced
  if (options.advanced.stripNonPrintable) transforms.push(stripNonPrintable)
  if (options.advanced.normalizeQuotes) transforms.push(normalizeQuotes)
  if (options.advanced.normalizeDashes) transforms.push(normalizeDashes)
  if (options.advanced.removeAccents) transforms.push(removeAccents)

  // 5. Case (only one should be active; if multiple, apply in a fixed priority)
  const caseOrder: Array<keyof CleanerOptions["case"]> = [
    "lowercase",
    "uppercase",
    "titleCase",
    "sentenceCase",
  ]
  const activeCase = caseOrder.find((key) => options.case[key])
  if (activeCase === "lowercase") transforms.push(toLowercase)
  if (activeCase === "uppercase") transforms.push(toUppercase)
  if (activeCase === "titleCase") transforms.push(toTitleCase)
  if (activeCase === "sentenceCase") transforms.push(toSentenceCase)

  return transforms
}

export const useTextCleaner = () => {
  const [inputText, setInputText] = useState<string>("")
  const [options, setOptions] = useState<CleanerOptions>(DEFAULT_OPTIONS)
  const [outputText, setOutputText] = useState<string>("")

  const toggleOption = useCallback(
    (category: CleanerOptionCategory, key: CleanerOptionKey) => {
      setOptions((prev) => {
        const next: CleanerOptions = {
          ...prev,
          [category]: { ...prev[category] },
        } as CleanerOptions

        // Case options are mutually exclusive; turning one on turns others off
        if (category === "case") {
          const current = next.case[key as keyof CleanerOptions["case"]]
          const newValue = !current

          const cleared: CleanerOptions["case"] = {
            lowercase: false,
            uppercase: false,
            titleCase: false,
            sentenceCase: false,
          }

          ;(next.case as CleanerOptions["case"]) = {
            ...cleared,
            [key]: newValue,
          }

          return next
        }

        // For other categories, simple toggle
        const cat = next[category] as Record<string, boolean>
        cat[key] = !cat[key]
        return next
      })
    },
    [],
  )

  const resetAll = useCallback(() => {
    setInputText("")
    setOutputText("")
    setOptions(DEFAULT_OPTIONS)
  }, [])

  // Build pipeline and derive processed text
  const processed = useMemo(() => {
    if (!inputText) return ""
    const transforms = buildPipeline(options)
    return transforms.reduce((acc, fn) => fn(acc), inputText)
  }, [inputText, options])

  // Debounce output updates for large texts
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setOutputText(processed)
    }, 150)

    return () => window.clearTimeout(handle)
  }, [processed])

  return {
    inputText,
    outputText,
    setInputText,
    options,
    toggleOption,
    resetAll,
  }
}

