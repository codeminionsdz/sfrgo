// Admin service - platform management

import { store } from "@/lib/store"
import { agencyService } from "./agencies"

export const adminService = {
  // Get platform stats
  getStats() {
    const totalAgencies = store.agencies.length
    const activeAgencies = store.agencies.filter((a) => a.status === "active").length
    const pendingAgencies = store.agencies.filter((a) => a.status === "pending").length
    const verifiedAgencies = store.agencies.filter((a) => a.verified).length

    const totalUsers = store.users.filter((u) => u.role === "traveler").length
    const totalOffers = store.offers.filter((o) => o.active).length

    const pendingSubscriptions = store.subscriptionRequests.filter((r) => r.status === "pending").length
    const pendingVerifications = store.verificationRequests.filter((r) => r.status === "pending").length

    // Calculate revenue (mock)
    const monthlyRevenue = store.agencies
      .filter((a) => a.subscription.status === "active")
      .reduce((sum, a) => {
        const planPrices: Record<string, number> = { starter: 49, premium: 99, enterprise: 199 }
        return sum + (planPrices[a.subscription.plan || ""] || 0)
      }, 0)

    return {
      totalAgencies,
      activeAgencies,
      pendingAgencies,
      verifiedAgencies,
      totalUsers,
      totalOffers,
      pendingSubscriptions,
      pendingVerifications,
      monthlyRevenue,
    }
  },

  // Get all agencies with filters
  getAgencies(filters?: { status?: string; search?: string }) {
    return agencyService.getAllAgencies(filters)
  },

  // Get pending subscription requests
  getPendingSubscriptions() {
    return agencyService.getPendingSubscriptionRequests()
  },

  // Get pending verifications
  getPendingVerifications() {
    return agencyService.getPendingVerificationRequests()
  },

  // Approve subscription
  approveSubscription(requestId: string) {
    return agencyService.approveSubscription(requestId)
  },

  // Reject subscription
  rejectSubscription(requestId: string, notes?: string) {
    return agencyService.rejectSubscription(requestId, notes)
  },

  // Approve verification
  approveVerification(requestId: string) {
    return agencyService.approveVerification(requestId)
  },

  // Suspend agency
  suspendAgency(agencyId: string) {
    return agencyService.suspendAgency(agencyId)
  },

  // Activate agency
  activateAgency(agencyId: string) {
    return agencyService.activateAgency(agencyId)
  },

  // Get recent activity (mock)
  getRecentActivity() {
    const activities = [
      { type: "subscription", text: "Beach Bliss Travel submitted subscription request", time: "2 hours ago" },
      { type: "signup", text: "New agency registered: Nordic Adventures", time: "5 hours ago" },
      { type: "verification", text: "Coastal Adventures requested verification", time: "1 day ago" },
    ]
    return activities
  },
}
