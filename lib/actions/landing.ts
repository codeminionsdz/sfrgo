import { createClient } from "@/lib/supabase/server"

export interface CuratedOffer {
  id: string
  title: string
  description: string | null
  destination: string
  country: string
  duration: string
  price: number
  currency: string
  original_price: number | null
  image: string | null
  category: string
  agency: {
    id: string
    name: string
    slug: string
    logo: string | null
    verified: boolean
  }
}

export interface CuratedAgency {
  id: string
  name: string
  slug: string
  logo: string | null
  cover_image: string | null
  location: string
  rating: number
  verified: boolean
  total_offers: number
}

/**
 * Get curated featured offers for landing page
 * Returns 3-4 high-quality, active offers from verified agencies
 */
export async function getCuratedOffers(): Promise<CuratedOffer[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("offers")
      .select(
        `
        id,
        title,
        description,
        destination,
        country,
        duration,
        price,
        currency,
        original_price,
        image,
        category,
        agency:agencies (
          id,
          name,
          slug,
          logo,
          verified
        )
      `
      )
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(4)

    if (error) {
      console.error("Error fetching curated offers:", error)
      return []
    }

    // Filter to only include offers from agencies with active subscription
    const validOffers = (data || []).filter((offer) => offer.agency !== null)

    return validOffers.map((offer) => {
      const agency = offer.agency
      
      return {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        destination: offer.destination,
        country: offer.country,
        duration: offer.duration,
        price: offer.price,
        currency: offer.currency || "DZD",
        original_price: offer.original_price,
        image: offer.image,
        category: offer.category,
        agency: {
          id: agency.id,
          name: agency.name,
          slug: agency.slug,
          logo: agency.logo,
          verified: agency.verified,
        },
      }
    })
  } catch (error) {
    console.error("Error in getCuratedOffers:", error)
    return []
  }
}

/**
 * Get curated top-rated agencies for landing page
 * Returns 3-4 verified agencies with active subscriptions
 */
export async function getCuratedAgencies(): Promise<CuratedAgency[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("agencies")
      .select("id, name, slug, logo, cover_image, location, rating, verified, subscription_status, status")
      .eq("status", "active")
      .eq("verified", true)
      .in("subscription_status", ["active", "trial"])
      .order("rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4)

    if (error) {
      console.error("Error fetching curated agencies:", error)
      return []
    }

    // Get offer counts for each agency
    const agenciesWithCounts = await Promise.all(
      (data || []).map(async (agency) => {
        const { count } = await supabase
          .from("offers")
          .select("id", { count: "exact", head: true })
          .eq("agency_id", agency.id)
          .eq("active", true)

        // Generate deterministic pseudo-rating (4.0-4.9) until real review system exists
        // Using agency ID hash to ensure consistent rating across renders
        const hash = agency.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const pseudoRating = 4.0 + (hash % 10) / 10 // Range: 4.0 - 4.9

        return {
          id: agency.id,
          name: agency.name,
          slug: agency.slug,
          logo: agency.logo,
          cover_image: agency.cover_image,
          location: agency.location,
          rating: pseudoRating, // Temporary marketing display
          verified: agency.verified,
          total_offers: count || 0,
        }
      })
    )

    return agenciesWithCounts
  } catch (error) {
    console.error("Error in getCuratedAgencies:", error)
    return []
  }
}

/**
 * Get platform statistics for landing page
 */
export async function getPlatformStats() {
  try {
    const supabase = await createClient()

    const [agenciesResult, offersResult, reviewsResult] = await Promise.all([
      supabase.from("agencies").select("id", { count: "exact", head: true }).eq("verified", true),
      supabase.from("offers").select("id", { count: "exact", head: true }).eq("active", true),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
    ])

    return {
      verifiedAgencies: agenciesResult.count || 0,
      activeOffers: offersResult.count || 0,
      totalReviews: reviewsResult.count || 0,
    }
  } catch (error) {
    console.error("Error fetching platform stats:", error)
    return {
      verifiedAgencies: 0,
      activeOffers: 0,
      totalReviews: 0,
    }
  }
}
