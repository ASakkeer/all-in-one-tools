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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <TimestampOutputPanel result={result} onCopy={copyValue} success={success} statsBar={statsBar} />
      </div>
    </div>
  )
}

