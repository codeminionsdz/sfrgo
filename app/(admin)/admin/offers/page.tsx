import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AdminOffers } from "@/components/admin/offers-review"

export const metadata: Metadata = {
  title: "Offers Review - SAFRGO Admin",
  description: "Review and approve offers",
}

export default async function AdminOffersPage() {
  const supabase = await createClient()

  // Get pending offers
  const { data: pendingOffers } = await supabase
    .from("offers")
    .select("*, agencies(name, logo, verified)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  // Get all offers for stats
  const { count: totalOffers } = await supabase.from("offers").select("*", { count: "exact", head: true })

  const { count: activeOffers } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const stats = {
    pendingCount: pendingOffers?.length || 0,
    totalOffers: totalOffers || 0,
    activeOffers: activeOffers || 0,
  }

  return <AdminOffers pendingOffers={pendingOffers || []} stats={stats} />
}
