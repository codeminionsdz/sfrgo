import type { Metadata } from "next"
import { AgencyProfile } from "@/components/traveler/agency-profile"
import { getAgencyBySlug } from "@/lib/actions/agencies"
import { getFollowedAgencyIds } from "@/lib/actions/agencies"
import { getProfile } from "@/lib/actions/auth"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const agency = await getAgencyBySlug(slug)
  return {
    title: agency ? `${agency.name} - SAFRGO` : "Agency Not Found",
    description: agency?.description,
  }
}

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [agency, profile, followedAgencyIds] = await Promise.all([
    getAgencyBySlug(slug),
    getProfile(),
    getFollowedAgencyIds(),
  ])

  if (!agency) {
    notFound()
  }

  const isFollowing = followedAgencyIds.includes(agency.id)

  return <AgencyProfile agency={agency} isAuthenticated={!!profile} initialIsFollowing={isFollowing} />
}
