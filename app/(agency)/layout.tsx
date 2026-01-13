import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      redirect("/login")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError || !profile) {
      console.error("[v0] Profile fetch error:", profileError)
      redirect("/login")
    }

    if (profile.role !== "agency") {
      redirect("/traveler")
    }

    const { data: agency } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle()

    if (!agency) {
      redirect("/agency-setup")
    }
  } catch (error) {
    console.error("[v0] Agency layout error:", error)
    redirect("/login")
  }

  return <>{children}</>
}
