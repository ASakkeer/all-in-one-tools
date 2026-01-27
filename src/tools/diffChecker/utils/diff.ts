// Utility functions for computing line and word level diffs for the Diff Checker tool

export type DiffOp = "equal" | "insert" | "delete" | "replace"

export interface WordDiffPart {
  value: string
  type: "equal" | "insert" | "delete"
}

export interface DiffLine {
  type: DiffOp
  left?: string
  right?: string
  indexLeft?: number
  indexRight?: number
}

export interface DiffOptions {
  ignoreWhitespace: boolean
  ignoreCase: boolean
  ignoreEmptyLines: boolean
}

export type DiffBlockType = "unchanged" | "add" | "remove" | "modify"

export interface DiffBlock {
  type: DiffBlockType
  leftLines: string[]
  rightLines: string[]
  leftStartLine: number | null
  rightStartLine: number | null
  wordParts?: WordDiffPart[]
}

const canonicalize = (line: string, options: DiffOptions): string => {
  let result = line
  if (options.ignoreWhitespace) {
    result = result.trim()
  }
  if (options.ignoreCase) {
    result = result.toLowerCase()
  }
  return result
}

const areEqual = (a: string, b: string, options: DiffOptions): boolean => {
  return canonicalize(a, options) === canonicalize(b, options)
}

// Basic LCS-based diff for lines
const computeLineDiff = (
  leftText: string,
  rightText: string,
  options: DiffOptions,
): DiffLine[] => {
  const leftLines = leftText.split(/\r?\n/)
  const rightLines = rightText.split(/\r?\n/)

  const n = leftLines.length
  const m = rightLines.length

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  )

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (
        areEqual(leftLines[i], rightLines[j], options) &&
        (!options.ignoreEmptyLines ||
          canonicalize(leftLines[i], options).length > 0)
      ) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const diff: DiffLine[] = []
  let i = 0
  let j = 0

  while (i < n && j < m) {
    const left = leftLines[i]
    const right = rightLines[j]

    if (
      areEqual(left, right, options) ||
      (options.ignoreEmptyLines &&
        canonicalize(left, options).length === 0 &&
        canonicalize(right, options).length === 0)
    ) {
      diff.push({
        type: "equal",
        left,
        right,
        indexLeft: i,
        indexRight: j,
      })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      diff.push({
        type: "delete",
        left,
        indexLeft: i,
        indexRight: j,
      })
      i++
    } else {
      diff.push({
        type: "insert",
        right,
        indexLeft: i,
        indexRight: j,
      })
      j++
    }
  }

  while (i < n) {
      diff.push({
        type: "delete",
        left: leftLines[i],
        indexLeft: i,
        indexRight: m,
      })
    i++
  }

  while (j < m) {
    diff.push({
      type: "insert",
      right: rightLines[j],
      indexLeft: n,
      indexRight: j,
    })
    j++
  }

  // Refine equal/delete/insert combinations into replace where appropriate
  const refined: DiffLine[] = []
  for (let k = 0; k < diff.length; k++) {
    const current = diff[k]
    const next = diff[k + 1]
    if (current && next && current.type === "delete" && next.type === "insert") {
      refined.push({
        type: "replace",
        left: current.left,
        right: next.right,
        indexLeft: current.indexLeft,
        indexRight: next.indexRight,
      })
      k++
    } else {
      refined.push(current)
    }
  }

  return refined
}

// Word-level diff using a simple LCS on whitespace-separated tokens
export const computeWordDiff = (
  leftLine: string,
  rightLine: string,
  options: DiffOptions,
): WordDiffPart[] => {
  const leftTokens = leftLine.split(/(\s+)/)
  const rightTokens = rightLine.split(/(\s+)/)

  const n = leftTokens.length
  const m = rightTokens.length

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  )

  const tokenEquals = (a: string, b: string) =>
    areEqual(a, b, { ...options, ignoreWhitespace: false })

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (tokenEquals(leftTokens[i], rightTokens[j])) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const parts: WordDiffPart[] = []
  let i = 0
  let j = 0

  while (i < n && j < m) {
    if (tokenEquals(leftTokens[i], rightTokens[j])) {
      parts.push({ value: rightTokens[j], type: "equal" })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ value: leftTokens[i], type: "delete" })
      i++
    } else {
      parts.push({ value: rightTokens[j], type: "insert" })
      j++
    }
  }

  while (i < n) {
    parts.push({ value: leftTokens[i], type: "delete" })
    i++
  }

  while (j < m) {
    parts.push({ value: rightTokens[j], type: "insert" })
    j++
  }

  return parts
}

// High-level diff model grouped into logical blocks
export const computeDiffBlocks = (
  leftText: string,
  rightText: string,
  options: DiffOptions,
): DiffBlock[] => {
  const lines = computeLineDiff(leftText, rightText, options)

  if (lines.length === 0) {
    return []
  }

  const blocks: DiffBlock[] = []
  let current: DiffBlock | null = null

  const flush = () => {
    if (current) {
      // Attach word-level diff for modified blocks
      if (current.type === "modify") {
        const leftJoined = current.leftLines.join("\n")
        const rightJoined = current.rightLines.join("\n")
        current.wordParts = computeWordDiff(leftJoined, rightJoined, options)
      }
      blocks.push(current)
      current = null
    }
  }

  for (const line of lines) {
    if (line.type === "equal") {
      // Unchanged
      if (!current || current.type !== "unchanged") {
        flush()
        current = {
          type: "unchanged",
          leftLines: [],
          rightLines: [],
          leftStartLine:
            line.indexLeft !== undefined && line.indexLeft !== null
              ? line.indexLeft
              : null,
          rightStartLine:
            line.indexRight !== undefined && line.indexRight !== null
              ? line.indexRight
              : null,
        }
      }
      if (line.left !== undefined) {
        current.leftLines.push(line.left)
      }
      if (line.right !== undefined) {
        current.rightLines.push(line.right)
      }
    } else {
      // Changed (insert/delete/replace)
      const isInsertOnly = line.type === "insert"
      const isDeleteOnly = line.type === "delete"

      const blockType: DiffBlockType =
        !isInsertOnly && !isDeleteOnly ? "modify" : isDeleteOnly ? "remove" : "add"

      if (!current || current.type !== blockType) {
        flush()
        current = {
          type: blockType,
          leftLines: [],
          rightLines: [],
          leftStartLine:
            line.indexLeft !== undefined && line.indexLeft !== null
              ? line.indexLeft
              : null,
          rightStartLine:
            line.indexRight !== undefined && line.indexRight !== null
              ? line.indexRight
              : null,
        }
      }

      if (line.left !== undefined && line.left !== null) {
        current.leftLines.push(line.left)
      }
      if (line.right !== undefined && line.right !== null) {
        current.rightLines.push(line.right)
      }
    }
  }

  flush()

  return blocks
}


