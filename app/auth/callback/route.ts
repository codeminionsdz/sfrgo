import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Fetch user profile to check role and handle agency creation
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

      // If user is an agency, check if agency exists and create if not
      if (profile?.role === "agency") {
        const { data: existingAgency } = await supabase
          .from("agencies")
          .select("id")
          .eq("owner_id", data.user.id)
          .single()

        if (!existingAgency) {
          const agencyName = data.user.user_metadata?.agency_name || "My Agency"
          const slug = agencyName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")

          await supabase.from("agencies").insert({
            owner_id: data.user.id,
            name: agencyName,
            slug: `${slug}-${Date.now()}`,
            status: "pending",
            subscription_status: "none",
            offer_limit: 0,
          })
        }
      }

      // Redirect based on role
      let redirectTo = "/traveler"
      if (profile?.role === "agency") {
        redirectTo = "/agency"
      } else if (profile?.role === "admin") {
        redirectTo = "/admin"
      }

      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/error`)
}
