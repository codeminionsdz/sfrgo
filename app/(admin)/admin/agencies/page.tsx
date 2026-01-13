import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AdminAgencies } from "@/components/admin/agencies-list"

export const metadata: Metadata = {
  title: "Agencies - SAFRGO Admin",
  description: "Manage platform agencies",
}

export default async function AdminAgenciesPage() {
  const supabase = await createClient()

  const { data: agencies } = await supabase.from("agencies").select("*").order("created_at", { ascending: false })

  // Get offer counts and follower counts for each agency
  const agenciesWithStats = await Promise.all(
    (agencies || []).map(async (agency) => {
      const { count: offersCount } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("agency_id", agency.id)

      const { count: followersCount } = await supabase
        .from("followed_agencies")
        .select("*", { count: "exact", head: true })
        .eq("agency_id", agency.id)

      const { data: owner } = await supabase.from("profiles").select("name, email").eq("id", agency.owner_id).single()

      return {
        ...agency,
        offersCount: offersCount || 0,
        followersCount: followersCount || 0,
        owner: owner || null,
      }
    }),
  )

  return <AdminAgencies agencies={agenciesWithStats} />
}
