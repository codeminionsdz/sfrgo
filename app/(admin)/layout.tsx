"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Loader2 } from "@/components/icons"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState({ pendingPayments: 0, pendingVerifications: 0 })

  useEffect(() => {
    const checkAuth = async () => {
      const adminSession = localStorage.getItem("safrgo_admin_session")

      if (adminSession !== "true") {
        router.push("/admin-login")
        return
      }

      setIsAuthorized(true)

      // Load stats
      const supabase = createClient()
      const { count: pendingPayments } = await supabase
        .from("agencies")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "pending")

      const { count: pendingVerifications } = await supabase
        .from("agencies")
        .select("*", { count: "exact", head: true })
        .eq("verified", false)
        .neq("verification_status", "rejected")

      setStats({
        pendingPayments: pendingPayments || 0,
        pendingVerifications: pendingVerifications || 0,
      })
    }

    checkAuth()
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Create dummy admin profile for display
  const adminProfile = {
    id: "admin",
    name: "المسؤول",
    email: "admin@safrgo.com",
    role: "admin",
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        profile={adminProfile}
        pendingPayments={stats.pendingPayments}
        pendingVerifications={stats.pendingVerifications}
      />
      <main className="lg:ml-64">{children}</main>
    </div>
  )
}
