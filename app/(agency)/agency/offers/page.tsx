import type { Metadata } from "next"
import { AgencyOffers } from "@/components/agency/offers-list"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "My Offers - SAFRGO Agency",
  description: "Manage your travel offers",
}

export default async function AgencyOffersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: agency } = await supabase.from("agencies").select("*").eq("owner_id", user.id).single()

  if (!agency) {
    redirect("/agency-setup")
  }

  const { data: offers } = await supabase
    .from("offers")
    .select(`
      *,
      saved_offers(count)
    `)
    .eq("agency_id", agency.id)
    .order("created_at", { ascending: false })

  const offersWithCount =
    offers?.map((offer) => ({
      ...offer,
      savedCount: offer.saved_offers?.[0]?.count || 0,
    })) || []

  return <AgencyOffers offers={offersWithCount} agency={agency} />
}
