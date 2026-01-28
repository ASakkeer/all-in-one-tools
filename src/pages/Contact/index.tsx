// Contact page for Simple Web Tools - calm, minimal, trust-focused communication channel
import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import logoBlack from "@/assets/images/logo-black.png"
import { sendEmail } from "@/utils/sendEmail"

const Contact = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitted(false)
    setIsSubmitting(false)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Please share a name so the reply can be addressed to you.")
      return
    }

    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError("Please share a message so there’s something to respond to.")
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
        form_type: "Contact",
        user_name: name.trim(),
        user_email: email.trim() || "Not provided",
        message: message.trim(),
      })

      setSubmitted(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setError(
        "Something went wrong while sending your message. Please try again in a moment or use an alternative channel below."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

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
                      d="M5.5 5.25H18.5C19.0523 5.25 19.5 5.69772 19.5 6.25V14.75C19.5 15.3023 19.0523 15.75 18.5 15.75H8.75L5 18.75V6.25C5 5.69772 5.44772 5.25 5.5 5.25Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 9H16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 11.75H13.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                    Get in Touch
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                    Ask questions, report issues, suggest new tools, or share how you&apos;re using
                    Simple Web Tools. Messages go directly to the person building and maintaining
                    the tools.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy reassurance */}
            <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 sm:px-7 sm:py-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center text-emerald-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3.25L6.5 5.25V11.5C6.5 15.09 8.76 18.36 12 19.5C15.24 18.36 17.5 15.09 17.5 11.5V5.25L12 3.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.7 11.9L11.3 13.5L14.3 9.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Privacy-respectful by default
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
                    Messages you send here are used only to respond to you or improve the tools.
                    There are no accounts, and your details are never sold or shared with
                    advertisers or data brokers.
                  </p>
                </div>
              </div>
            </section>

            {/* Main layout: form + guidance */}
            <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
              {/* Contact form */}
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 shadow-sm lg:max-w-[640px]">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
                  Send a message
                </h2>
                <p className="mb-5 text-sm text-slate-600">
                  You can include as much or as little detail as you like. A short note is enough,
                  but more context always helps.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Name <span className="text-xs font-normal text-red-500">(required)</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      placeholder="How you’d like to be addressed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      Email{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (optional, recommended for replies)
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Message <span className="text-xs font-normal text-slate-500">(required)</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Developers: mentioning which tool and what input you used is super helpful.
                      </p>
                    </div>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={7}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      placeholder="Share what’s on your mind, what’s not working as expected, or what would make these tools more useful to you."
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  {submitted && !error && (
                    <div className="flex items-start gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 animate-fade-in-soft">
                      <div
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-[11px] text-white"
                        style={{ width: "20px", height: "30px", padding: "15px" }}
                      >
                        ✓
                      </div>
                      <p>
                        Thanks for reaching out. Your message has been sent and will only be used to
                        respond to you or improve Simple Web Tools.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#088108] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#066306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 transition-all duration-200"
                    >
                      {isSubmitting ? "Sending…" : "Send message"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Guidance + alternative contact */}
              <div className="space-y-4 lg:pl-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-5 sm:py-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50 text-xs">
                      ?
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Not sure what to write?
                    </h2>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">
                    People usually get in touch about things like:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-700"
                        style={{ height: "25px", width: "30px", padding: "10px" }}
                      >
                        !
                      </span>
                      <span>Bug reports – something in a tool doesn&apos;t behave as expected.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-700"
                        style={{ height: "25px", width: "30px", padding: "10px" }}
                      >
                        +
                      </span>
                      <span>Feature requests – small improvements that would save you time.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-700"
                        style={{ height: "25px", width: "30px", padding: "10px" }}
                      >
                        ✦
                      </span>
                      <span>New tool ideas – utilities you wish existed in your browser.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-700"
                        style={{ height: "25px", width: "30px", padding: "10px" }}
                      >
                        ☺
                      </span>
                      <span>Usability feedback – what feels smooth, and what feels rough.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 inline-flex items-center justify-center rounded-full bg-slate-100 text-[13px] text-slate-700"
                        style={{ height: "25px", width: "30px", padding: "10px" }}
                      >
                        ?
                      </span>
                      <span>General questions – how something works or how it handles your data.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5 sm:py-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900 mb-1.5">
                    Prefer a different channel?
                  </h2>
                  <p className="mb-3 text-sm text-slate-600">
                    The form is the simplest way to get in touch, but you can also reach out via:
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {/* <li>
                      <span className="font-medium text-slate-800">Email:</span>{" "}
                      <a
                        href="mailto:sakkeer.nsn@gmail.com"
                        className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        sakkeer.nsn@gmail.com
                      </a>
                    </li> */}
                    <li>
                      <span className="font-medium text-slate-800">GitHub:</span>{" "}
                      <a
                        href="https://github.com/ASakkeer"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        github.com/ASakkeer
                      </a>
                    </li>
                    <li>
                      <span className="font-medium text-slate-800">LinkedIn:</span>{" "}
                      <a
                        href="https://www.linkedin.com/in/sakkeer5297"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        linkedin.com/in/sakkeer5297
                      </a>
                    </li>
                  </ul>
                  <p className="mt-3 text-[11px] text-slate-500">
                    These options are completely optional—use whatever feels most comfortable.
                  </p>
                </div>
              </div>
            </section>

            {/* Closing note */}
            <section className="mt-2 rounded-2xl border border-slate-200 bg-white px-5 py-5 sm:px-7 sm:py-6 shadow-sm">
              <p className="text-sm sm:text-base text-slate-600">
                Thank you for taking the time to reach out. Your feedback helps shape which tools
                get refined next, which new utilities are built, and how Simple Web Tools stays
                simple, useful, and respectful of your time and data.
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

export default Contact

