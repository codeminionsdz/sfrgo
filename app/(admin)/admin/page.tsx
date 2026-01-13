"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminDashboard } from "@/components/admin/dashboard"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAgencies: 0,
    totalTravelers: 0,
    pendingPayments: 0,
    pendingVerifications: 0,
    pendingSubscriptions: [],
    pendingVerificationAgencies: [],
    recentAgencies: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get stats
      const { count: totalAgencies } = await supabase.from("agencies").select("*", { count: "exact", head: true })

      const { count: totalTravelers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "traveler")

      const { count: pendingPayments } = await supabase
        .from("subscription_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      const { count: pendingVerifications } = await supabase
        .from("verification_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      const { data: pendingSubscriptions } = await supabase
        .from("subscription_requests")
        .select("*, agency:agencies(name, id)")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })
        .limit(5)

      const { data: pendingVerificationAgencies } = await supabase
        .from("verification_requests")
        .select("*, agency:agencies(name, id)")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })
        .limit(5)

      // Get recent activity (new agencies)
      const { data: recentAgencies } = await supabase
        .from("agencies")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      setStats({
        totalAgencies: totalAgencies || 0,
        totalTravelers: totalTravelers || 0,
        pendingPayments: pendingPayments || 0,
        pendingVerifications: pendingVerifications || 0,
        pendingSubscriptions: pendingSubscriptions || [],
        pendingVerificationAgencies: pendingVerificationAgencies || [],
        recentAgencies: recentAgencies || [],
      })
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <AdminDashboard
      stats={stats}
      pendingSubscriptions={stats.pendingSubscriptions}
      pendingVerificationAgencies={stats.pendingVerificationAgencies}
      recentAgencies={stats.recentAgencies}
    />
  )
}
