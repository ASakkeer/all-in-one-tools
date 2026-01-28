// Centralized EmailJS configuration for Simple Web Tools forms
// This file holds only non-sensitive identifiers and reads actual values from Vite environment vars.

export type EmailJsConfig = {
  serviceId: string
  templateId: string
  publicKey: string
}

// Values are sourced from environment variables so real keys are not committed.
// Update your `.env` (e.g. VITE_EMAILJS_SERVICE_ID, etc.) when wiring EmailJS.
export const emailJsConfig: EmailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
}

