// Agency service - manages agency profiles and operations

import { store } from "@/lib/store"
import type { Agency, SubscriptionPlan, SubscriptionRequest, VerificationRequest } from "@/lib/types"
import { authService } from "./auth"
import { PLAN_LIMITS } from "@/lib/types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const agencyService = {
  // Get all agencies (for browsing)
  getAllAgencies(filters?: { status?: string; verified?: boolean }): Agency[] {
    let agencies = store.agencies

    if (filters?.status && filters.status !== "all") {
      agencies = agencies.filter((a) => a.status === filters.status)
    }

    if (filters?.verified !== undefined) {
      agencies = agencies.filter((a) => a.verified === filters.verified)
    }

    return agencies
  },

  // Get active agencies only (for public viewing)
  getActiveAgencies(): Agency[] {
    return store.agencies.filter((a) => a.status === "active")
  },

  // Get agency by ID
  getAgencyById(agencyId: string): Agency | null {
    return store.agencies.find((a) => a.id === agencyId) || null
  },

  // Get agency by slug
  getAgencyBySlug(slug: string): Agency | null {
    return store.agencies.find((a) => a.slug === slug) || null
  },

  // Get current user's agency (for agency dashboard)
  getCurrentAgency(): Agency | null {
    const user = authService.getCurrentUser()
    if (!user || user.role !== "agency") return null

    const profile = store.agencyProfiles[user.id]
    if (!profile) return null

    return this.getAgencyById(profile.agencyId)
  },

  // Update agency profile
  async updateAgencyProfile(
    updates: Partial<Pick<Agency, "name" | "description" | "location" | "logo" | "coverImage" | "specialties">>,
  ): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const agency = this.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Agency not found" }
    }

    const index = store.agencies.findIndex((a) => a.id === agency.id)
    if (index !== -1) {
      store.agencies[index] = {
        ...store.agencies[index],
        ...updates,
        slug: updates.name ? updates.name.toLowerCase().replace(/\s+/g, "-") : store.agencies[index].slug,
      }
    }

    return { success: true }
  },

  // Check if agency can create offers
  canCreateOffer(): { allowed: boolean; reason?: string } {
    const agency = this.getCurrentAgency()
    if (!agency) {
      return { allowed: false, reason: "Agency not found" }
    }

    if (agency.status !== "active") {
      return { allowed: false, reason: "Your agency is not active. Please wait for admin approval." }
    }

    if (agency.subscription.status !== "active") {
      return { allowed: false, reason: "You need an active subscription to create offers." }
    }

    const currentOfferCount = store.offers.filter((o) => o.agencyId === agency.id).length
    if (currentOfferCount >= agency.offerLimit) {
      return {
        allowed: false,
        reason: `You've reached your offer limit (${agency.offerLimit}). Upgrade your plan for more.`,
      }
    }

    return { allowed: true }
  },

  // Submit subscription request
  async submitSubscription(plan: SubscriptionPlan, receiptUrl: string): Promise<{ success: boolean; error?: string }> {
    await delay(800)

    const agency = this.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Agency not found" }
    }

    // Create subscription request
    const request: SubscriptionRequest = {
      id: store.generateId("sub"),
      agencyId: agency.id,
      plan,
      receiptUrl,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    store.subscriptionRequests.push(request)

    // Update agency subscription status
    const index = store.agencies.findIndex((a) => a.id === agency.id)
    if (index !== -1) {
      store.agencies[index].subscription = {
        plan,
        status: "pending",
        expiresAt: null,
        receiptUrl,
        submittedAt: new Date().toISOString(),
      }
    }

    return { success: true }
  },

  // Submit verification request
  async submitVerification(documents: string[]): Promise<{ success: boolean; error?: string }> {
    await delay(800)

    const agency = this.getCurrentAgency()
    if (!agency) {
      return { success: false, error: "Agency not found" }
    }

    const request: VerificationRequest = {
      id: store.generateId("ver"),
      agencyId: agency.id,
      documents,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }

    store.verificationRequests.push(request)

    return { success: true }
  },

  // Get agency stats
  getAgencyStats() {
    const agency = this.getCurrentAgency()
    if (!agency) return null

    const agencyOffers = store.offers.filter((o) => o.agencyId === agency.id)
    const totalViews = agencyOffers.reduce((sum, o) => sum + o.viewCount, 0)
    const totalSaves = agencyOffers.reduce((sum, o) => sum + o.savedCount, 0)

    // Count messages
    const conversations = store.conversations.filter((c) => c.participants.includes(agency.id))
    const messageCount = store.messages.filter((m) => conversations.some((c) => c.id === m.conversationId)).length

    return {
      profileViews: Math.floor(totalViews * 0.3), // Simulated
      totalSaves,
      messageCount,
      followerCount: agency.followerCount,
      offerCount: agencyOffers.length,
      offerLimit: agency.offerLimit,
    }
  },

  // Get subscription info
  getSubscriptionInfo() {
    const agency = this.getCurrentAgency()
    if (!agency) return null

    return {
      ...agency.subscription,
      offerCount: store.offers.filter((o) => o.agencyId === agency.id).length,
      offerLimit: agency.offerLimit,
    }
  },

  // Get pending subscription requests (admin)
  getPendingSubscriptionRequests(): (SubscriptionRequest & { agency: Agency })[] {
    return store.subscriptionRequests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        ...r,
        agency: this.getAgencyById(r.agencyId)!,
      }))
      .filter((r) => r.agency)
  },

  // Get pending verification requests (admin)
  getPendingVerificationRequests(): (VerificationRequest & { agency: Agency })[] {
    return store.verificationRequests
      .filter((r) => r.status === "pending")
      .map((r) => ({
        ...r,
        agency: this.getAgencyById(r.agencyId)!,
      }))
      .filter((r) => r.agency)
  },

  // Approve subscription (admin)
  async approveSubscription(requestId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const request = store.subscriptionRequests.find((r) => r.id === requestId)
    if (!request) {
      return { success: false, error: "Request not found" }
    }

    // Update request
    request.status = "approved"
    request.reviewedAt = new Date().toISOString()
    request.reviewedBy = authService.getCurrentUser()?.id

    // Update agency
    const agencyIndex = store.agencies.findIndex((a) => a.id === request.agencyId)
    if (agencyIndex !== -1) {
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      store.agencies[agencyIndex].subscription = {
        plan: request.plan,
        status: "active",
        expiresAt: expiresAt.toISOString(),
        receiptUrl: request.receiptUrl,
        submittedAt: request.submittedAt,
      }
      store.agencies[agencyIndex].offerLimit = PLAN_LIMITS[request.plan].offers
      store.agencies[agencyIndex].status = "active"
    }

    return { success: true }
  },

  // Reject subscription (admin)
  async rejectSubscription(requestId: string, notes?: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const request = store.subscriptionRequests.find((r) => r.id === requestId)
    if (!request) {
      return { success: false, error: "Request not found" }
    }

    request.status = "rejected"
    request.reviewedAt = new Date().toISOString()
    request.reviewedBy = authService.getCurrentUser()?.id
    request.notes = notes

    // Update agency
    const agencyIndex = store.agencies.findIndex((a) => a.id === request.agencyId)
    if (agencyIndex !== -1) {
      store.agencies[agencyIndex].subscription.status = "rejected"
    }

    return { success: true }
  },

  // Approve verification (admin)
  async approveVerification(requestId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const request = store.verificationRequests.find((r) => r.id === requestId)
    if (!request) {
      return { success: false, error: "Request not found" }
    }

    request.status = "approved"
    request.reviewedAt = new Date().toISOString()
    request.reviewedBy = authService.getCurrentUser()?.id

    // Update agency
    const agencyIndex = store.agencies.findIndex((a) => a.id === request.agencyId)
    if (agencyIndex !== -1) {
      store.agencies[agencyIndex].verified = true
    }

    return { success: true }
  },

  // Suspend agency (admin)
  async suspendAgency(agencyId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const index = store.agencies.findIndex((a) => a.id === agencyId)
    if (index === -1) {
      return { success: false, error: "Agency not found" }
    }

    store.agencies[index].status = "suspended"

    return { success: true }
  },

  // Activate agency (admin)
  async activateAgency(agencyId: string): Promise<{ success: boolean; error?: string }> {
    await delay(500)

    const index = store.agencies.findIndex((a) => a.id === agencyId)
    if (index === -1) {
      return { success: false, error: "Agency not found" }
    }

    store.agencies[index].status = "active"

    return { success: true }
  },
}
