import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - SAFRGO",
  description: "Reset your SAFRGO account password",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
