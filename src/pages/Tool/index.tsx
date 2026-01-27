// Tool page component - Displays individual tool pages
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"
import { JsonFormatter } from "@/tools/jsonFormatter"
import { WordCounter } from "@/tools/wordCounter"
import { DiffChecker } from "@/tools/diffChecker"

// JSON-LD Structured Data for SEO - SoftwareApplication schema
// This helps search engines understand the tool and its purpose
// Note: Using useEffect to inject script safely without dangerouslySetInnerHTML
const JsonLdSchema = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON Formatter",
      "url": "https://tools.sakkeer.com/tools/json-formatter",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Free online JSON formatter, validator, and transformer. Format, minify, validate, and transform JSON data securely in your browser. All processing happens locally - no data is sent to servers.",
      "featureList": [
        "Format JSON with proper indentation",
        "Minify JSON to compact format",
        "Validate JSON syntax",
        "Sort JSON keys",
        "Remove null and empty values",
        "Transform JSON data",
        "100% client-side processing",
        "No data transmission to servers"
      ],
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "ratingCount": "1"
      }
    }

    // Safely inject JSON-LD script without dangerouslySetInnerHTML
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(schema)
    script.id = "json-ld-schema"
    
    // Remove existing schema if present
    const existing = document.getElementById("json-ld-schema")
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)
    
    return () => {
      const scriptToRemove = document.getElementById("json-ld-schema")
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [])
  
  return null
}

const Tool = () => {
  const { toolId } = useParams<{ toolId: string }>()

  if (toolId === "json-formatter") {
    return (
      <>
        {/* JSON-LD Structured Data - Critical for SEO */}
        <JsonLdSchema />
        <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
            {/* Compact header */}
            <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="json-formatter-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    JSON Formatter
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    Format, validate, and transform JSON data securely in your browser. All processing
                    happens locally on your device.
                  </p>
                </div>
              </div>
            </header>

            {/* Compact privacy banner */}
            <section className="mb-4 rounded-md border border-gray-200 bg-blue-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server. Your JSON content never leaves your
                device.
              </p>
            </section>

            {/* Full-height workspace */}
            <section aria-label="JSON Formatter Tool" className="flex-1 overflow-hidden">
              <JsonFormatter />
            </section>
          </div>
        </main>
      </>
    )
  }

  if (toolId === "word-counter") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          {/* Compact header */}
          <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                aria-label="Go back to home"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ←
                </span>
                <span className="font-medium">Home</span>
              </Link>
              <div>
                <h1
                  id="word-counter-title"
                  className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                >
                  Word Counter
                </h1>
                <p className="text-xs text-gray-600 md:text-sm">
                  Count words, characters, sentences, and more in real time. Everything runs locally
                  in your browser.
                </p>
              </div>
            </div>
          </header>

          {/* Compact privacy banner */}
          <section className="mb-4 rounded-md border border-gray-200 bg-blue-50 px-3 py-2">
            <p className="text-xs text-gray-700 md:text-sm">
              <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> Your text is
              processed entirely in your browser. No content is uploaded or stored on any server.
            </p>
          </section>

          {/* Full-height workspace */}
          <section aria-label="Word Counter Tool" className="flex-1 overflow-hidden">
            <WordCounter />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "diff-checker") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          {/* Compact header */}
          <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                aria-label="Go back to home"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ←
                </span>
                <span className="font-medium">Home</span>
              </Link>
              <div>
                <h1
                  id="diff-checker-title"
                  className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                >
                  Diff Checker
                </h1>
                <p className="text-xs text-gray-600 md:text-sm">
                  Compare two pieces of text side by side or inline with clear, readable
                  highlights.
                </p>
              </div>
            </div>
          </header>

          {/* Compact privacy banner */}
          <section className="mb-4 rounded-md border border-gray-200 bg-blue-50 px-3 py-2">
            <p className="text-xs text-gray-700 md:text-sm">
              <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All
              comparisons happen locally in your browser. No text is uploaded or stored on any
              server.
            </p>
          </section>

          {/* Full-height workspace */}
          <section aria-label="Diff Checker Tool" className="flex-1 overflow-hidden">
            <DiffChecker />
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tool Not Found</h1>
          <p className="text-gray-600">The requested tool could not be found.</p>
        </div>
      </div>
    </main>
  )
}

export default Tool
