// Shared EmailJS sending utility for all user-facing forms
// Centralizes EmailJS usage so components stay simple and configuration lives in one place.

import emailjs from "@emailjs/browser"
import { emailJsConfig } from "@/config/emailjs"

export type EmailPayload = {
  form_type: string
  user_name: string
  user_email: string
  message: string
}

/**
 * Send an email via EmailJS using the shared configuration.
 * Returns the underlying EmailJS promise so callers can handle success/error states.
 */
export function sendEmail(payload: EmailPayload) {
  const { serviceId, templateId, publicKey } = emailJsConfig

  return emailjs.send(serviceId, templateId, payload, publicKey)
}

