// Authentication service - handles login, signup, and session management

import { store } from "@/lib/store"
import type { User, UserRole, TravelerProfile, AgencyProfile, Agency } from "@/lib/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  role: "traveler" | "agency"
  agencyName?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  redirectTo?: string
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(800) // Simulate network delay

    const user = store.users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password,
    )

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password. Try demo@safrgo.com / password",
      }
    }

    // Set current session
    store.currentUserId = user.id

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("safrgo_user_id", user.id)
      localStorage.setItem("safrgo_user_role", user.role)
    }

    // Determine redirect based on role
    let redirectTo = "/traveler"
    if (user.role === "agency") {
      redirectTo = "/agency"
    } else if (user.role === "admin") {
      redirectTo = "/admin"
    }

    return {
      success: true,
      user,
      redirectTo,
    }
  },

  async signup(data: SignupData): Promise<AuthResult> {
    await delay(1000)

    // Check if email already exists
    const existingUser = store.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      }
    }

    // Create new user
    const userId = store.generateId("user")
    const newUser: User = {
      id: userId,
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(data.name)} avatar`,
      role: data.role,
      createdAt: new Date().toISOString(),
    }

    store.users.push(newUser)

    // Create role-specific profile
    if (data.role === "traveler") {
      const travelerProfile: TravelerProfile = {
        ...newUser,
        role: "traveler",
        savedOffers: [],
        followedAgencies: [],
      }
      store.travelerProfiles[userId] = travelerProfile
    } else if (data.role === "agency" && data.agencyName) {
      // Create agency
      const agencyId = store.generateId("agency")
      const newAgency: Agency = {
        id: agencyId,
        ownerId: userId,
        name: data.agencyName,
        slug: data.agencyName.toLowerCase().replace(/\s+/g, "-"),
        logo: `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(data.agencyName)} logo`,
        coverImage: `/placeholder.svg?height=400&width=800&query=travel agency cover`,
        description: "",
        location: "",
        rating: 0,
        reviewCount: 0,
        verified: false,
        specialties: [],
        followerCount: 0,
        offerCount: 0,
        responseTime: "< 24 hours",
        joinedDate: new Date().toISOString().split("T")[0],
        status: "pending",
        subscription: {
          plan: null,
          status: "none",
          expiresAt: null,
          receiptUrl: null,
          submittedAt: null,
        },
        offerLimit: 0,
      }
      store.agencies.push(newAgency)

      const agencyProfile: AgencyProfile = {
        ...newUser,
        role: "agency",
        agencyId,
      }
      store.agencyProfiles[userId] = agencyProfile
    }

    // Set current session
    store.currentUserId = userId

    if (typeof window !== "undefined") {
      localStorage.setItem("safrgo_user_id", userId)
      localStorage.setItem("safrgo_user_role", data.role)
    }

    return {
      success: true,
      user: newUser,
      redirectTo: data.role === "agency" ? "/agency" : "/traveler",
    }
  },

  async logout(): Promise<void> {
    store.currentUserId = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("safrgo_user_id")
      localStorage.removeItem("safrgo_user_role")
    }
  },

  getCurrentUser(): User | null {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("safrgo_user_id")
      if (storedId) {
        store.currentUserId = storedId
      }
    }

    if (!store.currentUserId) return null
    return store.users.find((u) => u.id === store.currentUserId) || null
  },

  getCurrentUserRole(): UserRole | null {
    const user = this.getCurrentUser()
    return user?.role || null
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },

  hasRole(role: UserRole): boolean {
    return this.getCurrentUserRole() === role
  },
}
