// Privacy page for Simple Web Tools - calm, human, privacy-first explanation
import { Link } from "react-router-dom"
import logoBlack from "@/assets/images/logo-black.png"

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        {/* Sticky nav with back button */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-slate-200 bg-slate-50/95 backdrop-blur px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-slate-600 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              aria-label="Go back to home"
            >
              <span aria-hidden="true" className="text-base leading-none">
                ←
              </span>
              <span className="font-medium">Home</span>
            </Link>
          </div>
        </div>

        <div className="px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">

          {/* Header card */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex h-16 w-16 items-center justify-center text-emerald-600">
              <svg
                  className="h-12 w-12"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3.25L6.5 5.25V11.5C6.5 15.09 8.76 18.36 12 19.5C15.24 18.36 17.5 15.09 17.5 11.5V5.25L12 3.25Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.25 11.75L11.1 13.6L14.75 9.75"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  Your Privacy Comes First
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                  Simple Web Tools runs entirely in your browser. The tools are built to be
                  privacy‑first by design, so your data stays on your device.
                </p>
              </div>
            </div>
          </section>

          {/* Data handling */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M8 17H16"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Data handling: your device, your data
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  Simple Web Tools does not collect, store, or process your data on any server.
                  All formatting, transformations, and analysis happen directly inside your browser.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                When you use tools like the JSON Formatter, Word Counter, or Diff Checker, your
                input is handled only by code running locally in your browser tab.
              </p>
              <p className="pt-1">
                Your data is not sent to a backend, stored in a database, or logged to any server.
                There are no hidden uploads or background requests that ship your text elsewhere.
              </p>
              <p className="pt-1">
                Close the tab or refresh the page, and the in‑memory data used by the tools is gone.
              </p>
            </div>
          </section>

          {/* Client-side processing */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="12"
                  r="2.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="16"
                  cy="12"
                  r="2.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M10.2 12H13.8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Client‑side processing, explained simply
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  Modern browsers are powerful enough to do this work locally. That&apos;s why these
                  tools run without accounts, logins, or background services.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                When you paste or type something into a tool, the browser runs small, focused
                functions to format, count, or compare your text. The work happens on your machine,
                not on a server you never see.
              </p>
              <p className="pt-1">
                Because the information never leaves your device, there&apos;s no server‑side copy
                that could be exposed, leaked, or misused.
              </p>
            </div>
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-xs sm:text-sm text-slate-600">
            <p className="mb-2 font-medium text-slate-700">How each tool works in practice</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                    1
                  </span>
                  <span>Your browser</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                    2
                  </span>
                  <span>Tool processing (JSON, text, diff)</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                    3
                  </span>
                  <span>Output on your screen</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Everything happens inside this single boundary in your browser. There is no extra box
              for &quot;server&quot; in this diagram, because none is used.
            </p>
          </div>
        </section>

          {/* Storage & persistence */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="5"
                  width="14"
                  height="4"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="4"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <rect
                  x="5"
                  y="15"
                  width="14"
                  height="4"
                  rx="1.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <text
                  x="12"
                  y="12.6"
                  textAnchor="middle"
                  className="fill-current text-[9px]"
                >
                  Local
                </text>
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Storage & persistence (local only)
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  The app may use your browser&apos;s local storage to remember a few details that
                  make the tools more pleasant to use.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                This can include things like recent input, simple preferences, or which tool you
                used last. All of this lives in your browser, on your device.
              </p>
              <p className="pt-1">
                Nothing in local storage is sent back to a server by Simple Web Tools. You are
                always free to clear this data at any time using your browser settings.
              </p>
            </div>
          </section>

          {/* Transparency & tracking */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M7.5 7.5L16.5 16.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Transparency: analytics & tracking
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  Simple Web Tools is intentionally quiet. There are no invasive trackers, no ad
                  networks, and no behavioral profiles.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">There are no ads, no accounts, and no identity‑based tracking.</p>
              <p className="pt-1">
                If lightweight, anonymous usage metrics are ever added, they will be non‑identifying
                and used only to understand which tools are helpful and where to improve. They will
                not be tied to names, emails, or logged‑in identities.
              </p>
            </div>
          </section>

          {/* Third‑party services */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14.5 4H19.5V9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14L19.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="5"
                  y="7"
                  width="9"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Third‑party services & payments
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  Some links, like &quot;Buy me a coffee&quot;, take you to external services that
                  have their own privacy policies.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                When you click a support link, you leave Simple Web Tools and move to a separate
                platform. That platform is responsible for handling any payments or personal
                details.
              </p>
              <p className="pt-1">
                Simple Web Tools does not process payments and does not store your payment
                information or billing details.
              </p>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8.5 11V9.5C8.5 7.57 10.02 6 12 6C13.98 6 15.5 7.57 15.5 9.5V11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <rect
                  x="6.5"
                  y="11"
                  width="11"
                  height="7"
                  rx="1.8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Security & browser safeguards
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  The app leans on modern browser security features and strict content security
                  practices to keep things safe by default.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                Because tools run locally, there is less attack surface than a traditional
                server‑based app. There is no central database of user content to protect, and no
                backend endpoints that accept your pasted data.
              </p>
              <p className="pt-1">
                The app is delivered as static assets, and the browser&apos;s built‑in safeguards
                help prevent unsafe scripts and unauthorized access.
              </p>
            </div>
          </section>

          {/* User control */}
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <header className="mb-5 flex items-start gap-4">
              <div className="mt-0.5 inline-flex h-14 w-14 items-center justify-center text-emerald-600">
              <svg
                  className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 12H17"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M12 7V17"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Your control, at all times
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
                  You decide what lives in your browser and for how long. There are no accounts to
                  manage, reset, or delete.
                </p>
              </div>
            </header>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-slate-600">
              <p className="pt-1">
                You can refresh the page, close the tab, or clear your browser storage whenever you
                like. Doing so removes any locally stored data used by these tools.
              </p>
              <p className="pt-1">
                Since there is no central user account, there is nothing for us to deactivate on
                your behalf. Control sits with you, on your device.
              </p>
            </div>
          </section>

          {/* Closing summary */}
          <section className="mt-2 rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
            <p className="text-sm sm:text-base text-slate-600">
              Simple Web Tools is built to be fast, useful, and respectful. Privacy is not an extra
              feature; it is part of the architecture. If you have questions or suggestions about
              how privacy is handled, you&apos;re welcome to reach out through the feedback or
              contact page.
            </p>
          </section>
          </div>
        </div>
      </main>

      {/* Footer (matches Home footer) */}
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
    </div>
  )
}

export default Privacy

