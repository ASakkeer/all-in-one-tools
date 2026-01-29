// Days Between Two Dates – right panel: primary result, units, calendar, breakdown, explanation
import type { FC } from "react"
import { getCalendarDaysForMonth } from "../utils/daysBetweenUtils"
import { CalendarVisualization } from "./CalendarVisualization"
import type { DaysBetweenResult } from "../hooks/useDaysBetween"

type DaysBetweenOutputPanelProps = {
  result: DaysBetweenResult | null
  success: string | null
  monthsToShow: { year: number; month: number }[]
}

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function formatPercent(n: number): string {
  return n.toFixed(2) + "%"
}

export const DaysBetweenOutputPanel: FC<DaysBetweenOutputPanelProps> = ({
  result,
  success,
  monthsToShow,
}) => {
  return (
    <div className="h-full max-h-[75%] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Days between two dates</h2>
          <p className="mt-1 text-xs text-gray-600">
            The main result is shown first. Expand sections below for calendar, breakdown, and how it works.
          </p>
        </div>
      </div>

      {/* Section 1: Primary result (always visible) */}
      <section aria-label="Primary result" className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        {result ? (
          <>
            <p className="text-lg font-semibold text-gray-900">
              {result.weekdaysOnly
                ? `Total weekdays: ${formatNumber(result.totalDays)} ${result.totalDays === 1 ? "day" : "days"}`
                : `Total days: ${formatNumber(result.totalDays)} ${result.totalDays === 1 ? "day" : "days"}`}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              From <strong>{result.startFormatted}</strong>
              <br />
              To <strong>{result.endFormatted}</strong>
              <br />
              <em>({result.endIncludedLabel})</em>
            </p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-700">
              <p>{result.sentences.sentenceDays}</p>
              <p>{result.sentences.sentenceYearsDays}</p>
              {result.sentences.sentenceMonthsDays && (
                <p>{result.sentences.sentenceMonthsDays}</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Enter start and end dates, then click Calculate to see the number of days here.
          </p>
        )}
      </section>

      {/* Section 2: Alternative time units – years, months, days, hours, minutes, seconds */}
      <section aria-label="Alternative time units" className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
        <h3 className="text-xs font-semibold text-gray-800">Alternative time units</h3>
        {result ? (
          <dl className="grid grid-cols-1 gap-2 text-xs text-gray-700 sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Years</dt>
              <dd className="font-medium text-gray-900">
                {result.yearsMonthsDays.years} {result.yearsMonthsDays.years === 1 ? "year" : "years"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Months</dt>
              <dd className="font-medium text-gray-900">
                {result.yearsMonthsDays.totalMonths} {result.yearsMonthsDays.totalMonths === 1 ? "month" : "months"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Days</dt>
              <dd className="font-medium text-gray-900">
                {formatNumber(result.units.days)} {result.units.days === 1 ? "day" : "days"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Hours</dt>
              <dd className="font-medium text-gray-900">{formatNumber(result.units.hours)} hours</dd>
            </div>
            <div>
              <dt className="text-gray-500">Minutes</dt>
              <dd className="font-medium text-gray-900">{formatNumber(result.units.minutes)} minutes</dd>
            </div>
            <div>
              <dt className="text-gray-500">Seconds</dt>
              <dd className="font-medium text-gray-900">{formatNumber(result.units.seconds)} seconds</dd>
            </div>
            <div>
              <dt className="text-gray-500">Weeks</dt>
              <dd className="font-medium text-gray-900">
                {result.units.weeks} {result.units.weeks === 1 ? "week" : "weeks"}
                {result.units.remainingDaysAfterWeeks > 0 &&
                  ` and ${result.units.remainingDaysAfterWeeks} ${result.units.remainingDaysAfterWeeks === 1 ? "day" : "days"}`}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Percentage of year</dt>
              <dd className="font-medium text-gray-900">
                {formatPercent(result.units.percentOfYear)} of {result.units.yearForPercent}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-[11px] text-gray-500">
            After calculating, you will see years, months, days, hours, minutes, seconds, weeks, and percentage of year here.
          </p>
        )}
      </section>

      {/* Section 3: Calendar visualization (collapsed by default) */}
      <section aria-label="View on calendar" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">View on calendar</h3>
              <p className="text-[11px] text-gray-500">
                Visual verification: start date, end date, and included range.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3">
            {result && monthsToShow.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {monthsToShow.map(({ year, month }) => {
                  const days = getCalendarDaysForMonth(
                    year,
                    month,
                    result.startDate,
                    result.endDate,
                    result.includeEndDate
                  )
                  return (
                    <CalendarVisualization
                      key={`${year}-${month}`}
                      year={year}
                      month={month}
                      days={days}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Calculate a date range to see it highlighted on the calendar.
              </p>
            )}
          </div>
        </details>
      </section>

      {/* Section 4: Detailed breakdown (collapsed by default) */}
      <section aria-label="Detailed breakdown" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">Detailed breakdown</h3>
              <p className="text-[11px] text-gray-500">
                Weekdays, weekends, full weeks, remaining days, leap year info.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3">
            {result ? (
              <dl className="grid grid-cols-1 gap-2 text-xs text-gray-700 sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Total weekdays</dt>
                  <dd className="font-medium text-gray-900">{result.breakdown.weekdays}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total weekends</dt>
                  <dd className="font-medium text-gray-900">{result.breakdown.weekends}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Full weeks</dt>
                  <dd className="font-medium text-gray-900">{result.breakdown.fullWeeks}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Remaining days</dt>
                  <dd className="font-medium text-gray-900">{result.breakdown.remainingDays}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Leap year in range</dt>
                  <dd className="font-medium text-gray-900">
                    {result.breakdown.isLeapYearInRange
                      ? `Yes (${result.breakdown.leapYearsInRange.join(", ")})`
                      : "No"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-xs text-gray-500">
                Run a calculation to see the detailed breakdown here.
              </p>
            )}
          </div>
        </details>
      </section>

      {/* Section 5: How this calculation works (collapsed by default) */}
      <section aria-label="How this calculation works" className="rounded-lg border border-gray-200 bg-white">
        <details className="group">
          <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-800">How this calculation works</h3>
              <p className="text-[11px] text-gray-500">
                Plain-language explanation of start/end, “include end date”, and weekdays-only.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 group-open:hidden">Show</span>
            <span className="text-[11px] text-gray-500 hidden group-open:inline">Hide</span>
          </summary>
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-3 text-xs text-gray-700">
            <p>
              <strong>Start and end dates:</strong> We count whole calendar days between the start date and the end date.
              By default, the end date is <em>not</em> included (so from Jan 1 to Jan 3 is 2 days).
            </p>
            <p>
              <strong>Include end date:</strong> When this is checked, we add one day so that the end date is included
              in the count (from Jan 1 to Jan 3 would then be 3 days).
            </p>
            <p>
              <strong>Count only weekdays:</strong> When this is checked, we count only Monday–Friday and ignore
              Saturdays and Sundays.
            </p>
            <p>
              <strong>Timezone:</strong> All dates are interpreted in your browser’s local time. For precise
              cross-timezone calculations, use a dedicated tool or specify a timezone when we add that option.
            </p>
          </div>
        </details>
      </section>

      {success && (
        <p className="mt-1.5 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
          {success}
        </p>
      )}
    </div>
  )
}
