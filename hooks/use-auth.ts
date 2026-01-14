"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile, Agency } from "@/lib/database.types"

export type UserRole = "traveler" | "agency" | "admin"

export interface AuthUser extends User {
  profile?: Profile
  agency?: Agency
}

export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const supabase = useMemo(() => createClient(), [])

  // Fetch user profile and agency data
  const fetchUserData = useCallback(
    async (userId: string) => {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

      if (profileData) {
        setProfile(profileData)

        // If user is an agency, fetch agency data
        if (profileData.role === "agency") {
          const { data: agencyData } = await supabase.from("agencies").select("*").eq("owner_id", userId).maybeSingle()

          if (agencyData) {
            setAgency(agencyData)
          }
        }
      }

      return profileData
    },
    [supabase],
  )

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser(authUser as AuthUser)
        await fetchUserData(authUser.id)
      }

      setIsLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user as AuthUser)
        await fetchUserData(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        setAgency(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchUserData])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      if (data.user) {
        setUser(data.user as AuthUser)
        const profileData = await fetchUserData(data.user.id)

        // Determine redirect based on role
        let redirectTo = "/traveler"
        if (profileData?.role === "agency") {
          redirectTo = "/agency"
        } else if (profileData?.role === "admin") {
          redirectTo = "/admin"
        }

        router.push(redirectTo)

        return {
          success: true,
          redirectTo,
        }
      }

      return { success: false, error: "Login failed" }
    },
    [supabase, router, fetchUserData],
  )

  const signup = useCallback(
    async (data: {
      name: string
      email: string
      password: string
      role: "traveler" | "agency"
      agencyName?: string
    }): Promise<AuthResult> => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            agency_name: data.agencyName,
          },
        },
      })

      if (authError) {
        return {
          success: false,
          error: authError.message,
        }
      }

      if (authData.user) {
        // Auto-login and redirect to dashboard immediately
        const redirectTo = data.role === "agency" ? "/agency" : "/traveler"
        router.push(redirectTo)
        
        return {
          success: true,
          redirectTo,
        }
      }

      return {
        success: false,
        error: "Signup failed",
      }
    },
    [supabase, router],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setAgency(null)
    router.push("/")
  }, [supabase, router])

  const checkRole = useCallback(
    (role: UserRole) => {
      return profile?.role === role
    },
    [profile],
  )

  return {
    user,
    profile,
    agency,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkRole,
    role: profile?.role as UserRole | undefined,
  }
}
