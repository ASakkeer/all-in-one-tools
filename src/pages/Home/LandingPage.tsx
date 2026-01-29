// Landing page for Simple Web Tools - hero, search, tools discovery, trust, how-it-works, feedback, support, and footer
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { useNavigate } from "react-router-dom"
import heroBackground from "@/assets/images/home-bg.jpg"
import coffeeCup from "@/assets/images/coffee-cup.png"
import bmcQr from "@/assets/images/bmc_qr.png"
import logoBlack from "@/assets/images/logo-black.png"
import logoWhite from "@/assets/images/logo-white.png"
import { sendEmail } from "@/utils/sendEmail"

type ToolStatus = "active" | "coming-soon"

type ToolDefinition = {
  id: string
  name: string
  description: string
  status: ToolStatus
  tags: string[]
  category: string
}

type ToolCategory = {
  id: string
  name: string
  tools: ToolDefinition[]
}

const TOOL_STORAGE_KEYS: Record<string, string[]> = {
  "json-formatter": ["json-formatter-input"],
}

type SectionFadeProps = {
  children: ReactNode
  className?: string
}

const SectionFade: React.FC<SectionFadeProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        "transform-gpu transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  )
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "data-json",
    name: "Data & JSON",
    tools: [
      {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "Format, validate, and explore JSON payloads.",
        status: "active",
        tags: ["json", "format", "validate", "pretty-print"],
        category: "Data & JSON",
      },
      {
        id: "csv-to-json",
        name: "CSV to JSON",
        description: "Convert CSV into clean, pretty JSON (runs locally).",
        status: "active",
        tags: ["csv", "json", "convert", "privacy-first"],
        category: "Data & JSON",
      },
      {
        id: "json-to-csv",
        name: "JSON to CSV",
        description: "Convert JSON into clean CSV tables (runs locally).",
        status: "active",
        tags: ["json", "csv", "convert", "privacy-first"],
        category: "Data & JSON",
      },
    ],
  },
  {
    id: "text-utilities",
    name: "Text Utilities",
    tools: [
      {
        id: "diff-checker",
        name: "Diff Checker",
        description: "Compare two snippets and focus on the differences.",
        status: "active",
        tags: ["diff", "compare", "text"],
        category: "Text Utilities",
      },
      {
        id: "word-counter",
        name: "Word Counter",
        description: "Word, character, and paragraph counts at a glance.",
        status: "active",
        tags: ["words", "characters", "statistics"],
        category: "Text Utilities",
      },
      {
        id: "advanced-password-generator",
        name: "Advanced Password Generator",
        description: "Generate strong, copy-pasteable passwords.",
        status: "coming-soon",
        tags: ["password", "security", "random"],
        category: "Text Utilities",
      },
    ],
  },
  {
    id: "encoding-security",
    name: "Encoding & Security",
    tools: [
      {
        id: "jwt-encoder-decoder",
        name: "JWT Encoder / Decoder",
        description: "Inspect JWT payloads locally and safely.",
        status: "coming-soon",
        tags: ["jwt", "token", "decode", "encode"],
        category: "Encoding & Security",
      },
      {
        id: "base64-image-viewer",
        name: "Base64 → Image Viewer",
        description: "Preview images directly from Base64 strings.",
        status: "coming-soon",
        tags: ["base64", "image", "decode"],
        category: "Encoding & Security",
      },
      {
        id: "image-base64-converter",
        name: "Image → Base64 Converter",
        description: "Turn images into Base64 data URIs.",
        status: "coming-soon",
        tags: ["image", "base64", "encode"],
        category: "Encoding & Security",
      },
    ],
  },
  {
    id: "media-images",
    name: "Media & Images",
    tools: [
      {
        id: "image-compressor",
        name: "Image Compressor",
        description: "Compress images without leaving the browser.",
        status: "coming-soon",
        tags: ["image", "compress", "optimize"],
        category: "Media & Images",
      },
    ],
  },
  {
    id: "date-time",
    name: "Date & Time",
    tools: [
      {
        id: "date-converter",
        name: "Date Converter",
        description: "Convert dates across ISO, regional, and technical formats (runs locally).",
        status: "active",
        tags: ["date", "format", "regional", "iso"],
        category: "Date & Time",
      },
      {
        id: "days-between",
        name: "Days Between Two Dates",
        description: "Calculate the number of days between two dates, including weekdays, alternative units, and calendar visualization.",
        status: "active",
        tags: ["days", "calculator", "date", "calendar", "weekdays"],
        category: "Date & Time",
      },
      {
        id: "timestamp-converter",
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps and readable dates (runs locally).",
        status: "active",
        tags: ["timestamp", "unix", "date", "utc"],
        category: "Date & Time",
      },
    ],
  },
]

