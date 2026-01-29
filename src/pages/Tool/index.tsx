// Tool page component - Displays individual tool pages
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"
import { JsonFormatter } from "@/tools/jsonFormatter"
import { WordCounter } from "@/tools/wordCounter"
import { DiffChecker } from "@/tools/diffChecker"
import { CsvToJson } from "@/tools/csvToJson"
import { JsonToCsv } from "@/tools/jsonToCsv"
import { TimestampConverter } from "@/tools/timestamp-converter"
import { DateConverter } from "@/tools/date-converter"
import { DaysBetween } from "@/tools/days-between"

// Tool SEO helper - updates title + meta description for tool pages
const setToolSeo = (title: string, description: string) => {
  document.title = title
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute("content", description)
  }
}

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

  useEffect(() => {
    if (toolId === "csv-to-json") {
      setToolSeo(
        "CSV to JSON Converter – Free Online Tool",
        "Convert CSV to JSON securely in your browser. No upload, no tracking, privacy-first client-side CSV parsing with copy and download options."
      )
      return
    }

    if (toolId === "date-converter") {
      setToolSeo(
        "Date Converter – Format, Regional & ISO Dates – Free Online Tool",
        "Browser-based date converter that runs securely in your browser. No upload, no tracking. Convert dates between ISO, local, regional, and technical formats."
      )
      return
    }

    if (toolId === "days-between") {
      setToolSeo(
        "Days Between Two Dates – Free Days Calculator",
        "Browser-based days calculator. Secure, no upload. Calculate days between two dates with weekdays, calendar view, and alternative units. All processing in your browser."
      )
      return
    }

    if (toolId === "timestamp-converter") {
      setToolSeo(
        "Timestamp Converter – Unix, UTC, ISO – Free Online Tool",
        "Browser-based timestamp converter that runs securely in your browser. No upload, no tracking. Convert between Unix, UTC, ISO 8601, and readable date/time formats."
      )
      return
    }

    if (toolId === "json-to-csv") {
      setToolSeo(
        "JSON to CSV Converter – Free Online Tool",
        "Convert JSON to CSV securely in your browser. No upload, no tracking, privacy-first client-side conversion with copy and download options."
      )
      return
    }

    if (toolId === "json-formatter") {
      setToolSeo(
        "JSON Formatter – Free Online Tool",
        "Free online JSON formatter and validator that runs entirely in your browser. No upload, no tracking, privacy-first client-side processing."
      )
      return
    }

    if (toolId === "word-counter") {
      setToolSeo(
        "Word Counter – Free Online Tool",
        "Count words, characters, sentences, and more in your browser. No upload, no tracking, privacy-first client-side processing."
      )
      return
    }

    if (toolId === "diff-checker") {
      setToolSeo(
        "Diff Checker – Free Online Tool",
        "Compare two texts locally in your browser with side-by-side and inline diff. No upload, no tracking, privacy-first client-side processing."
      )
      return
    }

    setToolSeo(
      "Simple Web Tools - Free Online Tools for Developers",
      "Free online tools that run entirely in your browser. No login required. No data sent to servers. Simple, fast, and secure web tools for developers and professionals."
    )
  }, [toolId])

  if (toolId === "json-formatter") {
    return (
      <>
        {/* JSON-LD Structured Data - Critical for SEO */}
        <JsonLdSchema />
        <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
            {/* Sticky header + privacy banner */}
            <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
              {/* Compact header */}
              <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
              <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
                <p className="text-xs text-gray-700 md:text-sm">
                  <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                  locally in your browser. No data is sent to any server. Your JSON content never leaves your
                  device.
                </p>
              </section>
            </div>

            {/* Full-height workspace */}
            <section aria-label="JSON Formatter Tool" className="flex-1 overflow-hidden pt-4">
              <JsonFormatter />
            </section>
          </div>
        </main>
      </>
    )
  }

  if (toolId === "csv-to-json") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="csv-to-json-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    CSV to JSON Converter
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <strong className="text-gray-900">
                      Privacy First – All processing happens in your browser.
                    </strong>{" "}
                    Convert CSV into pretty JSON with copy, download, and table preview.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server.
              </p>
            </section>
          </div>

          <section aria-label="CSV to JSON Converter Tool" className="flex-1 overflow-hidden pt-4">
            <CsvToJson />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "json-to-csv") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="json-to-csv-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    JSON to CSV Converter
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <strong className="text-gray-900">
                      Privacy First – All processing happens in your browser.
                    </strong>{" "}
                    Convert JSON into CSV with copy, download, and table preview.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server.
              </p>
            </section>
          </div>

          <section aria-label="JSON to CSV Converter Tool" className="flex-1 overflow-hidden pt-4">
            <JsonToCsv />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "timestamp-converter") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="timestamp-converter-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    Timestamp Converter
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <strong className="text-gray-900">
                      Privacy First – All processing happens in your browser.
                    </strong>{" "}
                    Convert between Unix, UTC, ISO 8601, and human-readable dates.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server.
              </p>
            </section>
          </div>

          <section aria-label="Timestamp Converter Tool" className="flex-1 overflow-hidden pt-4">
            <TimestampConverter />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "date-converter") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors	duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="date-converter-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    Date Converter
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <strong className="text-gray-900">
                      Privacy First – All processing happens in your browser.
                    </strong>{" "}
                    Convert dates between ISO, regional, technical, and metadata views.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server.
              </p>
            </section>
          </div>

          <section aria-label="Date Converter Tool" className="flex-1 overflow-hidden pt-4">
            <DateConverter />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "days-between") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                  aria-label="Go back to home"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ←
                  </span>
                  <span className="font-medium">Home</span>
                </Link>
                <div>
                  <h1
                    id="days-between-title"
                    className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
                  >
                    Days Between Two Dates
                  </h1>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <strong className="text-gray-900">
                      Privacy First – All processing happens in your browser.
                    </strong>{" "}
                    Calculate days between two dates with weekdays, calendar view, and alternative units.
                  </p>
                </div>
              </div>
            </header>

            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All processing happens
                locally in your browser. No data is sent to any server.
              </p>
            </section>
          </div>

          <section aria-label="Days Between Two Dates Tool" className="flex-1 overflow-hidden pt-4">
            <DaysBetween />
          </section>
        </div>
      </main>
    )
  }

  if (toolId === "word-counter") {
    return (
      <main className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
          {/* Sticky header + privacy banner */}
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            {/* Compact header */}
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> Your text is
                processed entirely in your browser. No content is uploaded or stored on any server.
              </p>
            </section>
          </div>

          {/* Full-height workspace */}
          <section aria-label="Word Counter Tool" className="flex-1 overflow-hidden pt-4">
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
          {/* Sticky header + privacy banner */}
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-gray-200 bg-gray-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 pt-2 pb-3">
            {/* Compact header */}
            <header className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
            <section className="rounded-md border border-gray-200 bg-emerald-50 px-3 py-2">
              <p className="text-xs text-gray-700 md:text-sm">
                <strong className="text-gray-900">🔒 Privacy &amp; Security:</strong> All
                comparisons happen locally in your browser. No text is uploaded or stored on any
                server.
              </p>
            </section>
          </div>

          {/* Full-height workspace */}
          <section aria-label="Diff Checker Tool" className="flex-1 overflow-hidden pt-4">
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
