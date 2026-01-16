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
      // Fetch user profile to check role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

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
