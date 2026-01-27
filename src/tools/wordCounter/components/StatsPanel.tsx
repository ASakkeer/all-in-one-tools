// Statistics panel showing counts for the Word Counter tool
import type { FC } from "react"
import type { TextStats } from "../utils/textStats"

interface StatsPanelProps {
  stats: TextStats
}

export const StatsPanel: FC<StatsPanelProps> = ({ stats }) => {
  const items: { label: string; value: number; helper?: string }[] = [
    { label: "Words", value: stats.wordCount },
    { label: "Characters (with spaces)", value: stats.charCountWithSpaces },
    {
      label: "Characters (without spaces)",
      value: stats.charCountWithoutSpaces,
    },
    { label: "Sentences", value: stats.sentenceCount },
    { label: "Lines", value: stats.lineCount },
    { label: "Paragraphs", value: stats.paragraphCount },
  ]

  const hasContent =
    stats.wordCount > 0 ||
    stats.charCountWithSpaces > 0 ||
    stats.charCountWithoutSpaces > 0 ||
    stats.sentenceCount > 0 ||
    stats.lineCount > 0 ||
    stats.paragraphCount > 0

  return (
    <section aria-label="Text statistics">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Text statistics
      </h2>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        {hasContent ? (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col">
                <dt className="text-xs font-medium text-gray-600">
                  {item.label}
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {item.value.toLocaleString()}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-gray-500">
            Start typing or paste text on the left to see live word, character,
            and sentence counts.
          </p>
        )}
      </div>
    </section>
  )
}

