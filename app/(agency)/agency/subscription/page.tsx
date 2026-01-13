import type { Metadata } from "next"
import { SubscriptionManagement } from "@/components/agency/subscription"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Subscription - SAFRGO Agency",
  description: "Manage your subscription plan",
}

export default async function SubscriptionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: agency } = await supabase.from("agencies").select("*").eq("owner_id", user.id).single()

  if (!agency) {
    redirect("/agency-setup")
  }

  // Get pending subscription request
  const { data: pendingRequest } = await supabase
    .from("subscription_requests")
    .select("*")
    .eq("agency_id", agency.id)
    .eq("status", "pending")
    .single()

  return <SubscriptionManagement agency={agency} pendingRequest={pendingRequest} />
}
