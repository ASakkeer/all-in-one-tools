// Date conversion utilities - parsing and formatting dates into multiple representations
// All logic is client-side and used by the Date Converter tool.

export type DateTimezoneMode = "local" | "utc"

export type DateDetectedFormat =
  | "yyyy-mm-dd"
  | "dd/mm/yyyy"
  | "mm/dd/yyyy"
  | "iso-8601-date"
  | "textual"
  | "unknown"

export type PrimaryDateResults = {
  isoDate: string
  humanReadable: string
  localDate: string
  utcDate: string
  shortNumeric: string
}

export type CommonRegionalFormats = {
  ddMmYyyySlashes: string
  mmDdYyyySlashes: string
  yyyyMmDdSlashes: string
  ddMmYyyyDashes: string
  mmDdYyyyDashes: string
}

export type TechnicalDateFormats = {
  rfc3339Date: string
  isoWeekDate: string
  julianDate: string
  daysSinceEpoch: string
  databaseDate: string
  javaDate: string
  pythonDate: string
}

export type DateMetadata = {
  dayOfWeek: string
  dayOfYear: string
  weekNumber: string
  monthName: string
  quarter: string
  isLeapYear: boolean
}

export type DateConversionResult = {
  date: Date
  primary: PrimaryDateResults
  common: CommonRegionalFormats
  technical: TechnicalDateFormats
  metadata: DateMetadata
  detectedFormat: DateDetectedFormat
  timezoneUsed: DateTimezoneMode
  calendarSystem: "Gregorian"
}

export class DateParseError extends Error {
  code: "EMPTY" | "INVALID" | "OUT_OF_RANGE"
  constructor(message: string, code: DateParseError["code"]) {
    super(message)
    this.name = "DateParseError"
    this.code = code
  }
}

const pad = (value: number, length = 2): string => value.toString().padStart(length, "0")

const isValidRange = (year: number): boolean => year >= 1900 && year <= 9999

const detectFormat = (raw: string): DateDetectedFormat => {
  const v = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return "yyyy-mm-dd"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [p1, p2] = v.split("/")
    const first = Number(p1)
    const second = Number(p2)
    if (first > 12 && second <= 12) return "dd/mm/yyyy"
    if (second > 12 && first <= 12) return "mm/dd/yyyy"
    return "unknown"
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) {
    const [p1, p2] = v.split("-")
    const first = Number(p1)
    const second = Number(p2)
    if (first > 12 && second <= 12) return "dd/mm/yyyy"
    if (second > 12 && first <= 12) return "mm/dd/yyyy"
    return "unknown"
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return "iso-8601-date"
  if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(v)) return "textual"
  if (/^\d{1,2} [A-Za-z]+ \d{4}$/.test(v)) return "textual"
  return "unknown"
}

const parseKnownFormat = (raw: string, fmt: DateDetectedFormat): Date | null => {
  const v = raw.trim()
  if (fmt === "yyyy-mm-dd") {
    const [yy, mm, dd] = v.split("-").map(Number)
    if (!isValidRange(yy)) return null
    const d = new Date(Date.UTC(yy, mm - 1, dd))
    if (d.getUTCFullYear() !== yy || d.getUTCMonth() !== mm - 1 || d.getUTCDate() !== dd) return null
    return d
  }
  if (fmt === "dd/mm/yyyy" || fmt === "mm/dd/yyyy") {
    const sep = v.includes("/") ? "/" : "-"
    const [p1, p2, yStr] = v.split(sep)
    const year = Number(yStr)
    if (!isValidRange(year)) return null
    let day: number
    let month: number
    if (fmt === "dd/mm/yyyy") {
      day = Number(p1)
      month = Number(p2)
    } else {
      month = Number(p1)
      day = Number(p2)
    }
    const d = new Date(Date.UTC(year, month - 1, day))
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null
    return d
  }
  if (fmt === "iso-8601-date") {
    const parsed = Date.parse(v)
    if (Number.isNaN(parsed)) return null
    const d = new Date(parsed)
    // Normalize to midnight in UTC for date-only purposes
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth()
    const day = d.getUTCDate()
    return new Date(Date.UTC(year, month, day))
  }
  if (fmt === "textual") {
    const parsed = Date.parse(v)
    if (Number.isNaN(parsed)) return null
    const d = new Date(parsed)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth()
    const day = d.getUTCDate()
    return new Date(Date.UTC(year, month, day))
  }
  return null
}

const getMonthName = (monthIndex: number): string =>
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthIndex]

const getDayName = (dayIndex: number): string =>
  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex]

const getDayOfYear = (date: Date): number => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0))
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const getWeekOfYear = (date: Date): { week: number; isoYear: number } => {
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { week: weekNo, isoYear: temp.getUTCFullYear() }
}

const getJulianDate = (date: Date): number => {
  // Julian day number algorithm for Gregorian calendar
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12)
  const y = date.getUTCFullYear() + 4800 - a
  const m = date.getUTCMonth() + 1 + 12 * a - 3
  const jdn =
    date.getUTCDate() +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  return jdn
}

const getQuarter = (monthIndex: number): number => Math.floor(monthIndex / 3) + 1

