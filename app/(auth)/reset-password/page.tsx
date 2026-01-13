import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - SAFRGO",
  description: "Create a new password for your SAFRGO account",
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
