"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const PLAN_LIMITS = {
  starter: 10,
  premium: 50,
  enterprise: 999999,
}

export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalAgencies },
    { count: pendingAgencies },
    { count: activeAgencies },
    { count: totalOffers },
    { count: pendingSubscriptions },
  ] = await Promise.all([
    supabase.from("agencies").select("*", { count: "exact", head: true }),
    supabase.from("agencies").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("agencies").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("offers").select("*", { count: "exact", head: true }),
    supabase.from("subscription_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  return {
    totalAgencies: totalAgencies || 0,
    pendingAgencies: pendingAgencies || 0,
    activeAgencies: activeAgencies || 0,
    totalOffers: totalOffers || 0,
    pendingSubscriptions: pendingSubscriptions || 0,
  }
}

export async function getAllAgencies(filter?: "all" | "pending" | "active" | "suspended") {
  const supabase = await createClient()

  let query = supabase.from("agencies").select(
    `
    *,
    owner:profiles(*)
  `,
  )

  if (filter && filter !== "all") {
    query = query.eq("status", filter)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching agencies:", error)
    return []
  }

  return data
}

export async function getPendingSubscriptions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subscription_requests")
    .select(
      `
      *,
      agency:agencies(*)
    `,
    )
    .eq("status", "pending")
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching subscription requests:", error)
    return []
  }

  return data
}

export async function approveSubscription(requestId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get the request
  const { data: request, error: reqError } = await supabase
    .from("subscription_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (reqError || !request) {
    return { error: "Request not found" }
  }

  // Update request status
  const { error: updateReqError } = await supabase
    .from("subscription_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", requestId)

  if (updateReqError) {
    return { error: updateReqError.message }
  }

  // Update agency subscription
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  const { error: updateAgencyError } = await supabase
    .from("agencies")
    .update({
      subscription_status: "active",
      subscription_expires_at: expiresAt.toISOString(),
      offer_limit: PLAN_LIMITS[request.plan as keyof typeof PLAN_LIMITS],
      status: "active",
    })
    .eq("id", request.agency_id)

  if (updateAgencyError) {
    return { error: updateAgencyError.message }
  }

  revalidatePath("/admin/payments")
  revalidatePath("/admin/agencies")
  return { success: true }
}

export async function rejectSubscription(requestId: string, notes?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get the request
  const { data: request, error: reqError } = await supabase
    .from("subscription_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (reqError || !request) {
    return { error: "Request not found" }
  }

  // Update request status
  const { error: updateReqError } = await supabase
    .from("subscription_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      notes,
    })
    .eq("id", requestId)

  if (updateReqError) {
    return { error: updateReqError.message }
  }

  // Update agency subscription status
  const { error: updateAgencyError } = await supabase
    .from("agencies")
    .update({
      subscription_status: "rejected",
    })
    .eq("id", request.agency_id)

  if (updateAgencyError) {
    return { error: updateAgencyError.message }
  }

  revalidatePath("/admin/payments")
  return { success: true }
}

export async function updateAgencyStatus(agencyId: string, status: "pending" | "active" | "suspended") {
  const supabase = await createClient()

  const { error } = await supabase.from("agencies").update({ status }).eq("id", agencyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/agencies")
  return { success: true }
}

export async function verifyAgency(agencyId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("agencies").update({ verified: true }).eq("id", agencyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/agencies")
  revalidatePath("/admin/verification")
  return { success: true }
}

export async function rejectVerification(agencyId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("agencies").update({ verified: false }).eq("id", agencyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/agencies")
  revalidatePath("/admin/verification")
  return { success: true }
}

export async function getPendingVerifications() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("verification_requests")
    .select(
      `
      *,
      agency:agencies(*)
    `,
    )
    .eq("status", "pending")
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching verification requests:", error)
    return []
  }

  return data
}

export async function approveVerification(requestId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: request } = await supabase
    .from("verification_requests")
    .select("agency_id")
    .eq("id", requestId)
    .single()

  if (!request) {
    return { error: "Request not found" }
  }

  // Update request
  await supabase
    .from("verification_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", requestId)

  // Update agency
  await supabase.from("agencies").update({ verified: true }).eq("id", request.agency_id)

  revalidatePath("/admin/verification")
  return { success: true }
}

export async function suspendAgency(agencyId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("agencies").update({ status: "suspended" }).eq("id", agencyId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/agencies")
  return { success: true }
}

export async function approveOffer(offerId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("offers").update({ status: "published" }).eq("id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/offers")
  return { success: true }
}

export async function rejectOffer(offerId: string, reason?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("offers")
    .update({
      status: "rejected",
      rejection_reason: reason,
    })
    .eq("id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/offers")
  return { success: true }
}
