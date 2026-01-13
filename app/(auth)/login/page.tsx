import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in - SAFRGO",
  description: "Log in to your SAFRGO account",
}

export default function LoginPage() {
  return <LoginForm />
}
