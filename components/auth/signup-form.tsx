"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, AlertCircle, Check, User, Building2 } from "@/components/icons"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

type AccountType = "traveler" | "agency"

export function SignupForm() {
  const router = useRouter()
  const [accountType, setAccountType] = useState<AccountType>("traveler")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agencyName: "",
    agreeTerms: false,
  })

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "One number", met: /[0-9]/.test(formData.password) },
  ]

  const allRequirementsMet = passwordRequirements.every((req) => req.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    if (!allRequirementsMet) {
      setError("Please meet all password requirements")
      return
    }

    if (accountType === "agency" && !formData.agencyName.trim()) {
      setError("Please enter your agency name")
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: accountType,
          agency_name: accountType === "agency" ? formData.agencyName : undefined,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      // انتظر قليلاً للسماح بتنفيذ الـ trigger
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to appropriate dashboard immediately
      const redirectTo = accountType === "agency" ? "/agency" : "/traveler"
      router.push(redirectTo)
    }

    setIsLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create an account</h1>
        <p className="text-muted-foreground">Join SAFRGO and start your travel journey</p>
      </div>

      {/* Account Type Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setAccountType("traveler")}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
            accountType === "traveler" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              accountType === "traveler" ? "bg-primary text-primary-foreground" : "bg-secondary",
            )}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">Traveler</span>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("agency")}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
            accountType === "agency" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              accountType === "agency" ? "bg-primary text-primary-foreground" : "bg-secondary",
            )}
          >
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">Agency</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

        {accountType === "agency" && (
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agency name</Label>
            <Input
              id="agencyName"
              type="text"
              placeholder="Your Travel Agency"
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              required
              autoComplete="organization"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.password && (
            <ul className="mt-2 space-y-1">
              {passwordRequirements.map((req, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    req.met ? "text-green-600" : "text-muted-foreground",
                  )}
                >
                  <Check className={cn("w-3 h-3 transition-opacity", req.met ? "opacity-100" : "opacity-0")} />
                  {req.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
