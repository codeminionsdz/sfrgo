"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminPayments } from "@/components/admin/payments"

export default function AdminPaymentsPage() {
  const [data, setData] = useState<any>({
    pendingPayments: [],
    stats: {
      pendingCount: 0,
      approvedThisMonth: 0,
      revenueThisMonth: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data: pendingPayments } = await supabase
        .from("subscription_requests")
        .select("*, agency:agencies(name, id, subscription_receipt_url)")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })

      // Get count of approved this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: approvedThisMonth } = await supabase
        .from("subscription_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("reviewed_at", startOfMonth.toISOString())

      const planPrices: Record<string, number> = {
        starter: 99,
        premium: 299,
        enterprise: 999,
      }

      const { data: approvedRequests } = await supabase
        .from("subscription_requests")
        .select("plan")
        .eq("status", "approved")
        .gte("reviewed_at", startOfMonth.toISOString())

      const revenueThisMonth =
        approvedRequests?.reduce((sum, req) => {
          return sum + (planPrices[req.plan as keyof typeof planPrices] || 0)
        }, 0) || 0

      setData({
        pendingPayments: pendingPayments || [],
        stats: {
          pendingCount: pendingPayments?.length || 0,
          approvedThisMonth: approvedThisMonth || 0,
          revenueThisMonth,
        },
      })
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return <AdminPayments pendingPayments={data.pendingPayments} stats={data.stats} />
}
