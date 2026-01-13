// Offer service - manages travel offers

import { store } from "@/lib/store"
import type { Offer, Agency } from "@/lib/types"
import { agencyService } from "./agencies"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface OfferWithAgency extends Offer {
  agency: Agency
}

export const offerService = {
  // Get all active offers with agency data
  getAllOffers(filters?: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
  }): OfferWithAgency[] {
    let offers = store.offers
      .filter((o) => o.active)
      .map((o) => ({
        ...o,
        agency: store.agencies.find((a) => a.id === o.agencyId)!,
      }))
      .filter((o) => o.agency && o.agency.status === "active")

    if (filters?.category && filters.category !== "all") {
      offers = offers.filter((o) => o.category.toLowerCase() === filters.category?.toLowerCase())
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      offers = offers.filter(
        (o) =>
          o.title.toLowerCase().includes(search) ||
          o.destination.toLowerCase().includes(search) ||
          o.country.toLowerCase().includes(search),
      )
    }

    if (filters?.minPrice !== undefined) {
      offers = offers.filter((o) => o.price >= filters.minPrice!)
    }

    if (filters?.maxPrice !== undefined) {
      offers = offers.filter((o) => o.price <= filters.maxPrice!)
    }

    // Sort
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          offers.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          offers.sort((a, b) => b.price - a.price)
          break
        case "rating":
          offers.sort((a, b) => b.rating - a.rating)
          break
        default:
          offers.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }
    }

    return offers
  },

  // Get featured offers
  getFeaturedOffers(limit = 4): OfferWithAgency[] {
    return this.getAllOffers()
      .filter((o) => o.featured)
      .slice(0, limit)
  },

  // Get offer by ID
  getOfferById(offerId: string): OfferWithAgency | null {
    const offer = store.offers.find((o) => o.id === offerId)
    if (!offer) return null

    const agency = store.agencies.find((a) => a.id === offer.agencyId)
    if (!agency) return null

    return { ...offer, agency }
  },

  // Increment view count
  async incrementViewCount(offerId: string): Promise<void> {
    const offer = store.offers.find((o) => o.id === offerId)
    if (offer) {
      offer.viewCount++
    }
  },

  // Get offers by agency
  getOffersByAgency(agencyId: string): Offer[] {
    return store.offers.filter((o) => o.agencyId === agencyId)
  },

  // Get current agency's offers
  getCurrentAgencyOffers(): Offer[] {
    const agency = agencyService.getCurrentAgency()
    if (!agency) return []
    return this.getOffersByAgency(agency.id)
  },

  // Create new offer
  async createOffer(
    data: Omit<Offer, "id" | "agencyId" | "rating" | "reviewCount" | "savedCount" | "viewCount" | "createdAt">,
  ): Promise<{ success: boolean; offer?: Offer; error?: string }> {
    await delay(800)

    const canCreate = agencyService.canCreateOffer()
    if (!canCreate.allowed) {
      return { success: false, error: canCreate.reason }
    }

    const agency = agencyService.getCurrentAgency()!

    const newOffer: Offer = {
      id: store.generateId("offer"),
      agencyId: agency.id,
      rating: 0,
      reviewCount: 0,
      savedCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      ...data,
    }

    store.offers.push(newOffer)

    // Update agency offer count
    const agencyIndex = store.agencies.findIndex((a) => a.id === agency.id)
    if (agencyIndex !== -1) {
      store.agencies[agencyIndex].offerCount++
    }

    return { success: true, offer: newOffer }
  },

  // Update offer
  async updateOffer(
    offerId: string,
    updates: Partial<Omit<Offer, "id" | "agencyId" | "createdAt">>,
  ): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const agency = agencyService.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Not logged in as agency" }
    }

    const offerIndex = store.offers.findIndex((o) => o.id === offerId && o.agencyId === agency.id)
    if (offerIndex === -1) {
      return { success: false, error: "Offer not found or not owned by you" }
    }

    store.offers[offerIndex] = {
      ...store.offers[offerIndex],
      ...updates,
    }

    return { success: true }
  },

  // Toggle offer active status
  async toggleOfferActive(offerId: string): Promise<{ success: boolean; active?: boolean; error?: string }> {
    await delay(300)

    const agency = agencyService.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Not logged in as agency" }
    }

    const offer = store.offers.find((o) => o.id === offerId && o.agencyId === agency.id)
    if (!offer) {
      return { success: false, error: "Offer not found or not owned by you" }
    }

    offer.active = !offer.active

    return { success: true, active: offer.active }
  },

  // Delete offer
  async deleteOffer(offerId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const agency = agencyService.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Not logged in as agency" }
    }

    const offerIndex = store.offers.findIndex((o) => o.id === offerId && o.agencyId === agency.id)
    if (offerIndex === -1) {
      return { success: false, error: "Offer not found or not owned by you" }
    }

    store.offers.splice(offerIndex, 1)

    // Update agency offer count
    const agencyIndex = store.agencies.findIndex((a) => a.id === agency.id)
    if (agencyIndex !== -1) {
      store.agencies[agencyIndex].offerCount = Math.max(0, store.agencies[agencyIndex].offerCount - 1)
    }

    return { success: true }
  },

  // Get related offers (same category or destination)
  getRelatedOffers(offerId: string, limit = 4): OfferWithAgency[] {
    const offer = this.getOfferById(offerId)
    if (!offer) return []

    return this.getAllOffers()
      .filter((o) => o.id !== offerId && (o.category === offer.category || o.destination === offer.destination))
      .slice(0, limit)
  },
}
