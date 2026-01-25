// Main entry point
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import "./index.css"
import loader from "@monaco-editor/loader"
import * as monaco from "monaco-editor"

// Configure Monaco Editor to use local files instead of CDN
// This prevents CSP violations and ensures all assets are bundled
loader.config({ monaco })

// Configure Monaco Editor workers to use local files
// This is required for Monaco Editor to work with CSP
if (typeof window !== "undefined") {
  (window as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: string, label: string) {
      if (label === "json") {
        return new URL("monaco-editor/esm/vs/language/json/json.worker", import.meta.url).href
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new URL("monaco-editor/esm/vs/language/css/css.worker", import.meta.url).href
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new URL("monaco-editor/esm/vs/language/html/html.worker", import.meta.url).href
      }
      if (label === "typescript" || label === "javascript") {
        return new URL("monaco-editor/esm/vs/language/typescript/ts.worker", import.meta.url).href
      }
      return new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url).href
    },
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
