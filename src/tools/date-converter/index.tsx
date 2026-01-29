// Date Converter tool - two-panel layout with date input/options and prioritized outputs
import { useDateConverter } from "./hooks/useDateConverter"
import { DateInputPanel } from "./components/DateInputPanel"
import { DateOutputPanel } from "./components/DateOutputPanel"

export const DateConverter = () => {
  const {
    state,
    result,
    customResult,
    error,
    success,
    isConverting,
    statsBar,
    setInput,
    setTimezone,
    setAutoDetect,
    setExplicitFormat,
    setCustomPattern,
    clearAll,
    useToday,
    convert,
    copyValue,
  } = useDateConverter()

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-6">
      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-6">
        {/* Left side: static input panel */}
        <div className="lg:w-1/2 flex-shrink-0">
          <DateInputPanel
            input={state.input}
            onChangeInput={setInput}
            timezone={state.timezone}
            onChangeTimezone={setTimezone}
            autoDetect={state.autoDetect}
            onChangeAutoDetect={setAutoDetect}
            explicitFormat={state.explicitFormat}
            onChangeExplicitFormat={setExplicitFormat}
            onConvert={convert}
            onUseToday={useToday}
            onClearAll={clearAll}
            error={error}
            isConverting={isConverting}
          />
        </div>

        {/* Right side: scrollable output while keeping overall height */}
        <div className="lg:w-1/2 flex-1 min-h-0">
          <div className="h-full">
            <DateOutputPanel
              result={result}
              onCopy={copyValue}
              success={success}
              statsBar={statsBar}
              customPattern={state.customPattern}
              onChangeCustomPattern={setCustomPattern}
              customResult={customResult}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

