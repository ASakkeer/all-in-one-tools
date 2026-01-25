// JSON Input component
interface JsonInputProps {
  value: string
  onChange: (value: string) => void
}

export const JsonInput = ({ value, onChange }: JsonInputProps) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste your JSON here..."
      className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  )
}
