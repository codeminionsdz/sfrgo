import type { Metadata } from "next"
import { SavedOffers } from "@/components/traveler/saved"
import { getSavedOffers } from "@/lib/actions/offers"
import { getFollowedAgencies } from "@/lib/actions/agencies"
import { redirect } from "next/navigation"
import { getProfile } from "@/lib/actions/auth"

export const metadata: Metadata = {
  title: "Saved - SAFRGO",
  description: "Your saved offers and followed agencies",
}

export default async function SavedPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect("/login")
  }

  const [savedOffers, followedAgencies] = await Promise.all([getSavedOffers(), getFollowedAgencies()])

  return <SavedOffers initialSavedOffers={savedOffers} initialFollowedAgencies={followedAgencies} />
}
