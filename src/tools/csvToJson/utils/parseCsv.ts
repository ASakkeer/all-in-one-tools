// CSV parsing utility - fast, quote-aware parser with detailed row-level errors
// Used by the CSV to JSON Converter tool. All parsing happens client-side.

export type CsvDelimiterPreset = "comma" | "semicolon" | "tab" | "pipe" | "custom"

export type CsvParseOptions = {
  delimiter: CsvDelimiterPreset
  customDelimiter: string
  firstRowHeader: boolean
  trimValues: boolean
  skipEmptyLines: boolean
  handleQuotedValues: boolean
  allowInconsistentColumnCounts: boolean
}

export type CsvParseStats = {
  rows: number
  columns: number
}

export type CsvParseResult = {
  headers: string[]
  rows: (string | null)[][]
  objects: Record<string, string | null>[]
  stats: CsvParseStats
}

export type CsvParseErrorCode =
  | "EMPTY_INPUT"
  | "INVALID_DELIMITER"
  | "UNCLOSED_QUOTE"
  | "INCONSISTENT_COLUMNS"

export class CsvParseError extends Error {
  code: CsvParseErrorCode
  row: number | null
  details?: string

  constructor(code: CsvParseErrorCode, message: string, row: number | null = null, details?: string) {
    super(message)
    this.name = "CsvParseError"
    this.code = code
    this.row = row
    this.details = details
  }
}

const resolveDelimiterChar = (options: CsvParseOptions): string => {
  if (options.delimiter === "comma") return ","
  if (options.delimiter === "semicolon") return ";"
  if (options.delimiter === "tab") return "\t"
  if (options.delimiter === "pipe") return "|"

  const value = options.customDelimiter ?? ""
  // Accept exactly one character (tab allowed via actual tab char).
  if (value.length !== 1) {
    throw new CsvParseError(
      "INVALID_DELIMITER",
      "Custom delimiter must be a single character.",
      null
    )
  }
  return value
}

const normalizeHeader = (raw: string, trim: boolean): string => {
  const value = trim ? raw.trim() : raw
  return value || "column"
}

const makeUniqueHeaders = (headers: string[]): string[] => {
  const seen = new Map<string, number>()
  return headers.map((h) => {
    const base = h || "column"
    const prev = seen.get(base) ?? 0
    if (prev === 0) {
      seen.set(base, 1)
      return base
    }
    seen.set(base, prev + 1)
    return `${base}_${prev}`
  })
}

