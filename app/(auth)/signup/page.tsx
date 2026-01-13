import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign up - SAFRGO",
  description: "Create your SAFRGO account",
}

export default function SignupPage() {
  return <SignupForm />
}
