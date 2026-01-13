"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Offer, Agency } from "@/lib/database.types"

export type OfferWithAgency = Offer & { agency: Agency }

export async function getOffers(options?: {
  category?: string
  search?: string
  limit?: number
  featured?: boolean
}) {
  const supabase = await createClient()

  let query = supabase
    .from("offers")
    .select(
      `
      *,
      agency:agencies(*)
    `,
    )
    .eq("active", true)

  if (options?.category && options.category !== "all") {
    query = query.ilike("category", options.category)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,destination.ilike.%${options.search}%`)
  }

  if (options?.featured) {
    query = query.eq("featured", true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching offers:", error)
    return []
  }

  const filteredOffers = (data as OfferWithAgency[]).filter((offer) => {
    return offer.agency && offer.agency.status === "active" && offer.agency.subscription_status === "active"
  })

  return filteredOffers
}

export async function getOfferById(id: string) {
  const supabase = await createClient()

  // Increment view count (ignore errors)
  try {
    await supabase.rpc("increment_offer_views", { offer_id: id })
  } catch (error) {
    // Ignore errors for view count
  }

  const { data, error } = await supabase
    .from("offers")
    .select(
      `
      *,
      agency:agencies(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching offer:", error)
    return null
  }

  return data as OfferWithAgency
}

export async function saveOffer(offerId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("saved_offers").insert({
    user_id: user.id,
    offer_id: offerId,
  })

  if (error) {
    if (error.code === "23505") {
      // Already saved
      return { success: true }
    }
    return { error: error.message }
  }

  revalidatePath("/traveler")
  revalidatePath("/traveler/saved")
  return { success: true }
}

export async function unsaveOffer(offerId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("saved_offers").delete().eq("user_id", user.id).eq("offer_id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/traveler")
  revalidatePath("/traveler/saved")
  return { success: true }
}

export async function getSavedOffers() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("saved_offers")
    .select(
      `
      offer_id,
      offer:offers(
        *,
        agency:agencies(*)
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching saved offers:", error)
    return []
  }

  return data.map((item) => item.offer).filter(Boolean) as OfferWithAgency[]
}

export async function getSavedOfferIds() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("saved_offers").select("offer_id").eq("user_id", user.id)

  if (error) {
    console.error("Error fetching saved offer IDs:", error)
    return []
  }

  return data.map((item) => item.offer_id)
}

export async function createOffer(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get agency
  const { data: agency } = await supabase
    .from("agencies")
    .select("id, status, subscription_status, offer_limit, offer_count")
    .eq("owner_id", user.id)
    .single()

  if (!agency) {
    return { error: "Agency not found" }
  }

  if (agency.status !== "active") {
    return { error: "Your agency must be approved by admin before creating offers" }
  }

  if (agency.subscription_status !== "active") {
    return { error: "You need an active subscription to create offers" }
  }

  // Check offer limit
  if (agency.offer_count >= agency.offer_limit) {
    return { error: "Offer limit reached. Please upgrade your subscription." }
  }

  const offerData = {
    agency_id: agency.id,
    title: formData.get("title") as string,
    destination: formData.get("destination") as string,
    country: formData.get("country") as string,
    image: formData.get("image") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    price: Number.parseFloat(formData.get("price") as string),
    original_price: formData.get("originalPrice") ? Number.parseFloat(formData.get("originalPrice") as string) : null,
    currency: (formData.get("currency") as string) || "USD",
    duration: formData.get("duration") as string,
    description: formData.get("description") as string,
    highlights: JSON.parse((formData.get("highlights") as string) || "[]"),
    included: JSON.parse((formData.get("included") as string) || "[]"),
    not_included: JSON.parse((formData.get("notIncluded") as string) || "[]"),
    category: formData.get("category") as string,
    departure_date: formData.get("departureDate") as string,
    max_group_size: formData.get("maxGroupSize") ? Number.parseInt(formData.get("maxGroupSize") as string) : null,
    active: true,
  }

  const { error } = await supabase.from("offers").insert(offerData)

  if (error) {
    return { error: error.message }
  }

  // Manually update offer_count as a fallback (triggers should handle this)
  await supabase.rpc('increment_offer_count', { agency_id: agency.id })

  revalidatePath("/agency/offers")
  return { success: true }
}

export async function updateOffer(offerId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const offerData = {
    title: formData.get("title") as string,
    destination: formData.get("destination") as string,
    country: formData.get("country") as string,
    image: formData.get("image") as string,
    images: JSON.parse((formData.get("images") as string) || "[]"),
    price: Number.parseFloat(formData.get("price") as string),
    original_price: formData.get("originalPrice") ? Number.parseFloat(formData.get("originalPrice") as string) : null,
    currency: (formData.get("currency") as string) || "USD",
    duration: formData.get("duration") as string,
    description: formData.get("description") as string,
    highlights: JSON.parse((formData.get("highlights") as string) || "[]"),
    included: JSON.parse((formData.get("included") as string) || "[]"),
    not_included: JSON.parse((formData.get("notIncluded") as string) || "[]"),
    category: formData.get("category") as string,
    departure_date: formData.get("departureDate") as string,
    max_group_size: formData.get("maxGroupSize") ? Number.parseInt(formData.get("maxGroupSize") as string) : null,
    active: formData.get("active") === "true",
  }

  const { error } = await supabase.from("offers").update(offerData).eq("id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agency/offers")
  return { success: true }
}

export async function deleteOffer(offerId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("offers").delete().eq("id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agency/offers")
  return { success: true }
}

export async function toggleOfferActive(offerId: string, active: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("offers").update({ active }).eq("id", offerId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agency/offers")
  return { success: true }
}
