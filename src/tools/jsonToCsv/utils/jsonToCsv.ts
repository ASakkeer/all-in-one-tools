// JSON to CSV conversion utility - flattening, array handling, and safe CSV escaping
// Used by the JSON to CSV Converter tool. Runs fully client-side.

export type JsonStructureMode = "array" | "single" | "nested"
export type ArrayHandlingMode = "join" | "expand" | "ignore"
export type MissingValueMode = "empty" | "null"
export type LineEndingMode = "LF" | "CRLF"

export type JsonToCsvOptions = {
  structure: JsonStructureMode
  flattenObjects: boolean
  arrayHandling: ArrayHandlingMode
  includeAllKeys: boolean
  preserveKeyOrder: boolean
  delimiter: string

  // Advanced
  missingValue: MissingValueMode
  escapeDoubleQuotes: boolean
  wrapAllValuesInQuotes: boolean
  stringifyBooleansAndNumbers: boolean
  lineEndings: LineEndingMode
}

export type JsonToCsvStats = {
  rows: number
  columns: number
}

export class JsonToCsvError extends Error {
  code:
    | "EMPTY_INPUT"
    | "INVALID_JSON"
    | "UNSUPPORTED_STRUCTURE"
    | "INVALID_DELIMITER"
    | "ARRAY_EXPANSION_INCONSISTENT"
  line?: number
  column?: number
  position?: number

