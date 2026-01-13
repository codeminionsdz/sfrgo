"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminVerification } from "@/components/admin/verification"

export default function AdminVerificationPage() {
  const [data, setData] = useState<any>({
    pendingVerifications: [],
    stats: {
      pendingCount: 0,
      verifiedCount: 0,
      verificationRate: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get unverified agencies
      const { data: pendingVerifications } = await supabase
        .from("agencies")
        .select("*")
        .eq("verified", false)
        .order("created_at", { ascending: false })

      // Get verified agencies count
      const { count: verifiedCount } = await supabase
        .from("agencies")
        .select("*", { count: "exact", head: true })
        .eq("verified", true)

      // Get total agencies count
      const { count: totalCount } = await supabase.from("agencies").select("*", { count: "exact", head: true })

      const verificationRate = totalCount ? Math.round(((verifiedCount || 0) / totalCount) * 100) : 0

      setData({
        pendingVerifications: pendingVerifications || [],
        stats: {
          pendingCount: pendingVerifications?.length || 0,
          verifiedCount: verifiedCount || 0,
          verificationRate,
        },
      })
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return <AdminVerification pendingVerifications={data.pendingVerifications} stats={data.stats} />
}
