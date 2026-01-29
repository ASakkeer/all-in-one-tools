// Days Between Two Dates – calendar grid showing start/end and range
import type { FC } from "react"
import type { CalendarDay } from "../utils/daysBetweenUtils"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type CalendarVisualizationProps = {
  year: number
  month: number
  days: CalendarDay[]
}

export const CalendarVisualization: FC<CalendarVisualizationProps> = ({
  year,
  month,
  days,
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h4 className="text-xs font-semibold text-gray-800 mb-2">
        {MONTH_NAMES[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {weekdays.map((d) => (
          <div key={d} className="text-[10px] font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
        {days.map((cell) => {
          let bg = "bg-white"
          if (cell.isStart || cell.isEnd) bg = "bg-emerald-600 text-white"
          else if (cell.inRange) bg = "bg-emerald-100 text-gray-900"
          if (!cell.isCurrentMonth) bg = "bg-gray-50 text-gray-400"
          return (
            <div
              key={cell.dateKey}
              className={`min-h-8 flex items-center justify-center rounded text-xs font-medium ${bg} ${
                cell.isCurrentMonth ? "" : "opacity-70"
              }`}
              title={cell.dateKey}
            >
              {cell.dayOfMonth}
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-600">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-emerald-600" aria-hidden />
          First / last day
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-emerald-100" aria-hidden />
          Included range
        </span>
      </div>
    </div>
  )
}