  constructor(message: string, code: JsonToCsvError["code"]) {
    super(message)
    this.name = "JsonToCsvError"
    this.code = code
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

const getLineColumnFromIndex = (text: string, index: number): { line: number; column: number } => {
  const safeIndex = Math.max(0, Math.min(index, text.length))
  let line = 1
  let lastLineStart = 0
  for (let i = 0; i < safeIndex; i += 1) {
    const ch = text[i]
    if (ch === "\n") {
      line += 1
      lastLineStart = i + 1
    }
  }
  return { line, column: safeIndex - lastLineStart + 1 }
}

export const parseJsonWithLocation = (input: string): unknown => {
  try {
    return JSON.parse(input)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON."
    const locationMatch = /position\s+(\d+)/i.exec(message)
    const e = new JsonToCsvError(message, "INVALID_JSON")
    if (locationMatch) {
      const position = Number(locationMatch[1])
      if (Number.isFinite(position)) {
        const { line, column } = getLineColumnFromIndex(input, position)
        e.position = position
        e.line = line
        e.column = column
      }
    }
    throw e
  }
}

const flattenObject = (
  value: Record<string, unknown>,
  prefix: string,
  out: Record<string, unknown>
) => {
  Object.keys(value).forEach((key) => {
    const nextKey = prefix ? `${prefix}.${key}` : key
    const v = value[key]
    if (isPlainObject(v)) {
      flattenObject(v, nextKey, out)
    } else {
      out[nextKey] = v
    }
  })
}

const normalizeDelimiter = (delimiter: string): string => {
  const value = delimiter ?? ","
  if (value.length !== 1) {
    const e = new JsonToCsvError("Custom CSV delimiter must be a single character.", "INVALID_DELIMITER")
    throw e
  }
  return value
}

const toCellString = (
  value: unknown,
  options: JsonToCsvOptions,
  delimiter: string
): string => {
  let raw: string

  if (value === undefined || value === null) {
    raw = options.missingValue === "null" ? "null" : ""
  } else if (typeof value === "string") {
    raw = value
  } else if (typeof value === "number" || typeof value === "boolean") {
    raw = options.stringifyBooleansAndNumbers ? String(value) : String(value)
  } else if (Array.isArray(value)) {
    // Arrays should be handled before reaching this function.
    raw = options.arrayHandling === "ignore" ? "" : JSON.stringify(value)
  } else if (isPlainObject(value)) {
    raw = JSON.stringify(value)
  } else {
    raw = String(value)
  }

  const needsQuotes =
    options.wrapAllValuesInQuotes ||
    raw.includes('"') ||
    raw.includes("\n") ||
    raw.includes("\r") ||
    raw.includes(delimiter)

  if (!needsQuotes) return raw

  const escaped = options.escapeDoubleQuotes ? raw.replace(/"/g, '""') : raw
  return `"${escaped}"`
}

const normalizeLineEndings = (lines: string[], eol: LineEndingMode): string => {
  const joiner = eol === "CRLF" ? "\r\n" : "\n"
  return lines.join(joiner)
}

const expandArraysForRow = (
  obj: Record<string, unknown>,
  options: JsonToCsvOptions
): Record<string, unknown>[] => {
  const keys = Object.keys(obj)
  const arrayKeys = keys.filter((k) => Array.isArray(obj[k]))

  if (options.arrayHandling !== "expand" || arrayKeys.length === 0) {
    return [obj]
  }

  // Cartesian expansion across array keys.
  let rows: Record<string, unknown>[] = [{ ...obj }]
  for (const key of arrayKeys) {
    const arr = obj[key] as unknown[]
    const values = arr.length === 0 ? [options.missingValue === "null" ? null : ""] : arr
    const next: Record<string, unknown>[] = []
    for (const r of rows) {
      for (const v of values) {
        next.push({ ...r, [key]: v })
      }
    }
    rows = next
  }
  return rows
}

export const jsonToCsv = (
  input: string,
  options: JsonToCsvOptions
): { csv: string; headers: string[]; tableRows: string[][]; stats: JsonToCsvStats } => {
  const text = input ?? ""
  if (!text.trim()) {
    throw new JsonToCsvError("Paste JSON content or upload a JSON file to convert.", "EMPTY_INPUT")
  }

  const delimiter = normalizeDelimiter(options.delimiter || ",")

  const parsed = parseJsonWithLocation(text)

  let baseRows: Record<string, unknown>[] = []

  if (options.structure === "single") {
    if (!isPlainObject(parsed)) {
      throw new JsonToCsvError("Expected a single JSON object.", "UNSUPPORTED_STRUCTURE")
    }
    baseRows = [parsed]
  } else if (options.structure === "array") {
    if (!Array.isArray(parsed)) {
      throw new JsonToCsvError("Expected a JSON array of objects.", "UNSUPPORTED_STRUCTURE")
    }
    const allObjects = parsed.every((v) => isPlainObject(v))
    if (!allObjects) {
      throw new JsonToCsvError("Expected a JSON array of objects.", "UNSUPPORTED_STRUCTURE")
    }
    baseRows = parsed as Record<string, unknown>[]
  } else {
    // nested: allow object or array of objects; flattening will take care of nested properties
    if (Array.isArray(parsed)) {
      const allObjects = parsed.every((v) => isPlainObject(v))
      if (!allObjects) {
        throw new JsonToCsvError("Expected nested JSON as an object or an array of objects.", "UNSUPPORTED_STRUCTURE")
      }
      baseRows = parsed as Record<string, unknown>[]
    } else if (isPlainObject(parsed)) {
      baseRows = [parsed]
    } else {
      throw new JsonToCsvError("Expected nested JSON as an object or an array of objects.", "UNSUPPORTED_STRUCTURE")
    }
  }

  // Preprocess rows: flatten objects and apply array handling.
  const expandedRows: Record<string, unknown>[] = []
  for (const rawRow of baseRows) {
    let rowObj: Record<string, unknown> = rawRow

    if (options.flattenObjects) {
      const flattened: Record<string, unknown> = {}
      flattenObject(rowObj, "", flattened)
      rowObj = flattened
    }

    if (options.arrayHandling === "ignore") {
      const next: Record<string, unknown> = {}
      Object.keys(rowObj).forEach((k) => {
        const v = rowObj[k]
        if (Array.isArray(v)) return
        next[k] = v
      })
      rowObj = next
      expandedRows.push(rowObj)
      continue
    }

    if (options.arrayHandling === "join") {
      const next: Record<string, unknown> = {}
      Object.keys(rowObj).forEach((k) => {
        const v = rowObj[k]
        if (Array.isArray(v)) {
          next[k] = v.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(", ")
        } else {
          next[k] = v
        }
      })
      expandedRows.push(next)
      continue
    }

    // expand
    expandArraysForRow(rowObj, options).forEach((r) => expandedRows.push(r))
  }

  // Build headers
  let headers: string[] = []
  if (options.includeAllKeys) {
    const seen = new Set<string>()
    if (options.preserveKeyOrder) {
      for (const r of expandedRows) {
        Object.keys(r).forEach((k) => {
          if (!seen.has(k)) {
            seen.add(k)
            headers.push(k)
          }
        })
      }
    } else {
      for (const r of expandedRows) {
        Object.keys(r).forEach((k) => seen.add(k))
      }
      headers = Array.from(seen).sort()
    }
  } else {
    headers = expandedRows.length ? Object.keys(expandedRows[0]) : []
  }

  // Ensure consistent column count after header selection
  const tableRows: string[][] = []
  const lines: string[] = []

  const headerLine = headers.map((h) => toCellString(h, options, delimiter)).join(delimiter)
  lines.push(headerLine)

  for (const r of expandedRows) {
    const row = headers.map((h) => toCellString(r[h], options, delimiter))
    if (row.length !== headers.length) {
      throw new JsonToCsvError(
        "Array expansion resulted in inconsistent row lengths.",
        "ARRAY_EXPANSION_INCONSISTENT"
      )
    }
    tableRows.push(row.map((cell) => (cell.startsWith('"') && cell.endsWith('"') ? cell.slice(1, -1).replace(/""/g, '"') : cell)))
    lines.push(row.join(delimiter))
  }

  return {
    csv: normalizeLineEndings(lines, options.lineEndings),
    headers,
    tableRows,
    stats: { rows: expandedRows.length, columns: headers.length },
  }
}

