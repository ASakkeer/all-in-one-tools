// Days Between Two Dates – two-panel layout: inputs left, results right
import { useDaysBetween } from "./hooks/useDaysBetween"
import { DaysBetweenInputPanel } from "./components/DaysBetweenInputPanel"
import { DaysBetweenOutputPanel } from "./components/DaysBetweenOutputPanel"

export const DaysBetween = () => {
  const {
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
  } = useDaysBetween()

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-6">
      <div className="flex-1">
        <section aria-labelledby="days-between-inputs-heading" className="min-h-0 flex flex-col  mb-[15px]">
          <h2 id="days-between-inputs-heading" className="sr-only">
            Date inputs
          </h2>
          <DaysBetweenInputPanel
            startInput={state.startInput}
            endInput={state.endInput}
            includeEndDate={state.includeEndDate}
            weekdaysOnly={state.weekdaysOnly}
            onStartChange={setStartInput}
            onEndChange={setEndInput}
            onIncludeEndDateChange={setIncludeEndDate}
            onWeekdaysOnlyChange={setWeekdaysOnly}
            onCalculate={calculate}
            onClearAll={clearAll}
            onUseTodayStart={useTodayStart}
            onUseTodayEnd={useTodayEnd}
            error={error}
          />
        </section>
        <section aria-labelledby="days-between-results-heading" className="min-h-0 flex flex-col">
          <h2 id="days-between-results-heading" className="sr-only">
            Days between two dates
          </h2>
          <div className="h-full min-h-0 flex flex-col">
            <DaysBetweenOutputPanel
              result={result}
              success={success}
              monthsToShow={monthsToShow}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
