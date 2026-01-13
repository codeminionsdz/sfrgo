import type { Metadata } from "next"
import { TravelerHome } from "@/components/traveler/home"
import { getOffers, getSavedOfferIds } from "@/lib/actions/offers"
import { getFollowedAgencies, getFollowedAgencyIds } from "@/lib/actions/agencies"
import { getProfile } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Home - SAFRGO",
  description: "Your personalized travel feed",
}

export default async function TravelerHomePage() {
  const profile = await getProfile()

  if (!profile) {
    redirect("/login")
  }

  const [featuredOffers, recentOffers, followedAgencies, savedOfferIds, followedAgencyIds] = await Promise.all([
    getOffers({ featured: true, limit: 3 }),
    getOffers({ limit: 4 }),
    getFollowedAgencies(),
    getSavedOfferIds(),
    getFollowedAgencyIds(),
  ])

  return (
    <TravelerHome
      profile={profile}
      featuredOffers={featuredOffers}
      recentOffers={recentOffers}
      followedAgencies={followedAgencies}
      savedOfferIds={savedOfferIds}
      followedAgencyIds={followedAgencyIds}
    />
  )
}
