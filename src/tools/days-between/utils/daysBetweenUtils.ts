// Days Between Two Dates – date math utilities (client-side only)
// Handles leap years, weekdays-only mode, and alternative time units.

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Parse YYYY-MM-DD or create date at start of day (local). */
export function parseDateInput(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return null
  const y = parseInt(match[1], 10)
  const m = parseInt(match[2], 10) - 1
  const d = parseInt(match[3], 10)
  const date = new Date(y, m, d)
  if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) return null
  return date
}

/** Format date as YYYY-MM-DD (local). */
export function formatDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Long format e.g. "Tuesday, January 6, 2026". */
export function formatDateLong(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Check if date is Saturday (6) or Sunday (0). */
function isWeekend(d: Date): boolean {
  const day = d.getDay()
  return day === 0 || day === 6
}

/** Days between start and end (end exclusive by default). Optionally count only weekdays. */
export function daysBetween(
  start: Date,
  end: Date,
  options: { includeEndDate?: boolean; weekdaysOnly?: boolean } = {}
): number {
  const includeEnd = options.includeEndDate ?? false
  const weekdaysOnly = options.weekdaysOnly ?? false

  const startMs = start.getTime()
  const endMs = end.getTime()
  if (endMs < startMs) return 0

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  let totalMs = endDay - startDay
  if (includeEnd) totalMs += MS_PER_DAY
  let days = Math.round(totalMs / MS_PER_DAY)

  if (!weekdaysOnly) return days

  let count = 0
  const cursor = new Date(startDay)
  const last = new Date(endDay)
  if (includeEnd) last.setDate(last.getDate() + 1)
  while (cursor.getTime() < last.getTime()) {
    if (!isWeekend(cursor)) count++
    cursor.setDate(cursor.getDate() + 1)
  }
  return count
}

/** Full breakdown: weekdays, weekends, full weeks, remaining days, leap year info. */
export type DaysBreakdown = {
  totalDays: number
  weekdays: number
  weekends: number
  fullWeeks: number
  remainingDays: number
  startDayOfWeek: string
  endDayOfWeek: string
  isLeapYearInRange: boolean
  leapYearsInRange: number[]
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getBreakdown(
  start: Date,
  end: Date,
  options: { includeEndDate?: boolean } = {}
): DaysBreakdown {
  const includeEnd = options.includeEndDate ?? false
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const totalDays = daysBetween(start, end, { includeEndDate: includeEnd, weekdaysOnly: false })
  const weekdays = daysBetween(start, end, { includeEndDate: includeEnd, weekdaysOnly: true })
  const weekends = totalDays - weekdays
  const fullWeeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7

  const y1 = start.getFullYear()
  const y2 = end.getFullYear()
  const leapYears: number[] = []
  for (let y = y1; y <= y2; y++) {
    if (isLeapYear(y)) leapYears.push(y)
  }
  const isLeapYearInRange = leapYears.length > 0

  return {
    totalDays,
    weekdays,
    weekends,
    fullWeeks,
    remainingDays,
    startDayOfWeek: DAY_NAMES[startDay.getDay()],
    endDayOfWeek: DAY_NAMES[endDay.getDay()],
    isLeapYearInRange,
    leapYearsInRange: leapYears,
  }
}

/** Calendar difference: years, months, days between two dates. */
export type YearsMonthsDays = {
  years: number
  months: number
  days: number
  totalMonths: number
}

/** Get calendar difference from start to end (or end - 1 day if !includeEndDate). */
export function getYearsMonthsDays(
  start: Date,
  end: Date,
  includeEndDate: boolean
): YearsMonthsDays {
  const startNorm = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  let lastDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  if (!includeEndDate) lastDay.setDate(lastDay.getDate() - 1)
  if (lastDay.getTime() < startNorm.getTime()) {
    return { years: 0, months: 0, days: 0, totalMonths: 0 }
  }
  let years = lastDay.getFullYear() - startNorm.getFullYear()
  let months = lastDay.getMonth() - startNorm.getMonth()
  let days = lastDay.getDate() - startNorm.getDate()
  if (days < 0) {
    days += new Date(lastDay.getFullYear(), lastDay.getMonth(), 0).getDate()
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }
  const totalMonths = years * 12 + months
  return { years, months, days, totalMonths }
}

/** Human-readable sentences for the result. */
export type DurationSentences = {
  sentenceDays: string
  sentenceYearsDays: string
  sentenceMonthsDays: string
}

export function getDurationSentences(
  totalDays: number,
  yearsMonthsDays: YearsMonthsDays,
  includeEndDate: boolean
): DurationSentences {
  const endPhrase = includeEndDate ? "including the end date" : "but not including the end date"
  const excludePhrase = includeEndDate ? "including the end date" : "excluding the end date"
  const sentenceDays = `It is ${totalDays.toLocaleString()} ${totalDays === 1 ? "day" : "days"} from the start date to the end date, ${endPhrase}.`
  const { years, months, days, totalMonths } = yearsMonthsDays
  const yPart = years === 0 ? "" : `${years} ${years === 1 ? "year" : "years"}`
  const mPart = months === 0 ? "" : `${months} ${months === 1 ? "month" : "months"}`
  const dPart = `${days} ${days === 1 ? "day" : "days"}`
  const partsY = [yPart, mPart, dPart].filter(Boolean)
  const sentenceYearsDays = partsY.length > 0
    ? `Or ${partsY.join(", ")} ${excludePhrase}.`
    : `Or ${dPart} ${excludePhrase}.`
  const sentenceMonthsDays =
    totalMonths > 0 || days > 0
      ? `Or ${totalMonths} ${totalMonths === 1 ? "month" : "months"}, ${days} ${days === 1 ? "day" : "days"} ${excludePhrase}.`
      : ""
  return { sentenceDays, sentenceYearsDays, sentenceMonthsDays }
}

/** Alternative units and percentage of year. */
export type AlternativeUnits = {
  hours: number
  minutes: number
  seconds: number
  weeks: number
  remainingDaysAfterWeeks: number
  percentOfYear: number
  yearForPercent: number
  days: number
}

export function getAlternativeUnits(
  totalDays: number,
  referenceYear: number
): AlternativeUnits {
  const hours = totalDays * 24
  const minutes = hours * 60
  const seconds = minutes * 60
  const weeks = Math.floor(totalDays / 7)
  const remainingDaysAfterWeeks = totalDays % 7
  const daysInYear = isLeapYear(referenceYear) ? 366 : 365
  const percentOfYear = totalDays > 0 ? (totalDays / daysInYear) * 100 : 0
  return {
    hours,
    minutes,
    seconds,
    weeks,
    remainingDaysAfterWeeks,
    percentOfYear,
    yearForPercent: referenceYear,
    days: totalDays,
  }
}

/** Calendar: get list of dates in range for a given month (for rendering). */
export type CalendarDay = {
  date: Date
  dateKey: string
  isStart: boolean
  isEnd: boolean
  inRange: boolean
  isWeekend: boolean
  dayOfMonth: number
  isCurrentMonth: boolean
}

export function getCalendarDaysForMonth(
  year: number,
  month: number,
  rangeStart: Date | null,
  rangeEnd: Date | null,
  includeEndDate: boolean
): CalendarDay[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const startMs = rangeStart ? new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime() : 0
  const endDayMidnight = rangeEnd ? new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime() : 0
  const endMs = includeEndDate ? endDayMidnight + MS_PER_DAY : endDayMidnight

  const result: CalendarDay[] = []
  const startDow = first.getDay()
  const padStart = startDow
  for (let i = 0; i < padStart; i++) {
    const d = new Date(year, month, 1 - (padStart - i))
    result.push({
      date: d,
      dateKey: formatDateLocal(d),
      isStart: false,
      isEnd: false,
      inRange: false,
      isWeekend: isWeekend(d),
      dayOfMonth: d.getDate(),
      isCurrentMonth: false,
    })
  }
  for (let day = 1; day <= last.getDate(); day++) {
    const d = new Date(year, month, day)
    const t = d.getTime()
    const inRange =
      rangeStart != null &&
      rangeEnd != null &&
      t >= startMs &&
      t < endMs
    const isStart = rangeStart != null && formatDateLocal(d) === formatDateLocal(rangeStart)
    const isEnd = rangeEnd != null && formatDateLocal(d) === formatDateLocal(rangeEnd)
    result.push({
      date: d,
      dateKey: formatDateLocal(d),
      isStart,
      isEnd,
      inRange,
      isWeekend: isWeekend(d),
      dayOfMonth: day,
      isCurrentMonth: true,
    })
  }
  const remaining = 42 - result.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    result.push({
      date: d,
      dateKey: formatDateLocal(d),
      isStart: false,
      isEnd: false,
      inRange: false,
      isWeekend: isWeekend(d),
      dayOfMonth: d.getDate(),
      isCurrentMonth: false,
    })
  }
  return result.slice(0, 42)
}

export function getMonthsToShow(start: Date, end: Date): { year: number; month: number }[] {
  const out: { year: number; month: number }[] = []
  const cur = new Date(start.getFullYear(), start.getMonth(), 1)
  const last = new Date(end.getFullYear(), end.getMonth(), 1)
  while (cur.getTime() <= last.getTime()) {
    out.push({ year: cur.getFullYear(), month: cur.getMonth() })
    cur.setMonth(cur.getMonth() + 1)
  }
  return out
}
