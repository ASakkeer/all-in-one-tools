// Text Cleaner tool - cleans and normalizes user-provided text
import type React from "react"
import { useCallback, useState } from "react"
import { useTextCleaner } from "../hooks/useTextCleaner"
import type { CleanerOptionCategory, CleanerOptionKey } from "../types"

// Simple inline SVG icon components for compact action buttons
const IconSquashSpaces: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <rect x="3" y="5" width="14" height="2" rx="1" />
    <rect x="5" y="9" width="10" height="2" rx="1" />
    <rect x="7" y="13" width="6" height="2" rx="1" />
  </svg>
)

const IconRemoveLines: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <rect x="3" y="5" width="14" height="2" rx="1" />
    <rect x="3" y="9" width="10" height="2" rx="1" />
    <rect x="3" y="13" width="6" height="2" rx="1" />
    <line x1="4" y1="4" x2="16" y2="16" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const IconLowercase: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M5 14V6h2.5l2 3.5L11.5 6H14v8h-2v-4l-1.5 2.5h-1L8 10v4H6z" />
  </svg>
)

const IconUppercase: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M4 14 8 6h2l4 8h-2.1l-.7-1.6H6.8L6.1 14H4zm3.3-3.4h3.4L9 7.8 7.3 10.6z" />
  </svg>
)

const IconClear: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M5 7h10v9H5z" />
    <path d="M8 4h4l1 2H7z" />
  </svg>
)

const IconCopy: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <rect x="7" y="5" width="8" height="10" rx="1" />
    <rect x="5" y="3" width="8" height="10" rx="1" />
  </svg>
)

const IconReset: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M5 8V4l-2 2m2-2 2 2M5 10a5 5 0 1 0 2-3.874" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface OptionProps {
  category: CleanerOptionCategory
  optionKey: CleanerOptionKey
  label: string
  description?: string
  checked: boolean
  onToggle: (category: CleanerOptionCategory, key: CleanerOptionKey) => void
}