type HeroSectionProps = {
  onBrowseTools: () => void
  onLearnHowItWorks: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBrowseTools, onLearnHowItWorks }) => {
  const [mounted, setMounted] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 40)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollOffset(Math.min(y, 240))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      className="relative min-h-screen text-slate-50 overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: `center ${50 + scrollOffset * 0.05}%`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" aria-hidden="true" />

      <div
        className="pointer-events-none absolute -left-24 top-24 h-40 w-40 rounded-full bg-slate-200/10 blur-3xl animate-slow-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-16 h-56 w-56 rounded-full bg-sky-200/10 blur-3xl animate-slow-float"
        aria-hidden="true"
      />

      {/* Top navigation with logo */}
      <div className="relative z-20">
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <img
              src={logoWhite}
              alt="Simple Web Tools logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-md"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="w-full px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* <p
              className={`text-sm font-semibold uppercase tracking-[0.16em] text-slate-200/80 mb-4 transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              Simple Web Tools
            </p> */}
            <h1
              className={`text-6xl sm:text-6xl lg:text-7xl font-bold text-slate-50 mb-6 leading-tight transition-all duration-700 ease-out delay-75 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Simple Web Tools
            </h1>
            <p
              className={`text-xl sm:text-2xl text-slate-100/90 max-w-xl mx-auto mb-3 transition-all duration-700 ease-out delay-150 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Fast, private, browser-based tools for developers and everyday tasks.
            </p>
            <p
              className={`text-lg sm:text-xl text-slate-200/90 max-w-lg mx-auto mb-8 transition-all duration-700 ease-out delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              No login. No ads. Everything runs locally in your browser.
            </p>

            <div
              className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 transition-all duration-700 ease-out delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <button
                type="button"
                onClick={onBrowseTools}
                className="inline-flex items-center justify-center rounded-xl bg-[#088108] px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 transform transition-all duration-300 hover:scale-105"
              >
                Browse tools
              </button>
              <button
                type="button"
                onClick={onLearnHowItWorks}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white/5 px-6 py-3 text-sm font-medium text-slate-50 shadow-sm backdrop-blur-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 transform transition-all duration-300 hover:scale-105"
              >
                Learn how it works
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type ToolsSearchProps = {
  value: string
  onChange: (value: string) => void
}

const ToolsSearch: React.FC<ToolsSearchProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <SectionFade className="max-w-4xl mx-auto">
      <div
        className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-md cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <svg
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.25 4.5C6.90279 4.5 5 6.40279 5 8.75C5 11.0972 6.90279 13 9.25 13C10.243 13 11.1527 12.6756 11.8721 12.1279L14.1228 14.3786C14.3179 14.5737 14.6345 14.5737 14.8296 14.3786C15.0247 14.1835 15.0247 13.8669 14.8296 13.6718L12.5789 11.4211C13.1266 10.7017 13.451 9.792 13.451 8.79904C13.451 6.45182 11.5472 4.5 9.25 4.5ZM6.25 8.75C6.25 7.09497 7.59497 5.75 9.25 5.75C10.905 5.75 12.25 7.09497 12.25 8.75C12.25 10.405 10.905 11.75 9.25 11.75C7.59497 11.75 6.25 10.405 6.25 8.75Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <input
            id="tools-search"
            type="text"
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search tools by name, keyword, or format…"
            className="block w-full rounded-full border border-slate-200 bg-slate-50/90 pl-14 pr-16 py-3.5 text-lg text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onChange("")
                inputRef.current?.focus()
              }}
              className="absolute inset-y-0 right-3 flex items-center px-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </SectionFade>
  )
}

type ToolsListProps = {
  searchTerm: string
}

