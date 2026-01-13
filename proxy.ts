import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin routes protection - skip Supabase auth check for admin
  // Admin uses localStorage-based authentication
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to admin routes - auth check handled client-side
    return supabaseResponse
  }

  // Agency routes protection
  if (request.nextUrl.pathname.startsWith("/agency")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?redirect=/agency", request.url))
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "agency") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Check if agency exists
    if (request.nextUrl.pathname !== "/agency-setup") {
      const { data: agency } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle()

      if (!agency) {
        return NextResponse.redirect(new URL("/agency-setup", request.url))
      }
    }
  }

  // Traveler routes protection
  if (
    request.nextUrl.pathname.startsWith("/traveler") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/saved")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?redirect=" + request.nextUrl.pathname, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/agency/:path*",
    "/traveler/:path*",
    "/messages/:path*",
    "/saved/:path*",
    "/agency-setup",
  ],
}