const OptionToggle: React.FC<OptionProps> = ({
  category,
  optionKey,
  label,
  description,
  checked,
  onToggle,
}) => {
  const handleChange = useCallback(() => {
    onToggle(category, optionKey)
  }, [category, optionKey, onToggle])

  const id = `${category}-${optionKey}`

  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2 cursor-pointer select-none"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="text-xs text-gray-700">
        <div className="font-medium">{label}</div>
        {description && (
          <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  )
}

export const TextCleaner: React.FC = () => {
  const {
    inputText,
    outputText,
    setInputText,
    options,
    toggleOption,
    resetAll,
  } = useTextCleaner()

  const [expandedGroups, setExpandedGroups] = useState<Record<CleanerOptionCategory, boolean>>({
    whitespace: true,
    case: true,
    duplicates: true,
    punctuation: true,
    advanced: false,
  })

  const toggleGroup = useCallback((group: CleanerOptionCategory) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }, [])

  const handleCopyOutput = useCallback(() => {
    if (!outputText) return
    void navigator.clipboard.writeText(outputText)
  }, [outputText])

  const handleClearAll = useCallback(() => {
    resetAll()
  }, [resetAll])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input pane */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[420px] lg:col-span-1">
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Input Text</h2>
        </header>
        <div className="flex-1">
          <textarea
            className="w-full h-full resize-none border-0 outline-none px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Paste or type text here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-500">
            Paste raw or messy text here. Cleaning runs automatically as you type.
          </p>
        </div>
      </section>

      {/* Options pane */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[420px] lg:col-span-1">
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Cleaning Options</h2>
        </header>
        <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
          {/* Whitespace group */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wide"
              onClick={() => toggleGroup("whitespace")}
              aria-expanded={expandedGroups.whitespace}
            >
              <span>Whitespace</span>
              <span className="text-gray-400">{expandedGroups.whitespace ? "−" : "+"}</span>
            </button>
            {expandedGroups.whitespace && (
              <div className="mt-2 space-y-1.5">
                <OptionToggle
                  category="whitespace"
                  optionKey="trimEdges"
                  label="Trim edges"
                  description="Remove leading and trailing spaces"
                  checked={options.whitespace.trimEdges}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="whitespace"
                  optionKey="collapseSpaces"
                  label="Collapse spaces and tabs"
                  description="Replace multiple spaces/tabs with a single space"
                  checked={options.whitespace.collapseSpaces}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="whitespace"
                  optionKey="removeEmptyLines"
                  label="Remove empty lines"
                  checked={options.whitespace.removeEmptyLines}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="whitespace"
                  optionKey="lineBreaksToSpaces"
                  label="Line breaks → spaces"
                  checked={options.whitespace.lineBreaksToSpaces}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="whitespace"
                  optionKey="consolidateBlankLines"
                  label="Consolidate blank lines"
                  description="Turn long runs of blank lines into a single blank line"
                  checked={options.whitespace.consolidateBlankLines}
                  onToggle={toggleOption}
                />
              </div>
            )}
          </div>

          {/* Case group */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wide"
              onClick={() => toggleGroup("case")}
              aria-expanded={expandedGroups.case}
            >
              <span>Case</span>
              <span className="text-gray-400">{expandedGroups.case ? "−" : "+"}</span>
            </button>
            {expandedGroups.case && (
              <div className="mt-2 space-y-1.5">
                <OptionToggle
                  category="case"
                  optionKey="lowercase"
                  label="lowercase"
                  checked={options.case.lowercase}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="case"
                  optionKey="uppercase"
                  label="UPPERCASE"
                  checked={options.case.uppercase}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="case"
                  optionKey="titleCase"
                  label="Title Case"
                  checked={options.case.titleCase}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="case"
                  optionKey="sentenceCase"
                  label="Sentence case"
                  checked={options.case.sentenceCase}
                  onToggle={toggleOption}
                />
              </div>
            )}
          </div>

          {/* Duplicates group */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wide"
              onClick={() => toggleGroup("duplicates")}
              aria-expanded={expandedGroups.duplicates}
            >
              <span>Duplicates</span>
              <span className="text-gray-400">{expandedGroups.duplicates ? "−" : "+"}</span>
            </button>
            {expandedGroups.duplicates && (
              <div className="mt-2 space-y-1.5">
                <OptionToggle
                  category="duplicates"
                  optionKey="removeDuplicateLines"
                  label="Remove duplicate lines"
                  checked={options.duplicates.removeDuplicateLines}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="duplicates"
                  optionKey="removeDuplicateWords"
                  label="Remove duplicate words"
                  checked={options.duplicates.removeDuplicateWords}
                  onToggle={toggleOption}
                />
              </div>
            )}
          </div>

          {/* Punctuation group */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wide"
              onClick={() => toggleGroup("punctuation")}
              aria-expanded={expandedGroups.punctuation}
            >
              <span>Punctuation</span>
              <span className="text-gray-400">{expandedGroups.punctuation ? "−" : "+"}</span>
            </button>
            {expandedGroups.punctuation && (
              <div className="mt-2 space-y-1.5">
                <OptionToggle
                  category="punctuation"
                  optionKey="normalizeSpacing"
                  label="Normalize spacing"
                  description="Fix spaces around punctuation marks"
                  checked={options.punctuation.normalizeSpacing}
                  onToggle={toggleOption}
                />
              </div>
            )}
          </div>

          {/* Advanced group */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 uppercase tracking-wide"
              onClick={() => toggleGroup("advanced")}
              aria-expanded={expandedGroups.advanced}
            >
              <span>Advanced</span>
              <span className="text-gray-400">{expandedGroups.advanced ? "−" : "+"}</span>
            </button>
            {expandedGroups.advanced && (
              <div className="mt-2 space-y-1.5">
                <OptionToggle
                  category="advanced"
                  optionKey="stripNonPrintable"
                  label="Strip non-printable characters"
                  checked={options.advanced.stripNonPrintable}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="advanced"
                  optionKey="normalizeQuotes"
                  label="Normalize quotes"
                  description="Smart quotes → straight quotes"
                  checked={options.advanced.normalizeQuotes}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="advanced"
                  optionKey="normalizeDashes"
                  label="Normalize dashes"
                  description="Em/en dashes → hyphen"
                  checked={options.advanced.normalizeDashes}
                  onToggle={toggleOption}
                />
                <OptionToggle
                  category="advanced"
                  optionKey="removeAccents"
                  label="Remove accents"
                  description="Convert characters with diacritics to ASCII"
                  checked={options.advanced.removeAccents}
                  onToggle={toggleOption}
                />
              </div>
            )}
          </div>

          {/* Phase 2 hooks: stubs only, not wired into pipeline */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Advanced tools (coming soon)
            </h3>
            <p className="text-[11px] text-gray-500">
              Planned: find &amp; replace, line sorting, and encoding transforms (Base64, URL
              encode/decode).
            </p>
          </div>
        </div>
      </section>

      {/* Output pane */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[420px] lg:col-span-1">
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Output Text</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={handleCopyOutput}
              aria-label="Copy cleaned text"
            >
              <IconCopy className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              onClick={handleClearAll}
              aria-label="Clear input and output"
            >
              <IconClear className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={resetAll}
              aria-label="Reset cleaning options and text"
            >
              <IconReset className="w-4 h-4" />
            </button>
          </div>
        </header>
        <div className="flex-1">
          <textarea
            className="w-full h-full resize-none border-0 outline-none px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white"
            placeholder="Your cleaned text will appear here..."
            value={outputText}
            readOnly
          />
        </div>
      </section>
    </div>
  )
}

