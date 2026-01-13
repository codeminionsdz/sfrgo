"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AgencyProfileEditor } from "@/components/agency/profile-editor"

export default function AgencyProfilePage() {
  const [agency, setAgency] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAgency() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = "/login"
        return
      }

      const { data: agencyData } = await supabase
        .from("agencies")
        .select("*")
        .eq("owner_id", user.id)
        .single()

      if (agencyData) {
        setAgency(agencyData)
      }
      setLoading(false)
    }

    loadAgency()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!agency) {
    return <div className="p-8">Agency not found</div>
  }

  return <AgencyProfileEditor agency={agency} />
}
