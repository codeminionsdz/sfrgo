"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createAgency } from "@/lib/actions/agencies"

interface AgencySetupFormProps {
  userId: string
  userEmail: string
  userName: string
}

export function AgencySetupForm({ userId, userEmail, userName }: AgencySetupFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await createAgency(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      console.log("[v0] Agency created successfully")
      router.push("/agency")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Setup error:", err)
      setError(err.message || "فشل في إنشاء الوكالة. حاول مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات الوكالة</CardTitle>
        <CardDescription>أدخل المعلومات الأساسية لوكالة السفر الخاصة بك</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الوكالة *</Label>
            <Input
              id="name"
              name="name"
              placeholder="مثال: سفرغو للسياحة والسفر"
              required
              defaultValue={userName}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الوكالة *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="وصف موجز عن خدمات وكالتك..."
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع *</Label>
            <Input
              id="location"
              name="location"
              placeholder="مثال: الرياض، المملكة العربية السعودية"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2">
              <span className="font-semibold">خطأ:</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الوكالة"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
