// User service - manages traveler profiles and interactions

import { store } from "@/lib/store"
import type { TravelerProfile, User } from "@/lib/types"
import { authService } from "./auth"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const userService = {
  // Get current traveler profile
  getCurrentTravelerProfile(): TravelerProfile | null {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "traveler") return null
    return store.travelerProfiles[user.id] || null
  },

  // Get user by ID
  getUserById(userId: string): User | null {
    return store.users.find((u) => u.id === userId) || null
  },

  // Save/Unsave an offer
  async toggleSaveOffer(offerId: string): Promise<{ saved: boolean; error?: string }> {
    await delay(300)

    const profile = this.getCurrentTravelerProfile()
    if (!profile) {
      return { saved: false, error: "Not logged in as traveler" }
    }

    const index = profile.savedOffers.indexOf(offerId)
    const offer = store.offers.find((o) => o.id === offerId)

    if (index === -1) {
      // Save
      profile.savedOffers.push(offerId)
      if (offer) offer.savedCount++
      return { saved: true }
    } else {
      // Unsave
      profile.savedOffers.splice(index, 1)
      if (offer) offer.savedCount = Math.max(0, offer.savedCount - 1)
      return { saved: false }
    }
  },

  // Check if offer is saved
  isOfferSaved(offerId: string): boolean {
    const profile = this.getCurrentTravelerProfile()
    if (!profile) return false
    return profile.savedOffers.includes(offerId)
  },

  // Get saved offers
  getSavedOffers() {
    const profile = this.getCurrentTravelerProfile()
    if (!profile) return []
    return store.offers.filter((o) => profile.savedOffers.includes(o.id) && o.active)
  },

  // Follow/Unfollow an agency
  async toggleFollowAgency(agencyId: string): Promise<{ following: boolean; error?: string }> {
    await delay(300)

    const profile = this.getCurrentTravelerProfile()
    if (!profile) {
      return { following: false, error: "Not logged in as traveler" }
    }

    const index = profile.followedAgencies.indexOf(agencyId)
    const agency = store.agencies.find((a) => a.id === agencyId)

    if (index === -1) {
      // Follow
      profile.followedAgencies.push(agencyId)
      if (agency) agency.followerCount++
      return { following: true }
    } else {
      // Unfollow
      profile.followedAgencies.splice(index, 1)
      if (agency) agency.followerCount = Math.max(0, agency.followerCount - 1)
      return { following: false }
    }
  },

  // Check if following agency
  isFollowingAgency(agencyId: string): boolean {
    const profile = this.getCurrentTravelerProfile()
    if (!profile) return false
    return profile.followedAgencies.includes(agencyId)
  },

  // Get followed agencies
  getFollowedAgencies() {
    const profile = this.getCurrentTravelerProfile()
    if (!profile) return []
    return store.agencies.filter((a) => profile.followedAgencies.includes(a.id) && a.status === "active")
  },

  // Update traveler profile
  async updateProfile(updates: Partial<Pick<User, "name" | "avatar">>): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const user = authService.getCurrentUser()
    if (!user) {
      return { success: false, error: "Not logged in" }
    }

    // Update user
    const userIndex = store.users.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      store.users[userIndex] = { ...store.users[userIndex], ...updates }
    }

    // Update profile if traveler
    if (user.role === "traveler" && store.travelerProfiles[user.id]) {
      store.travelerProfiles[user.id] = {
        ...store.travelerProfiles[user.id],
        ...updates,
      }
    }

    return { success: true }
  },

  // Get traveler stats
  getStats() {
    const profile = this.getCurrentTravelerProfile()
    if (!profile) {
      return { savedOffers: 0, followedAgencies: 0, destinations: 0 }
    }

    const savedOfferDestinations = new Set(
      store.offers.filter((o) => profile.savedOffers.includes(o.id)).map((o) => o.destination),
    )

    return {
      savedOffers: profile.savedOffers.length,
      followedAgencies: profile.followedAgencies.length,
      destinations: savedOfferDestinations.size,
    }
  },
}
