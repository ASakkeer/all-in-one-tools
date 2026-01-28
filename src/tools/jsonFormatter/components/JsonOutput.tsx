// JSON Output component - Read-only Monaco Editor with syntax highlighting
import Editor from "@monaco-editor/react"
import { useRef, useEffect } from "react"
import * as monaco from "monaco-editor"

interface JsonOutputProps {
  output: string
  outputRef: React.RefObject<HTMLDivElement | null>
}

export const JsonOutput = ({ output, outputRef }: JsonOutputProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorRef.current = editor

    // Configure editor
    editor.updateOptions({
      readOnly: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 0,
    })

    // Set JSON language for syntax highlighting
    monacoInstance.editor.setModelLanguage(editor.getModel()!, "json")

    // Store container ref for scrolling
    if (containerRef.current && outputRef) {
      ;(outputRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current
    }
  }

  // Update ref when editor is ready
  useEffect(() => {
    if (containerRef.current && outputRef) {
      ;(outputRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current
    }
  }, [outputRef])

  if (!output) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-400 text-sm">Formatted JSON will appear here...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full">
      <Editor
        height="100%"
        language="json"
        value={output}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
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
    </div>
  )
}
