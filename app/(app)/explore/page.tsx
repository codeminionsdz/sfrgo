import type { Metadata } from "next"
import { ExploreOffers } from "@/components/traveler/explore"
import { getOffers, getSavedOfferIds } from "@/lib/actions/offers"

export const metadata: Metadata = {
  title: "Explore - SAFRGO",
  description: "Discover travel offers from trusted agencies",
}

export default async function ExplorePage() {
  const [offers, savedOfferIds] = await Promise.all([getOffers(), getSavedOfferIds()])

  return <ExploreOffers initialOffers={offers} initialSavedOfferIds={savedOfferIds} />
}
