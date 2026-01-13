import type React from "react"
import { AgencySidebar } from "@/components/agency/agency-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUnreadCount } from "@/lib/actions/chat"

export default async function AgencyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!agency) {
    redirect("/agency-setup")
  }

  if (agencyError) {
    console.error("[v0] Agency fetch error:", agencyError)
    redirect("/agency-setup")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  let unreadCount = 0
  try {
    unreadCount = await getUnreadCount()
  } catch (error) {
    console.error("[v0] Failed to get unread count:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AgencySidebar agency={agency} profile={profile!} unreadCount={unreadCount} />
      <main className="lg:ml-64">{children}</main>
    </div>
  )
}
