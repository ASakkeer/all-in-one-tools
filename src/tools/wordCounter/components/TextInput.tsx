// Text input textarea for the Word Counter tool
import type { FC } from "react"

interface TextInputProps {
  value: string
  onChange: (value: string) => void
}

export const TextInput: FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label
        htmlFor="word-counter-input"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Text input
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50">
        <textarea
          id="word-counter-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block h-72 w-full resize-none rounded-lg border-0 bg-transparent p-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Paste or type your text here to see word, character, and sentence counts in real time..."
        />
      </div>
    </div>
  )
}

