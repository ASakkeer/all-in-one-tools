// Timestamp conversion utilities - parsing and formatting timestamps into multiple representations
// All logic is client-side and used by the Timestamp Converter tool.

export type TimestampUnit = "seconds" | "milliseconds"
export type TimezoneMode = "local" | "utc"

export type DetectedFormat =
  | "unix-seconds"
  | "unix-milliseconds"
  | "iso-8601"
  | "rfc-2822"
  | "date-time"
  | "date-only"
  | "unknown"

export type PrimaryResults = {
  unixSeconds: string
  unixMilliseconds: string
  iso8601: string
  local: string
  utc: string
}

export type CommonFormats = {
  rfc2822: string
  yyyyMmDd: string
  yyyyMmDdHhMmSs: string
  ddMmYyyy: string
  mmDdYyyy: string
  time12h: string
  time24h: string
}

export type AdvancedFormats = {
  isoWeekDate: string
  dayOfYear: string
  weekNumber: string
  quarter: string
  unixNanoseconds: string
  jsDateString: string
  javaInstant: string
  pythonDatetime: string
  sqlTimestamp: string
}

export type Metadata = {
  timezoneOffsetMinutes: number
  timezoneOffsetLabel: string
  isDst: boolean
  dayOfWeek: string
  isLeapYear: boolean
}

export type TimestampConversionResult = {
  date: Date
  primary: PrimaryResults
  common: CommonFormats
  advanced: AdvancedFormats
  metadata: Metadata
  detectedFormat: DetectedFormat
  unitUsed: TimestampUnit
  timezoneUsed: TimezoneMode
}

export class TimestampParseError extends Error {
  code: "EMPTY" | "INVALID" | "UNSUPPORTED"
  constructor(message: string, code: TimestampParseError["code"]) {
    super(message)
    this.name = "TimestampParseError"
    this.code = code
  }
}

const pad = (value: number, length = 2): string => value.toString().padStart(length, "0")

const parseAsUnix = (raw: string, unit: TimestampUnit): { date: Date | null; format: DetectedFormat } => {
  if (!/^-?\d+$/.test(raw)) return { date: null, format: "unknown" }
  const num = Number(raw)
  if (!Number.isFinite(num)) return { date: null, format: "unknown" }

  // Heuristics: 10 digits → seconds, 13+ digits → ms
  const length = raw.replace(/^-/, "").length
  let ms: number
  let format: DetectedFormat
  if (unit === "seconds" || length === 10) {
    ms = num * 1000
    format = "unix-seconds"
  } else {
    ms = num
    format = "unix-milliseconds"
  }

  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return { date: null, format: "unknown" }
  return { date, format }
}

const tryParseWithNative = (raw: string): Date | null => {
  const parsed = Date.parse(raw)
  if (Number.isNaN(parsed)) return null
  return new Date(parsed)
}

const detectFormatFromString = (raw: string): DetectedFormat => {
  const trimmed = raw.trim()
  if (/^-?\d+$/.test(trimmed)) {
    const len = trimmed.replace(/^-/, "").length
    if (len === 10) return "unix-seconds"
    if (len >= 13) return "unix-milliseconds"
    return "unknown"
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return "date-only"

  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?/.test(trimmed)) return "date-time"

  if (/^[A-Z][a-z]{2},\s+\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+/.test(trimmed)) {
    return "rfc-2822"
  }

  if (/\d{4}-\d{2}-\d{2}T/.test(trimmed)) return "iso-8601"

  return "unknown"
}

const formatWithTimezone = (date: Date, timezone: TimezoneMode): string => {
  const d = date
  const year = timezone === "utc" ? d.getUTCFullYear() : d.getFullYear()
  const month = (timezone === "utc" ? d.getUTCMonth() : d.getMonth()) + 1
  const day = timezone === "utc" ? d.getUTCDate() : d.getDate()
  const hour = timezone === "utc" ? d.getUTCHours() : d.getHours()
  const minute = timezone === "utc" ? d.getUTCMinutes() : d.getMinutes()
  const second = timezone === "utc" ? d.getUTCSeconds() : d.getSeconds()
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}

