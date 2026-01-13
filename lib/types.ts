// Core types for SAFRGO application

export type UserRole = "traveler" | "agency" | "admin"

export type OfferType = "travel" | "umrah" | "hajj"

export type SubscriptionStatus = "none" | "pending" | "active" | "expired" | "rejected"

export type SubscriptionPlan = "starter" | "premium" | "enterprise"

export type AgencyStatus = "pending" | "active" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  password: string // In real app, this would be hashed
  avatar: string
  role: UserRole
  createdAt: string
}

export interface TravelerProfile extends User {
  role: "traveler"
  savedOffers: string[]
  followedAgencies: string[]
}

export interface AgencyProfile extends User {
  role: "agency"
  agencyId: string
}

export interface AdminProfile extends User {
  role: "admin"
}

export interface Agency {
  id: string
  ownerId: string
  name: string
  slug: string
  logo: string
  coverImage: string
  description: string
  location: string
  rating: number
  reviewCount: number
  verified: boolean
  specialties: string[]
  followerCount: number
  offerCount: number
  responseTime: string
  joinedDate: string
  status: AgencyStatus
  subscription: {
    plan: SubscriptionPlan | null
    status: SubscriptionStatus
    expiresAt: string | null
    receiptUrl: string | null
    submittedAt: string | null
  }
  offerLimit: number
}

export interface Offer {
  id: string
  agencyId: string
  offerType: OfferType
  title: string
  destination: string
  country: string
  image: string
  images: string[]
  price: number
  originalPrice?: number
  currency: string
  duration: string
  description: string
  highlights: string[]
  included: string[]
  notIncluded: string[]
  category: string
  rating: number
  reviewCount: number
  savedCount: number
  viewCount: number
  featured: boolean
  active: boolean
  departureDate?: string
  maxGroupSize?: number
  // Umrah & Hajj specific fields
  season?: string
  accommodationDetails?: string
  transportDetails?: string
  religiousProgram?: string[]
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image"
}

export interface Conversation {
  id: string
  participants: string[] // user IDs
  participantType: "traveler-agency" // For now, only traveler-agency chats
  offerId?: string
  lastMessageAt: string
  createdAt: string
}

export interface VerificationRequest {
  id: string
  agencyId: string
  documents: string[]
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export interface SubscriptionRequest {
  id: string
  agencyId: string
  plan: SubscriptionPlan
  receiptUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

// Plan limits
export const PLAN_LIMITS: Record<SubscriptionPlan, { offers: number; price: number }> = {
  starter: { offers: 10, price: 49 },
  premium: { offers: 50, price: 99 },
  enterprise: { offers: 999999, price: 199 }, // Unlimited
}
