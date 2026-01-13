"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Agency, Offer } from "@/lib/database.types"

export type AgencyWithOffers = Agency & { offers: Offer[] }

export async function getAgencies(options?: { verified?: boolean; limit?: number }) {
  const supabase = await createClient()

  let query = supabase.from("agencies").select("*").eq("status", "active")

  if (options?.verified) {
    query = query.eq("verified", true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order("follower_count", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching agencies:", error)
    return []
  }

  return data as Agency[]
}

export async function getAgencyBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agencies")
    .select(
      `
      *,
      offers(*)
    `,
    )
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching agency:", error)
    return null
  }

  return data as AgencyWithOffers
}

export async function getAgencyById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("agencies").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching agency:", error)
    return null
  }

  return data as Agency
}

export async function followAgency(agencyId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("followed_agencies").insert({
    user_id: user.id,
    agency_id: agencyId,
  })

  if (error) {
    if (error.code === "23505") {
      return { success: true }
    }
    return { error: error.message }
  }

  revalidatePath("/traveler")
  return { success: true }
}

export async function unfollowAgency(agencyId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("followed_agencies").delete().eq("user_id", user.id).eq("agency_id", agencyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/traveler")
  return { success: true }
}

export async function getFollowedAgencies() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("followed_agencies")
    .select(
      `
      agency_id,
      agency:agencies(*)
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching followed agencies:", error)
    return []
  }

  return data.map((item) => item.agency).filter(Boolean) as Agency[]
}

export async function getFollowedAgencyIds() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("followed_agencies").select("agency_id").eq("user_id", user.id)

  if (error) {
    console.error("Error fetching followed agency IDs:", error)
    return []
  }

  return data.map((item) => item.agency_id)
}

export async function updateAgencyProfile(agencyId: string, data: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const agencyData = {
    name: data.name,
    description: data.description,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    specialties: data.specialties || [],
    phone: data.phone,
    email: data.email,
    website: data.website,
    logo: data.logo,
    cover_image: data.cover_image,
  }

  // Remove undefined values
  Object.keys(agencyData).forEach(key => {
    if (agencyData[key as keyof typeof agencyData] === undefined) {
      delete agencyData[key as keyof typeof agencyData]
    }
  })

  const { error } = await supabase.from("agencies").update(agencyData).eq("id", agencyId).eq("owner_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agency/profile")
  return { success: true }
}

export async function requestSubscription(formData: FormData) {
  return submitSubscriptionRequest(formData)
}

export async function submitSubscriptionRequest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const plan = formData.get("plan") as string
  const receiptUrl = formData.get("receiptUrl") as string
  const agencyId = formData.get("agencyId") as string
  const amount = parseFloat(formData.get("amount") as string)

  if (!plan || !receiptUrl || !agencyId) {
    return { error: "Missing required fields" }
  }

  // Check for existing pending request
  const { data: existingRequest } = await supabase
    .from("subscription_requests")
    .select("id")
    .eq("agency_id", agencyId)
    .eq("status", "pending")
    .maybeSingle()

  if (existingRequest) {
    return { error: "لديك طلب اشتراك قيد المراجعة بالفعل" }
  }

  // Create subscription request
  const { error: requestError } = await supabase.from("subscription_requests").insert({
    agency_id: agencyId,
    plan,
    receipt_url: receiptUrl,
    status: "pending",
    submitted_at: new Date().toISOString(),
  })

  if (requestError) {
    return { error: requestError.message }
  }

  // Create subscription history entry
  const { error: historyError } = await supabase.from("subscription_history").insert({
    agency_id: agencyId,
    plan,
    amount,
    currency: "DZD",
    period: "annual",
    status: "pending",
    receipt_url: receiptUrl,
    submitted_at: new Date().toISOString(),
  })

  if (historyError) {
    console.error("Error creating subscription history:", historyError)
  }

  // Update agency subscription status to pending
  const { error: updateError } = await supabase
    .from("agencies")
    .update({
      subscription_plan: plan,
      subscription_status: "pending",
      subscription_receipt_url: receiptUrl,
      subscription_submitted_at: new Date().toISOString(),
      subscription_amount: amount,
      subscription_currency: "DZD",
      subscription_period: "annual",
    })
    .eq("id", agencyId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath("/agency/subscription")
  return { success: true }
}

export async function createAgency(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check if agency already exists
  const { data: existingAgency } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle()

  if (existingAgency) {
    return { error: "Agency already exists" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string

  if (!name || !description || !location) {
    return { error: "All fields are required" }
  }

  // Generate slug from name
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() +
    "-" +
    Math.random().toString(36).substring(2, 7)

  try {
    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .insert({
        owner_id: user.id,
        name,
        slug,
        description,
        location,
        status: "active",
        subscription_status: "none",
        subscription_plan: null, // No subscription plan initially
        verified: false,
        rating: 0,
        review_count: 0,
        follower_count: 0,
        offer_count: 0,
        offer_limit: 0, // No offers until they subscribe
      })
      .select()
      .single()

    if (agencyError) {
      console.error("[v0] Agency creation error:", agencyError)
      return { error: agencyError.message }
    }

    revalidatePath("/agency")
    return { success: true, agencyId: agency.id }
  } catch (err: any) {
    console.error("[v0] Setup error:", err)
    return { error: err.message || "Failed to create agency" }
  }
}

export async function getAgencyDashboardData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    // Get agency data
    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle()

    if (agencyError || !agency) {
      console.error("[v0] Error fetching agency:", agencyError)
      return null
    }

    // Get agency offers
    const { data: offers, error: offersError } = await supabase
      .from("offers")
      .select("id, title, view_count, rating, active, created_at")
      .eq("agency_id", agency.id)
      .order("view_count", { ascending: false })
      .limit(5)

    if (offersError) {
      console.error("[v0] Error fetching offers:", offersError)
    }

    // Calculate stats
    const { data: allOffers } = await supabase.from("offers").select("id, view_count, saved_count").eq("agency_id", agency.id)

    const totalViews = allOffers?.reduce((sum, o) => sum + (o.view_count || 0), 0) || 0
    const totalSaves = allOffers?.reduce((sum, o) => sum + (o.saved_count || 0), 0) || 0

    // Get conversations for agency - using service role to bypass RLS
    const { createClient: createServiceClient } = await import("@supabase/supabase-js")
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all conversations where user is a participant
    const { data: participations } = await serviceSupabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id)

    const conversationIds = participations?.map((p) => p.conversation_id) || []

    let unreadMessages = 0
    if (conversationIds.length > 0) {
      // Count unread messages in each conversation
      for (const participant of participations || []) {
        const { count } = await serviceSupabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", participant.conversation_id)
          .neq("sender_id", user.id)
          .gt("created_at", participant.last_read_at || "1970-01-01")

        unreadMessages += count || 0
      }
    }

    // Get follower count - use the stored value from agency table
    const followersCount = agency.follower_count || 0

    // Get recent messages - using service role
    const { data: recentMessages } = await serviceSupabase
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        sender_id,
        sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
      `,
      )
      .in("conversation_id", conversationIds)
      .neq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    const stats = {
      totalViews,
      totalSaves,
      unreadMessages,
      followersCount,
      offersCount: allOffers?.length || 0,
      maxOffers: agency.offer_limit || 0,
    }

    return {
      agency,
      offers: offers || [],
      stats,
      recentMessages: recentMessages || [],
    }
  } catch (error) {
    console.error("[v0] Dashboard data error:", error)
    return null
  }
}

export async function getCurrentUserAgency() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: agency, error } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle()

  if (error) {
    console.error("Error fetching current user agency:", error)
    return null
  }

  return agency as Agency | null
}