const ToolsList: React.FC<ToolsListProps> = ({ searchTerm }) => {
  const navigate = useNavigate()
  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) {
      return TOOL_CATEGORIES
    }

    return TOOL_CATEGORIES.map((category) => {
      const tools = category.tools.filter((tool) => {
        const haystack = [
          tool.name,
          tool.description,
          tool.category,
          ...tool.tags,
        ]
          .join(" ")
          .toLowerCase()

        return haystack.includes(normalizedSearch)
      })
      return { ...category, tools }
    }).filter((category) => category.tools.length > 0)
  }, [normalizedSearch])

  const handleToolClick = (tool: ToolDefinition) => {
    if (tool.status !== "active") return

    if (typeof window !== "undefined") {
      const keys = TOOL_STORAGE_KEYS[tool.id] ?? []
      keys.forEach((key) => {
        window.localStorage.removeItem(key)
      })
    }

    navigate(`/tools/${tool.id}`)
  }

  return (
    <SectionFade className="max-w-5xl mx-auto space-y-10">
      {filteredCategories.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500">
          No tools found for this search yet. Try a different keyword or check back soon.
        </div>
      )}

      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-slate-50 shadow-sm">
                <span className="text-xs font-semibold">
                  {category.id === "data-json" && "{}"}
                  {category.id === "text-utilities" && "Aa"}
                  {category.id === "encoding-security" && "◎"}
                  {category.id === "media-images" && "▣"}
                  {category.id === "date-time" && "⏱"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">{category.name}</h2>
            </div>
            <p className="text-xs text-slate-500">
              {category.tools.length} {category.tools.length === 1 ? "tool" : "tools"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.tools.map((tool) => {
              const isActive = tool.status === "active"
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  disabled={!isActive}
                  className={[
                    "group relative flex h-full flex-col rounded-2xl border bg-white px-4 py-4 text-left shadow-sm transition-transform transition-shadow duration-200 ease-out focus-visible:outline-none",
                    isActive
                      ? "cursor-pointer border-slate-200 border-b-[3px] border-b-emerald-500 hover:-translate-y-1 hover:shadow-md"
                      : "cursor-not-allowed border-slate-200/80 border-b-[3px] border-b-slate-300 opacity-70",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between w-full gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                        <p className="mt-1 text-xs text-slate-600">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="my-2 h-px w-full bg-slate-200" />
                  <div className="mt-auto flex w-full items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </SectionFade>
  )
}

const TrustSection: React.FC = () => {
  return (
    <SectionFade className="max-w-5xl mx-auto pt-16 sm:pt-20">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/80 px-5 py-6 sm:px-6 sm:py-8 shadow-sm">
        <div
          className="pointer-events-none absolute -left-14 -top-10 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 -bottom-10 h-44 w-44 rounded-full bg-slate-300/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="h-full rounded-xl bg-white/60 border border-white/50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-2">
              Philosophy
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Built for focus, not funnels.
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-xl">
              Simple Web Tools is a collection of small, reliable utilities. It’s designed to be the
              quiet tab you open, use, and close—without noise, friction, or distractions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-slate-50 text-[11px] font-semibold">
                  ✓
                </span>
                <span>Privacy-first by default. Your paste stays yours.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-slate-50 text-[11px] font-semibold">
                  ✓
                </span>
                <span>Clarity over clutter. The UI stays calm and predictable.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-slate-50 text-[11px] font-semibold">
                  ✓
                </span>
                <span>Built for daily use. Quick in, quick out.</span>
              </li>
            </ul>
          </div>

          <dl className="grid h-full gap-3 sm:grid-cols-2 lg:grid-rows-2 lg:auto-rows-fr">
            <div className="h-full rounded-xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Runs locally
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                Processing happens in your browser. Your data doesn’t get uploaded.
              </dd>
            </div>
            <div className="h-full rounded-xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                No tracking
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                No analytics dashboards or tracking pixels watching what you paste.
              </dd>
            </div>
            <div className="h-full rounded-xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                No accounts
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                No sign-ups. No onboarding. Open a tool and start immediately.
              </dd>
            </div>
            <div className="h-full rounded-xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Built for speed
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                Fast load, readable output, and minimal UI so you can stay in flow.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SectionFade>
  )
}

type HowItWorksProps = {
  anchorRef: RefObject<HTMLElement | null>
}

const HowItWorks: React.FC<HowItWorksProps> = ({ anchorRef }) => {
  return (
    <SectionFade className="max-w-5xl mx-auto pt-16 sm:pt-20">
      <section ref={anchorRef}>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">How it works</h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Every tool follows the same rhythm. Open, paste, get your answer, and move on.
          </p>
        </div>
        <div className="relative">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700 text-sm font-semibold">
                  1
                </div>
                <p className="text-sm font-medium text-slate-900">Paste your data</p>
              </div>
              <p className="text-sm text-slate-600">
                Drop JSON, text, timestamps, or other input straight into the page.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700 text-sm font-semibold">
                  2
                </div>
                <p className="text-sm font-medium text-slate-900">Instantly process it</p>
              </div>
              <p className="text-sm text-slate-600">
                Tools respond immediately, showing formatted, diffed, or converted output.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700 text-sm font-semibold">
                  3
                </div>
                <p className="text-sm font-medium text-slate-900">Copy and move on</p>
              </div>
              <p className="text-sm text-slate-600">
                Copy what you need, close the tab, and take the result back to your work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SectionFade>
  )
}

const FeedbackSection: React.FC = () => {
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitted(false)
    setIsSubmitting(false)

    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError("Please share a message or a tool idea.")
      return
    }

    if (email.trim()) {
      const simpleEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!simpleEmailPattern.test(email.trim())) {
        setError("Please enter a valid email address, or leave it blank.")
        return
      }
    }

    setIsSubmitting(true)

    try {
      await sendEmail({
        form_type: "Feedback or Tool Request",
        user_name: "Anonymous",
        user_email: email.trim() || "Not provided",
        message: message.trim(),
      })

      setSubmitted(true)
      setMessage("")
      setEmail("")
    } catch {
      setError(
        "Something went wrong while sending your feedback. Please try again in a moment or use the contact page instead."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SectionFade className="max-w-5xl mx-auto pt-16 sm:pt-20">
      <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-6 sm:px-6 sm:py-8 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
            Feedback & tool requests
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Missing a tool? Have feedback? Tell us what you&apos;d like to see next. Short notes are
            welcome—this exists to understand what would actually help.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="feedback-message"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Message
              <span className="ml-1 text-xs font-normal text-slate-500">(required)</span>
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Describe a tool you wish existed, or how these tools could be more useful in your day-to-day work."
            />
          </div>
          <div>
            <label
              htmlFor="feedback-email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email
              <span className="ml-1 text-xs font-normal text-slate-500">
                (optional, for follow-up only)
              </span>
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="you@example.com"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {submitted && !error && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 animate-fade-in-soft">
              Thanks for sharing. Your feedback has been sent and will only be used to understand
              how to make these tools more useful.
            </p>
          )}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#088108] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-all duration-200"
            >
              {isSubmitting ? "Sending…" : "Send feedback"}
            </button>
          </div>
        </form>
      </div>
    </SectionFade>
  )
}

const BuyMeCoffee: React.FC = () => {
  return (
    <SectionFade className="max-w-5xl mx-auto pt-16 sm:pt-20">
      <div className="rounded-2xl border border-amber-100 bg-amber-50/90 px-5 py-7 sm:px-7 sm:py-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-shrink-0">
            <img
              src={coffeeCup}
              alt="Coffee cup illustration"
              className="h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-sm"
              loading="lazy"
            />
          </div>
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">
                Like these tools?
              </h2>
              <p className="text-sm sm:text-base text-slate-700 max-w-xl">
                If they save you a bit of time or focus, you can buy me a coffee. It&apos;s optional,
                but always appreciated.
              </p>
            </div>
            <div className="pt-1">
              <a
                href="https://www.buymeacoffee.com/sakkeer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#088108] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transform transition-all duration-200 hover:scale-105 animate-subtle-pulse"
              >
                <img
                  src={coffeeCup}
                  alt="Coffee"
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                />
                <span>Buy me a coffee</span>
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={bmcQr}
              alt="Scan to buy me a coffee"
              className="h-24 w-24 sm:h-28 sm:w-28 object-contain rounded-lg border border-amber-100 bg-white/90 p-1 shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </SectionFade>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <img
            src={logoBlack}
            alt="Simple Web Tools logo"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
            loading="lazy"
          />
          <div>
            <p className="text-xs text-slate-500">
              Simple Web Tools &middot; Small, focused utilities for everyday work.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              © 2026 Sakkeer A. All rights reserved.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <a href="/" className="hover:text-slate-900">
            Home
          </a>
          <a href="/#tools" className="hover:text-slate-900">
            Tools
          </a>
          <a href="/privacy" className="hover:text-slate-900">
            Privacy
          </a>
          <a href="/contact" className="hover:text-slate-900">
            Contact
          </a>
          <a
            href="https://github.com/ASakkeer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-900"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M12 2C6.477 2 2 6.486 2 12.021c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.071 1.533 1.036 1.533 1.036.892 1.532 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.221-.253-4.555-1.115-4.555-4.961 0-1.096.39-1.993 1.029-2.695-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.029A9.409 9.409 0 0 1 12 6.844c.85.004 1.705.115 2.503.337 1.909-1.299 2.747-1.029 2.747-1.029.546 1.378.203 2.397.1 2.65.64.702 1.027 1.599 1.027 2.695 0 3.857-2.337 4.705-4.566 4.953.359.31.679.92.679 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.481A10.025 10.025 0 0 0 22 12.021C22 6.486 17.523 2 12 2Z"
              />
            </svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sakkeer5297"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            LinkedIn
          </a>
          <a
            href="https://work.sakkeer.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            Portfolio
          </a>
        </nav>
      </div>
    </footer>
  )
}

const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const toolsSectionRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSection
        onBrowseTools={() => scrollToSection(toolsSectionRef)}
        onLearnHowItWorks={() => scrollToSection(howItWorksRef)}
      />
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <section
          id="tools"
          ref={toolsSectionRef}
          className="relative z-20 max-w-6xl mx-auto -mt-10 sm:-mt-14 space-y-8 sm:space-y-10"
        >
          <ToolsSearch value={searchTerm} onChange={setSearchTerm} />
          <ToolsList searchTerm={searchTerm} />
        </section>
        <TrustSection />
        <HowItWorks anchorRef={howItWorksRef} />
        <FeedbackSection />
        <BuyMeCoffee />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

