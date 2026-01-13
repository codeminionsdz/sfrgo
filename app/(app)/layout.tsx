import type React from "react"
import type { Metadata } from "next"
import { AppSidebar, AppMobileNav, AppHeader } from "@/components/app/app-sidebar"
import { getProfile } from "@/lib/actions/auth"
import { getUnreadCount } from "@/lib/actions/chat"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "SAFRGO - Travel Platform",
  description: "Discover curated travel experiences from trusted agencies",
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || "/traveler"
  const profile = await getProfile()
  const unreadCount = await getUnreadCount()

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar pathname={pathname} />
      <AppHeader profile={profile} unreadCount={unreadCount} />
      <main className="lg:pl-64 pb-20 lg:pb-0">{children}</main>
      <AppMobileNav pathname={pathname} unreadCount={unreadCount} />
    </div>
  )
}
