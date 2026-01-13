import type { Metadata } from "next"
import { AgencyDashboard } from "@/components/agency/dashboard"
import { getAgencyDashboardData } from "@/lib/actions/agencies"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard - SAFRGO Agency",
  description: "Manage your travel agency on SAFRGO",
}

export default async function AgencyDashboardPage() {
  const dashboardData = await getAgencyDashboardData()

  if (!dashboardData) {
    redirect("/agency-setup")
  }

  return (
    <AgencyDashboard
      agency={dashboardData.agency}
      offers={dashboardData.offers}
      stats={dashboardData.stats}
      recentMessages={dashboardData.recentMessages}
    />
  )
}
