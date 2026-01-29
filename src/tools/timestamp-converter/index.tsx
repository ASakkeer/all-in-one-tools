// Timestamp Converter tool - two-panel layout with input/options and prioritized outputs
import { useTimestampConverter } from "./hooks/useTimestampConverter"
import { TimestampInputPanel } from "./components/TimestampInputPanel"
import { TimestampOutputPanel } from "./components/TimestampOutputPanel"

export const TimestampConverter = () => {
  const {
    inputRef,
    state,
    result,
    error,
    success,
    isConverting,
    statsBar,
    setInput,
    setUnit,
    setTimezone,
    setAutoDetect,
    clearAll,
    useCurrentTime,
    convert,
    copyValue,
  } = useTimestampConverter()

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden pb-6">
      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-6">
        {/* Left side: static input panel */}
        <div className="lg:w-1/2 flex-shrink-0">
          <TimestampInputPanel
            input={state.input}
            onChangeInput={setInput}
            unit={state.unit}
            onChangeUnit={setUnit}
            timezone={state.timezone}
            onChangeTimezone={setTimezone}
            autoDetect={state.autoDetect}
            onChangeAutoDetect={setAutoDetect}
            onConvert={convert}
            onUseCurrentTime={useCurrentTime}
            onClearAll={clearAll}
            error={error}
            isConverting={isConverting}
            inputRef={inputRef}
          />
        </div>

        {/* Right side: scrollable output */}
        <div className="lg:w-1/2 flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            <TimestampOutputPanel result={result} onCopy={copyValue} success={success} statsBar={statsBar} />
          </div>
        </div>
      </div>
    </div>
  )
}

