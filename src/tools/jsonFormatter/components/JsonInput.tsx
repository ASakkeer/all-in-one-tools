// JSON Input component - Monaco Editor with line numbers and error highlighting
import Editor from "@monaco-editor/react"
import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"

interface JsonInputProps {
  value: string
  onChange: (value: string) => void
  errorLine?: number | null
  errorColumn?: number | null
}

export const JsonInput = ({ value, onChange, errorLine, errorColumn }: JsonInputProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof monaco
  ) => {
    editorRef.current = editor
    monacoRef.current = monacoInstance

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 0,
    })

    // Set JSON language
    monacoInstance.editor.setModelLanguage(editor.getModel()!, "json")
  }

  // Update error markers when error line/column changes
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const editor = editorRef.current
    const monacoInstance = monacoRef.current

    // Clear existing markers
    monacoInstance.editor.setModelMarkers(editor.getModel()!, "json-validator", [])

    // Add error marker if error exists
    if (errorLine !== null && errorLine !== undefined && errorColumn !== null && errorColumn !== undefined) {
      const model = editor.getModel()
      if (model) {
        const lineCount = model.getLineCount()
        if (errorLine > 0 && errorLine <= lineCount) {
          const lineContent = model.getLineContent(errorLine)
          const endColumn = errorColumn < lineContent.length ? errorColumn + 1 : lineContent.length + 1
          
          monacoInstance.editor.setModelMarkers(model, "json-validator", [
            {
              startLineNumber: errorLine,
              startColumn: errorColumn,
              endLineNumber: errorLine,
              endColumn: endColumn,
              message: "Invalid JSON",
              severity: monacoInstance.MarkerSeverity.Error,
            },
          ])

          // Scroll to error line
          editor.revealLineInCenter(errorLine)
        }
      }
    }
  }, [errorLine, errorColumn])

  return (
    <Editor
      height="100%"
      language="json"
      value={value}
      onChange={(val) => onChange(val || "")}
      onMount={handleEditorDidMount}
      options={{
        readOnly: false,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        lineNumbersMinChars: 3,
        glyphMargin: false,
        folding: true,
        wordWrap: "on",
        theme: "vs",
        padding: { top: 16, bottom: 16 },
      }}
      theme="vs"
    />
  )
}
