// Tool page component - Displays individual tool pages
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { JsonFormatter } from "@/tools/jsonFormatter"

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
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section - Semantic HTML for SEO */}
            <header className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                JSON Formatter
              </h1>
              <p className="text-gray-600 text-lg">
                Format, validate, and transform JSON data securely in your browser
              </p>
            </header>
            
            {/* Trust Signal - Security and Privacy Notice */}
            <section className="mb-6 bg-blue-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">🔒 Privacy & Security:</strong> All processing happens locally in your browser. 
                No data is sent to any server. Your JSON content never leaves your device.
              </p>
            </section>

            {/* Tool Container */}
            <section aria-label="JSON Formatter Tool">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <JsonFormatter />
              </div>
            </section>
          </div>
        </main>
      </>
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
