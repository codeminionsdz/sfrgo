import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in - SAFRGO",
  description: "Log in to your SAFRGO account",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
