// Days Between Two Dates – state and calculation hook
// Owns input state, options, results; computes only on Calculate click.

import { useCallback, useMemo, useState } from "react"
import {
  daysBetween,
  formatDateLong,
  getAlternativeUnits,
  getBreakdown,
  getDurationSentences,
  getMonthsToShow,
  getYearsMonthsDays,
  parseDateInput,
  type AlternativeUnits,
  type DaysBreakdown,
  type DurationSentences,
  type YearsMonthsDays,
} from "../utils/daysBetweenUtils"

export type DaysBetweenResult = {
  totalDays: number
  startDate: Date
  endDate: Date
  includeEndDate: boolean
  weekdaysOnly: boolean
  startFormatted: string
  endFormatted: string
  endIncludedLabel: string
  units: AlternativeUnits
  breakdown: DaysBreakdown
  yearsMonthsDays: YearsMonthsDays
  sentences: DurationSentences
}

type State = {
  startInput: string
  endInput: string
  includeEndDate: boolean
  weekdaysOnly: boolean
}

const defaultState: State = {
  startInput: "",
  endInput: "",
  includeEndDate: false,
  weekdaysOnly: false,
}

export function useDaysBetween() {
  const [state, setState] = useState<State>(defaultState)
  const [result, setResult] = useState<DaysBetweenResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const setStartInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, startInput: value }))
    setError(null)
  }, [])

  const setEndInput = useCallback((value: string) => {
    setState((prev) => ({ ...prev, endInput: value }))
    setError(null)
  }, [])

  const setIncludeEndDate = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, includeEndDate: value }))
  }, [])

  const setWeekdaysOnly = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, weekdaysOnly: value }))
  }, [])

  const clearAll = useCallback(() => {
    setState(defaultState)
    setResult(null)
    setError(null)
    setSuccess(null)
  }, [])

  const useTodayStart = useCallback(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    setState((prev) => ({ ...prev, startInput: `${y}-${m}-${d}` }))
    setError(null)
  }, [])

  const useTodayEnd = useCallback(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    setState((prev) => ({ ...prev, endInput: `${y}-${m}-${d}` }))
    setError(null)
  }, [])

  const calculate = useCallback(() => {
    setError(null)
    setSuccess(null)

    const start = parseDateInput(state.startInput)
    const end = parseDateInput(state.endInput)

    if (!start) {
      setError("Invalid date input for start date.")
      setResult(null)
      return
    }
    if (!end) {
      setError("Invalid date input for end date.")
      setResult(null)
      return
    }
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    if (endDay.getTime() < startDay.getTime()) {
      setError("End date must be after start date.")
      setResult(null)
      return
    }

    const totalDays = daysBetween(start, end, {
      includeEndDate: state.includeEndDate,
      weekdaysOnly: state.weekdaysOnly,
    })
    const units = getAlternativeUnits(
      totalDays,
      start.getFullYear()
    )
    const breakdown = getBreakdown(start, end, {
      includeEndDate: state.includeEndDate,
    })
    const yearsMonthsDays = getYearsMonthsDays(start, end, state.includeEndDate)
    const sentences = getDurationSentences(totalDays, yearsMonthsDays, state.includeEndDate)

    setResult({
      totalDays,
      startDate: start,
      endDate: end,
      includeEndDate: state.includeEndDate,
      weekdaysOnly: state.weekdaysOnly,
      startFormatted: formatDateLong(start),
      endFormatted: formatDateLong(end),
      endIncludedLabel: state.includeEndDate ? "End date included" : "End date not included",
      units,
      breakdown,
      yearsMonthsDays,
      sentences,
    })
    setSuccess("Calculation successful.")
  }, [
    state.startInput,
    state.endInput,
    state.includeEndDate,
    state.weekdaysOnly,
  ])

  const monthsToShow = useMemo(() => {
    if (!result) return []
    return getMonthsToShow(result.startDate, result.endDate)
  }, [result])

  return {
    state,
    result,
    error,
    success,
    monthsToShow,
    setStartInput,
    setEndInput,
    setIncludeEndDate,
    setWeekdaysOnly,
    clearAll,
    useTodayStart,
    useTodayEnd,
    calculate,
  }
}