const formatIso = (date: Date, timezone: TimezoneMode): string => {
  if (timezone === "utc") return date.toISOString()
  const offsetMinutes = -date.getTimezoneOffset()
  const offsetSign = offsetMinutes >= 0 ? "+" : "-"
  const absOffset = Math.abs(offsetMinutes)
  const offsetH = pad(Math.floor(absOffset / 60))
  const offsetM = pad(absOffset % 60)

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  const second = pad(date.getSeconds())
  const ms = date.getMilliseconds()

  const msPart = ms ? `.${pad(ms, 3)}` : ""
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${msPart}${offsetSign}${offsetH}:${offsetM}`
}

const getWeekOfYear = (date: Date): { week: number; isoYear: number } => {
  // ISO week date based on Thursday of current week.
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { week: weekNo, isoYear: temp.getUTCFullYear() }
}

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1
}

const getDayName = (date: Date): string => {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    date.getDay()
  ]
}

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const inferDst = (date: Date): boolean => {
  const jan = new Date(date.getFullYear(), 0, 1)
  const jul = new Date(date.getFullYear(), 6, 1)
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
  return date.getTimezoneOffset() < stdOffset
}

export const convertTimestamp = (
  rawInput: string,
  unit: TimestampUnit,
  timezone: TimezoneMode,
  autoDetect: boolean
): TimestampConversionResult => {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    throw new TimestampParseError("Please enter a timestamp or date to convert.", "EMPTY")
  }

  let date: Date | null = null
  let detectedFormat: DetectedFormat = "unknown"

  if (autoDetect) {
    const unixResult = parseAsUnix(trimmed, unit)
    if (unixResult.date) {
      date = unixResult.date
      detectedFormat = unixResult.format
    } else {
      const fmt = detectFormatFromString(trimmed)
      const parsed = tryParseWithNative(trimmed)
      if (!parsed) {
        throw new TimestampParseError("Unrecognized date or timestamp format.", "INVALID")
      }
      date = parsed
      detectedFormat = fmt
    }
  } else {
    const unixResult = parseAsUnix(trimmed, unit)
    if (!unixResult.date) {
      throw new TimestampParseError("Invalid Unix timestamp for the selected unit.", "INVALID")
    }
    date = unixResult.date
    detectedFormat = unixResult.format
  }

  if (!date || Number.isNaN(date.getTime())) {
    throw new TimestampParseError("Unable to parse this timestamp.", "INVALID")
  }

  const ms = date.getTime()
  const unixSeconds = Math.floor(ms / 1000)

  const primary: PrimaryResults = {
    unixSeconds: String(unixSeconds),
    unixMilliseconds: String(ms),
    iso8601: formatIso(date, timezone),
    local: formatWithTimezone(date, "local"),
    utc: formatWithTimezone(date, "utc"),
  }

  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const mi = pad(date.getMinutes())
  const ss = pad(date.getSeconds())

  const common: CommonFormats = {
    rfc2822: date.toUTCString(),
    yyyyMmDd: `${yyyy}-${mm}-${dd}`,
    yyyyMmDdHhMmSs: `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`,
    ddMmYyyy: `${dd}/${mm}/${yyyy}`,
    mmDdYyyy: `${mm}/${dd}/${yyyy}`,
    time12h: (() => {
      const hour12 = ((date.getHours() + 11) % 12) + 1
      const suffix = date.getHours() >= 12 ? "PM" : "AM"
      return `${pad(hour12)}:${mi}:${ss} ${suffix}`
    })(),
    time24h: `${hh}:${mi}:${ss}`,
  }

  const { week, isoYear } = getWeekOfYear(date)
  const dayOfYear = getDayOfYear(date)
  const quarter = getQuarter(date)

  const advanced: AdvancedFormats = {
    isoWeekDate: `${isoYear}-W${pad(week)}-${date.getDay() || 7}`,
    dayOfYear: String(dayOfYear),
    weekNumber: String(week),
    quarter: `Q${quarter}`,
    unixNanoseconds: `${ms}000000`,
    jsDateString: date.toString(),
    javaInstant: new Date(ms).toISOString(),
    pythonDatetime: `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`,
    sqlTimestamp: `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`,
  }

  const offsetMinutes = date.getTimezoneOffset()
  const sign = offsetMinutes <= 0 ? "+" : "-"
  const offsetAbs = Math.abs(offsetMinutes)
  const offsetH = pad(Math.floor(offsetAbs / 60))
  const offsetM = pad(offsetAbs % 60)
  const metadata: Metadata = {
    timezoneOffsetMinutes: offsetMinutes,
    timezoneOffsetLabel: `UTC${sign}${offsetH}:${offsetM}`,
    isDst: inferDst(date),
    dayOfWeek: getDayName(date),
    isLeapYear: isLeapYear(yyyy),
  }

  return {
    date,
    primary,
    common,
    advanced,
    metadata,
    detectedFormat,
    unitUsed: unit,
    timezoneUsed: timezone,
  }
}

