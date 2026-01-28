// Diff summary bar - read-only counts for additions, deletions, and modifications
import type { FC } from "react"
import type { DiffSummary } from "../hooks/useDiffChecker"

interface DiffSummaryProps {
  summary: DiffSummary
}

export const DiffSummaryBar: FC<DiffSummaryProps> = ({ summary }) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-700">
      <span className="font-semibold text-gray-600 whitespace-nowrap">Summary</span>
      <span className="whitespace-nowrap rounded border border-green-100 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
        +{summary.additions} additions
      </span>
      <span className="whitespace-nowrap rounded border border-red-100 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
        −{summary.deletions} deletions
      </span>
      <span className="whitespace-nowrap rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        {summary.modifications} modifications
      </span>
    </div>
  )
}

