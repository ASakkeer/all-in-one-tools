// Diff options controls - toggles for whitespace, case, and empty lines
import type { FC } from "react"
import type { DiffOptions } from "../utils/diff"

interface DiffOptionsProps {
  options: DiffOptions
  onToggleOption: (key: keyof DiffOptions) => void
  showUnchanged: boolean
  onToggleShowUnchanged: () => void
}

export const DiffOptions: FC<DiffOptionsProps> = ({
  options,
  onToggleOption,
  showUnchanged,
  onToggleShowUnchanged,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
      <span className="font-semibold text-gray-600 whitespace-nowrap">Options</span>
      <label className="inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300 text-[#088108] focus:ring-emerald-300"
          checked={options.ignoreWhitespace}
          onChange={() => onToggleOption("ignoreWhitespace")}
        />
        <span>Ignore whitespace</span>
      </label>
      <label className="inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300 text-[#088108] focus:ring-emerald-300"
          checked={options.ignoreCase}
          onChange={() => onToggleOption("ignoreCase")}
        />
        <span>Ignore case</span>
      </label>
      <label className="inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300 text-[#088108] focus:ring-emerald-300"
          checked={options.ignoreEmptyLines}
          onChange={() => onToggleOption("ignoreEmptyLines")}
        />
        <span>Ignore empty lines</span>
      </label>
      <label className="inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 rounded border-gray-300 text-[#088108] focus:ring-emerald-300"
          checked={showUnchanged}
          onChange={onToggleShowUnchanged}
        />
        <span>Show unchanged</span>
      </label>
    </div>
  )
}

