// Custom hook for managing Diff Checker state, options, and navigation
import { useMemo, useState } from "react"
import {
  computeDiffBlocks,
  type DiffBlock,
  type DiffOptions,
} from "../utils/diff"

export type DiffViewMode = "side-by-side" | "inline"

export interface DiffSummary {
  additions: number
  deletions: number
  modifications: number
}

const defaultOptions: DiffOptions = {
  ignoreWhitespace: false,
  ignoreCase: false,
  ignoreEmptyLines: false,
}

export const useDiffChecker = () => {
  const [leftText, setLeftText] = useState<string>("")
  const [rightText, setRightText] = useState<string>("")
  const [options, setOptions] = useState<DiffOptions>(defaultOptions)
  const [viewMode, setViewMode] = useState<DiffViewMode>("side-by-side")
  const [activeDiffIndex, setActiveDiffIndex] = useState<number | null>(null)
  const [showUnchanged, setShowUnchanged] = useState<boolean>(true)

  const blocks: DiffBlock[] = useMemo(
    () => computeDiffBlocks(leftText, rightText, options),
    [leftText, rightText, options],
  )

  const isIdentical = useMemo(
    () => blocks.length > 0 && blocks.every((block) => block.type === "unchanged"),
    [blocks],
  )

  const summary: DiffSummary = useMemo(() => {
    let additions = 0
    let deletions = 0
    let modifications = 0

    blocks.forEach((block) => {
      if (block.type === "add") additions++
      else if (block.type === "remove") deletions++
      else if (block.type === "modify") modifications++
    })

    return { additions, deletions, modifications }
  }, [blocks])

  const diffIndexes = useMemo(
    () =>
      blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => block.type !== "unchanged"),
    [blocks],
  )

  const hasDiffs = diffIndexes.length > 0

  const goToFirstDiff = () => {
    if (!hasDiffs) {
      setActiveDiffIndex(null)
      return
    }
    setActiveDiffIndex(diffIndexes[0].index)
  }

  const goToNextDiff = () => {
    if (!hasDiffs) return
    if (activeDiffIndex === null) {
      goToFirstDiff()
      return
    }
    const currentPos = diffIndexes.findIndex((d) => d.index === activeDiffIndex)
    const next = diffIndexes[(currentPos + 1) % diffIndexes.length]
    setActiveDiffIndex(next.index)
  }

  const goToPreviousDiff = () => {
    if (!hasDiffs) return
    if (activeDiffIndex === null) {
      goToFirstDiff()
      return
    }
    const currentPos = diffIndexes.findIndex((d) => d.index === activeDiffIndex)
    const prev =
      currentPos <= 0
        ? diffIndexes[diffIndexes.length - 1]
        : diffIndexes[currentPos - 1]
    setActiveDiffIndex(prev.index)
  }

  const toggleOption = (key: keyof DiffOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setActiveDiffIndex(null)
  }

  const toggleShowUnchanged = () => {
    setShowUnchanged((prev) => !prev)
  }

  const setView = (mode: DiffViewMode) => {
    setViewMode(mode)
  }

  const applyChangeLeftToRight = (index: number | "all") => {
    if (index === "all") {
      setRightText(leftText)
      return
    }

    const block = blocks[index]
    if (!block) return

    const leftLines = leftText.split(/\r?\n/)
    const rightLines = rightText.split(/\r?\n/)
    const leftStart = block.leftStartLine
    const rightStart = block.rightStartLine

    switch (block.type) {
      case "add": {
        // Remove added lines on the right
        if (rightStart !== null) {
          rightLines.splice(rightStart, block.rightLines.length)
        }
        break
      }
      case "remove": {
        // Insert removed lines into the right
        if (leftStart !== null) {
          const insertIndex = rightStart ?? rightLines.length
          rightLines.splice(insertIndex, 0, ...block.leftLines)
        }
        break
      }
      case "modify": {
        if (rightStart !== null) {
          rightLines.splice(rightStart, block.rightLines.length, ...block.leftLines)
        }
        break
      }
      default:
        break
    }

    setRightText(rightLines.join("\n"))
  }

  const applyChangeRightToLeft = (index: number | "all") => {
    if (index === "all") {
      setLeftText(rightText)
      return
    }

    const block = blocks[index]
    if (!block) return

    const leftLines = leftText.split(/\r?\n/)
    const rightLines = rightText.split(/\r?\n/)
    const leftStart = block.leftStartLine
    const rightStart = block.rightStartLine

    switch (block.type) {
      case "add": {
        // Insert added lines into the left
        if (rightStart !== null) {
          const insertIndex = leftStart ?? leftLines.length
          leftLines.splice(insertIndex, 0, ...block.rightLines)
        }
        break
      }
      case "remove": {
        // Remove lines on the left
        if (leftStart !== null) {
          leftLines.splice(leftStart, block.leftLines.length)
        }
        break
      }
      case "modify": {
        if (leftStart !== null) {
          leftLines.splice(leftStart, block.leftLines.length, ...block.rightLines)
        }
        break
      }
      default:
        break
    }

    setLeftText(leftLines.join("\n"))
  }

  return {
    leftText,
    rightText,
    setLeftText,
    setRightText,
    blocks,
    options,
    viewMode,
    summary,
    activeDiffIndex,
    hasDiffs,
    isIdentical,
    showUnchanged,
    toggleOption,
    toggleShowUnchanged,
    setView,
    goToFirstDiff,
    goToNextDiff,
    goToPreviousDiff,
    applyChangeLeftToRight,
    applyChangeRightToLeft,
  }
}

