import { LandingHeader } from "@/components/landing/header"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { FeaturedOffers } from "@/components/landing/featured-offers"
import { FeaturedAgencies } from "@/components/landing/agencies"
import { PlatformStats } from "@/components/landing/stats"
import { LandingCTA } from "@/components/landing/cta"
import { LandingFooter } from "@/components/landing/footer"
import { getCuratedOffers, getCuratedAgencies, getPlatformStats } from "@/lib/actions/landing"

export default async function LandingPage() {
  // Fetch all data server-side
  const [offers, agencies, stats] = await Promise.all([
    getCuratedOffers(),
    getCuratedAgencies(),
    getPlatformStats(),
  ])

  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <PlatformStats stats={stats} />
        <LandingFeatures />
        <FeaturedOffers offers={offers} />
        <FeaturedAgencies agencies={agencies} />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
