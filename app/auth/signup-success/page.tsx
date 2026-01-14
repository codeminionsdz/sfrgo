"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "@/components/icons"

export default function SignupSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // This page should not be accessible anymore
    // Redirect to home if somehow reached
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