export const convertDate = (
  rawInput: string,
  timezone: DateTimezoneMode,
  autoDetect: boolean,
  explicitFormat?: DateDetectedFormat
): DateConversionResult => {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    throw new DateParseError("Please enter a date to convert.", "EMPTY")
  }

  let detected: DateDetectedFormat = "unknown"
  let baseDate: Date | null = null

  if (autoDetect) {
    detected = detectFormat(trimmed)
    baseDate = parseKnownFormat(trimmed, detected)
    if (!baseDate) {
      const parsed = Date.parse(trimmed)
      if (!Number.isNaN(parsed)) {
        const d = new Date(parsed)
        baseDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        detected = detected === "unknown" ? "textual" : detected
      }
    }
  } else {
    const fmt = explicitFormat ?? "yyyy-mm-dd"
    detected = fmt
    baseDate = parseKnownFormat(trimmed, fmt)
  }

  if (!baseDate) {
    throw new DateParseError("Invalid date format. Please check the input.", "INVALID")
  }

  const year = baseDate.getUTCFullYear()
  if (!isValidRange(year)) {
    throw new DateParseError("Date out of supported range (1900–9999).", "OUT_OF_RANGE")
  }

  const month = baseDate.getUTCMonth() // 0-based
  const day = baseDate.getUTCDate()

  const isoDate = `${year}-${pad(month + 1)}-${pad(day)}`
  const humanReadable = `${getMonthName(month)} ${day}, ${year}`

  const localDate = (() => {
    const local = new Date(baseDate.getTime())
    const ly = local.getFullYear()
    const lm = pad(local.getMonth() + 1)
    const ld = pad(local.getDate())
    return `${ly}-${lm}-${ld}`
  })()

  const utcDate = isoDate

  const shortNumeric = `${pad(month + 1)}/${pad(day)}/${String(year).slice(-2)}`

  const primary: PrimaryDateResults = {
    isoDate,
    humanReadable,
    localDate: timezone === "local" ? localDate : utcDate,
    utcDate,
    shortNumeric,
  }

  const common: CommonRegionalFormats = {
    ddMmYyyySlashes: `${pad(day)}/${pad(month + 1)}/${year}`,
    mmDdYyyySlashes: `${pad(month + 1)}/${pad(day)}/${year}`,
    yyyyMmDdSlashes: `${year}/${pad(month + 1)}/${pad(day)}`,
    ddMmYyyyDashes: `${pad(day)}-${pad(month + 1)}-${year}`,
    mmDdYyyyDashes: `${pad(month + 1)}-${pad(day)}-${year}`,
  }

  const { week, isoYear } = getWeekOfYear(baseDate)
  const dayOfYear = getDayOfYear(baseDate)
  const julian = getJulianDate(baseDate)

  const technical: TechnicalDateFormats = {
    rfc3339Date: `${isoDate}`,
    isoWeekDate: `${isoYear}-W${pad(week)}-${baseDate.getUTCDay() || 7}`,
    julianDate: String(julian),
    daysSinceEpoch: String(Math.floor(baseDate.getTime() / (1000 * 60 * 60 * 24))),
    databaseDate: isoDate,
    javaDate: isoDate,
    pythonDate: isoDate,
  }

  const metadata: DateMetadata = {
    dayOfWeek: getDayName(baseDate.getUTCDay()),
    dayOfYear: String(dayOfYear),
    weekNumber: String(week),
    monthName: getMonthName(month),
    quarter: `Q${getQuarter(month)}`,
    isLeapYear: (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,
  }

  return {
    date: baseDate,
    primary,
    common,
    technical,
    metadata,
    detectedFormat: detected,
    timezoneUsed: timezone,
    calendarSystem: "Gregorian",
  }
}

export const formatCustomPattern = (
  date: Date,
  timezone: DateTimezoneMode,
  pattern: string
): string => {
  const d = date
  const year = timezone === "utc" ? d.getUTCFullYear() : d.getFullYear()
  const month = (timezone === "utc" ? d.getUTCMonth() : d.getMonth()) + 1
  const day = timezone === "utc" ? d.getUTCDate() : d.getDate()
  const hour = timezone === "utc" ? d.getUTCHours() : d.getHours()
  const minute = timezone === "utc" ? d.getUTCMinutes() : d.getMinutes()
  const second = timezone === "utc" ? d.getUTCSeconds() : d.getSeconds()

  let result = ""
  let i = 0

  while (i < pattern.length) {
    const ch = pattern[i]

    if (ch === "[") {
      // Literal until closing bracket or end of string
      let j = i + 1
      let literal = ""
      while (j < pattern.length && pattern[j] !== "]") {
        literal += pattern[j]
        j += 1
      }
      result += literal
      i = j < pattern.length ? j + 1 : j
      continue
    }

    if (pattern.startsWith("YYYY", i)) {
      result += String(year)
      i += 4
      continue
    }
    if (pattern.startsWith("MM", i)) {
      result += pad(month)
      i += 2
      continue
    }
    if (pattern.startsWith("DD", i)) {
      result += pad(day)
      i += 2
      continue
    }
    if (pattern.startsWith("HH", i)) {
      result += pad(hour)
      i += 2
      continue
    }
    if (pattern.startsWith("mm", i)) {
      result += pad(minute)
      i += 2
      continue
    }
    if (pattern.startsWith("ss", i)) {
      result += pad(second)
      i += 2
      continue
    }

    result += ch
    i += 1
  }

  return result
}


