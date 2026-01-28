// Diff view component - renders side-by-side or inline diff with directional apply actions
import { type FC, useEffect, useRef } from "react"
import type { DiffBlock } from "../utils/diff"
import type { DiffViewMode } from "../hooks/useDiffChecker"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DiffViewProps {
  blocks: DiffBlock[]
  viewMode: DiffViewMode
  activeDiffIndex: number | null
  onApplyLeftToRight: (index: number) => void
  onApplyRightToLeft: (index: number) => void
  showUnchanged: boolean
}

const blockBgClass = (type: DiffBlock["type"]) => {
  if (type === "add") return "bg-green-50"
  if (type === "remove") return "bg-red-50"
  if (type === "modify") return "bg-yellow-50"
  return ""
}

const blockBorderClass = (type: DiffBlock["type"]) => {
  if (type === "add") return "border-l-4 border-green-400"
  if (type === "remove") return "border-l-4 border-red-400"
  if (type === "modify") return "border-l-4 border-amber-300"
  return "border-l border-transparent"
}

export const DiffView: FC<DiffViewProps> = ({
  blocks,
  viewMode,
  activeDiffIndex,
  onApplyLeftToRight,
  onApplyRightToLeft,
  showUnchanged,
}) => {
  const rowRefs = useRef<(HTMLLIElement | HTMLTableRowElement | null)[]>([])

  useEffect(() => {
    if (activeDiffIndex === null) return
    const target = rowRefs.current[activeDiffIndex]
    if (target) {
      target.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [activeDiffIndex])

  const visibleBlocks = showUnchanged
    ? blocks
    : blocks.filter((block) => block.type !== "unchanged")

  const formatLineRange = (start: number | null, count: number): string => {
    if (start === null) return ""
    if (count <= 1) return String(start + 1)
    const end = start + count - 1
    return `${start + 1}–${end + 1}`
  }

  if (viewMode === "inline") {
    return (
      <div className="h-full w-full overflow-auto rounded-md border border-gray-200 bg-gray-50 text-xs">
        <ul className="divide-y divide-gray-100">
          {visibleBlocks.map((block, index) => {
            const isActive = index === activeDiffIndex
            const baseClasses =
              "flex items-stretch gap-2 px-3 py-1.5 font-mono text-[11px] leading-5"
            const highlightClass = isActive ? "ring-1 ring-blue-300" : ""

            return (
              <li
                key={index}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                className={`${baseClasses} ${blockBgClass(block.type)} ${highlightClass}`}
              >
                <div className="flex w-full items-start gap-2">
                  <div className="flex w-16 shrink-0 flex-col text-[10px] text-gray-400">
                    <span className="text-right">
                      {formatLineRange(block.leftStartLine, block.leftLines.length)}
                    </span>
                    <span className="text-right">
                      {formatLineRange(block.rightStartLine, block.rightLines.length)}
                    </span>
                  </div>
                  <div
                    className={`flex-1 whitespace-pre-wrap rounded-sm px-2 ${blockBorderClass(block.type)}`}
                  >
                    {block.rightLines.length
                      ? block.rightLines.join("\n")
                      : block.leftLines.join("\n")}
                  </div>
                  {block.type !== "unchanged" && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onApplyLeftToRight(index)}
                        className="inline-flex items-center justify-center rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1"
                        aria-label="Apply change from left to right"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApplyRightToLeft(index)}
                        className="inline-flex items-center justify-center rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1"
                        aria-label="Apply change from right to left"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  // Side-by-side view
  return (
    <div className="h-full w-full overflow-auto rounded-md border border-gray-200 bg-gray-50 text-xs">
      <table className="min-w-full border-collapse text-[11px]">
        <thead className="bg-gray-100 text-[10px] uppercase tracking-wide text-gray-500">
          <tr>
            <th className="w-12 px-2 py-1 text-right font-medium"># L</th>
            <th className="w-1/2 px-2 py-1 text-left font-medium">Original</th>
            <th className="w-12 px-2 py-1 text-center font-medium">Actions</th>
            <th className="w-12 px-2 py-1 text-right font-medium"># R</th>
            <th className="w-1/2 px-2 py-1 text-left font-medium">Modified</th>
          </tr>
        </thead>
        <tbody>
          {visibleBlocks.map((block, index) => {
            const isActive = index === activeDiffIndex
            const highlightClass = isActive ? "ring-1 ring-blue-300" : ""

            return (
              <tr
                key={index}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                className={blockBgClass(block.type)}
              >
                <td className="border-b border-gray-100 px-2 py-1 text-right text-[10px] text-gray-400 align-top">
                  {formatLineRange(block.leftStartLine, block.leftLines.length)}
                </td>
                <td
                  className={`border-b border-gray-100 px-2 py-1 align-top font-mono leading-5 ${highlightClass}`}
                >
                  <div
                    className={`whitespace-pre-wrap rounded-sm px-2 ${blockBorderClass(block.type)}`}
                  >
                    {block.leftLines.join("\n")}
                  </div>
                </td>
                <td className="border-b border-gray-100 px-2 py-1 text-center align-top">
                  {block.type !== "unchanged" && (
                    <div className="inline-flex flex-col items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onApplyLeftToRight(index)}
                        className="inline-flex items-center justify-center rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1"
                        aria-label="Apply change from left to right"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApplyRightToLeft(index)}
                        className="inline-flex items-center justify-center rounded border border-gray-200 bg-white p-1 text-gray-500 shadow-sm transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1"
                        aria-label="Apply change from right to left"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="border-b border-gray-100 px-2 py-1 text-right text-[10px] text-gray-400 align-top">
                  {formatLineRange(block.rightStartLine, block.rightLines.length)}
                </td>
                <td
                  className={`border-b border-gray-100 px-2 py-1 align-top font-mono leading-5 ${highlightClass}`}
                >
                  <div
                    className={`whitespace-pre-wrap rounded-sm px-2 ${blockBorderClass(block.type)}`}
                  >
                    {block.rightLines.join("\n")}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