export const parseCsv = (input: string, options: CsvParseOptions): CsvParseResult => {
  const text = input ?? ""
  if (!text.trim()) {
    throw new CsvParseError("EMPTY_INPUT", "Paste CSV content or upload a CSV file to convert.")
  }

  const delimiter = resolveDelimiterChar(options)

  // State machine parser: supports Windows/Unix line endings and quoted values.
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false
  let rowIndex = 1 // 1-based for user-facing errors

  const pushField = () => {
    row.push(field)
    field = ""
  }

  const pushRow = () => {
    // If the row is "empty" (all fields empty) and skipEmptyLines is enabled, drop it.
    const isEffectivelyEmpty =
      row.length === 0 || row.every((v) => (options.trimValues ? v.trim() : v) === "")
    if (!(options.skipEmptyLines && isEffectivelyEmpty)) {
      rows.push(row)
    }
    row = []
    rowIndex += 1
  }

  const len = text.length
  for (let i = 0; i < len; i += 1) {
    const ch = text[i]

    if (options.handleQuotedValues) {
      if (ch === '"') {
        // Escaped quote inside a quoted field: "" -> "
        if (inQuotes && text[i + 1] === '"') {
          field += '"'
          i += 1
          continue
        }
        inQuotes = !inQuotes
        continue
      }

      if (!inQuotes && ch === delimiter) {
        pushField()
        continue
      }

      if (!inQuotes && (ch === "\n" || ch === "\r")) {
        pushField()
        // Handle \r\n as a single newline
        if (ch === "\r" && text[i + 1] === "\n") i += 1
        pushRow()
        continue
      }

      field += ch
      continue
    }

    // Non-quote-aware parsing (treat quotes as normal characters)
    if (ch === delimiter) {
      pushField()
      continue
    }
    if (ch === "\n" || ch === "\r") {
      pushField()
      if (ch === "\r" && text[i + 1] === "\n") i += 1
      pushRow()
      continue
    }
    field += ch
  }

  if (inQuotes) {
    // The current rowIndex points to the row being parsed.
    throw new CsvParseError("UNCLOSED_QUOTE", `Unclosed quote detected on row ${rowIndex}.`, rowIndex)
  }

  // Flush final field/row if there's any remaining content.
  // Even for input without a trailing newline, we want to include the last row.
  pushField()
  // If it's an "empty last row" produced by trailing newline, pushRow will drop it if skipEmptyLines.
  pushRow()

  // Remove a trailing empty row that can appear when the input ends with a newline and skipEmptyLines is false.
  // (We still allow intentional blank rows inside the CSV if skipEmptyLines is off.)
  if (rows.length > 0 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    if (text.endsWith("\n") || text.endsWith("\r")) {
      rows.pop()
    }
  }

  if (rows.length === 0) {
    throw new CsvParseError("EMPTY_INPUT", "No rows found. Paste CSV content or upload a CSV file to convert.")
  }

  // Apply trimming and strip surrounding quotes (quotes are already stripped by the parser; this is for non-quote-aware mode).
  const cleanedRows: string[][] = rows.map((r) =>
    r.map((v) => {
      let value = v
      if (options.trimValues) value = value.trim()
      if (!options.handleQuotedValues) {
        // If user disabled quote handling, still remove surrounding quotes for convenience.
        if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }
      }
      return value
    })
  )

  // Determine headers and expected column count.
  let dataStartIndex = 0
  let headers: string[] = []

  if (options.firstRowHeader) {
    const headerRow = cleanedRows[0] ?? []
    headers = makeUniqueHeaders(headerRow.map((h) => normalizeHeader(h, options.trimValues)))
    dataStartIndex = 1
  }

  // Compute maximum columns in data rows (or from header if present).
  const dataRows = cleanedRows.slice(dataStartIndex)
  const maxDataColumns = dataRows.reduce((max, r) => Math.max(max, r.length), 0)
  const baseExpected = options.firstRowHeader ? headers.length : maxDataColumns
  const expectedColumns = Math.max(baseExpected, maxDataColumns)

  if (!options.firstRowHeader) {
    headers = Array.from({ length: expectedColumns }, (_, idx) => `column${idx + 1}`)
  } else if (headers.length < expectedColumns) {
    // Allow extra columns by extending headers with generated names.
    const start = headers.length
    const extra = Array.from({ length: expectedColumns - start }, (_, idx) => `column${start + idx + 1}`)
    headers = makeUniqueHeaders([...headers, ...extra])
  }

  // Normalize rows to expected column count and validate inconsistencies.
  const normalized: (string | null)[][] = []
  for (let i = 0; i < dataRows.length; i += 1) {
    const r = dataRows[i]
    const rowNumber = options.firstRowHeader ? i + 2 : i + 1

    if (!options.allowInconsistentColumnCounts && r.length !== expectedColumns) {
      const direction = r.length < expectedColumns ? "fewer" : "more"
      throw new CsvParseError(
        "INCONSISTENT_COLUMNS",
        `Row ${rowNumber} has ${direction} columns than expected (${r.length} vs ${expectedColumns}).`,
        rowNumber
      )
    }

    const next: (string | null)[] = new Array(expectedColumns).fill(null)
    for (let c = 0; c < Math.min(r.length, expectedColumns); c += 1) {
      next[c] = r[c]
    }
    normalized.push(next)
  }

  const objects: Record<string, string | null>[] = normalized.map((r) => {
    const obj: Record<string, string | null> = {}
    for (let i = 0; i < headers.length; i += 1) {
      obj[headers[i]] = r[i] ?? null
    }
    return obj
  })

  return {
    headers,
    rows: normalized,
    objects,
    stats: { rows: normalized.length, columns: headers.length },
  }
}

