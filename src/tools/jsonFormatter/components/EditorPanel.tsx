// Editor Panel component - Large editor with integrated toolbar
// Error handling: errors appear inline below editor, never replace the editor
import { ReactNode } from "react"

interface EditorPanelProps {
  title: string
  toolbarButtons?: Array<{
    label: string
    onClick: () => void
    disabled?: boolean
    active?: boolean
  }>
  actionIcons?: ReactNode
  children: React.ReactNode
  error?: string | null
  errorLine?: number | null
  errorColumn?: number | null
}

export const EditorPanel = ({ title, toolbarButtons, actionIcons, children, error, errorLine, errorColumn }: EditorPanelProps) => {
  // Format error message with line/column if available
  const getErrorMessage = () => {
    if (!error) return null
    
    if (errorLine !== null && errorLine !== undefined && errorColumn !== null && errorColumn !== undefined) {
      return `Invalid JSON at line ${errorLine}, column ${errorColumn}`
    }
    
    return error
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header with toolbar and action icons */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {/* Action icons (right-aligned) */}
          {actionIcons && (
            <div className="flex items-center gap-1">
              {actionIcons}
            </div>
          )}
          {/* Toolbar buttons (if any) */}
          {toolbarButtons && toolbarButtons.length > 0 && (
            <div className="flex items-center gap-1">
              {toolbarButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1 ${
                    button.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor content - ALWAYS visible and editable */}
      <div className="flex-1 overflow-hidden min-h-0">
        {children}
      </div>

      {/* Error message - inline below editor, never replaces it */}
      {error && (
        <div className="px-4 py-2.5 bg-red-50/80 border-t border-red-200">
          <p className="text-red-700 text-sm font-medium">{getErrorMessage()}</p>
        </div>
      )}
    </div>
  )
}
