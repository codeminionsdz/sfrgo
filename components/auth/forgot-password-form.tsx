"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, Mail } from "@/components/icons"
import { createClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const supabase = createClient()

    // Get the current origin for the redirect URL
    const origin = window.location.origin

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    })

    if (resetError) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
      return
    }

    // Show success message regardless of whether email exists (security best practice)
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            If an account exists for {email}, we&apos;ve sent a password reset link.
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 mb-6">
          <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Reset link sent</p>
            <p className="text-sm text-muted-foreground">
              Check your inbox and spam folder. The link will expire in 1 hour.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => {
              setSuccess(false)
              setEmail("")
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Didn&apos;t receive the email? Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Forgot your password?</h1>
        <p className="text-muted-foreground">
          No worries. Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
