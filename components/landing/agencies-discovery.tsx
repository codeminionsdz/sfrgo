"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { createClient } from "@/lib/supabase/client"
import { Star, MapPin, BadgeCheck, Search, Loader2, Users, Building2 } from "@/components/icons"

interface Agency {
  id: string
  name: string
  slug: string
  logo: string | null
  cover_image: string | null
  location: string
  rating: number
  verified: boolean
  total_offers: number
  total_reviews: number
}

export function AgenciesDiscoveryPage() {
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("agencies")
        .select(`
          id,
          name,
          slug,
          logo,
          cover_image,
          location,
          rating,
          verified,
          subscription_status,
          status
        `)
        .eq("status", "active")
        .in("subscription_status", ["active", "trial"])
        .order("verified", { ascending: false })
        .order("rating", { ascending: false })
        .limit(50)

      if (error) throw error

      // Get offer and review counts
      const agenciesWithCounts = await Promise.all(
        (data || []).map(async (agency: any) => {
          const [offersResult, reviewsResult] = await Promise.all([
            supabase
              .from("offers")
              .select("id", { count: "exact", head: true })
              .eq("agency_id", agency.id)
              .eq("status", "active"),
            supabase
              .from("reviews")
              .select("id", { count: "exact", head: true })
              .eq("agency_id", agency.id),
          ])

          return {
            ...agency,
            total_offers: offersResult.count || 0,
            total_reviews: reviewsResult.count || 0,
          }
        })
      )

      setAgencies(agenciesWithCounts)
    } catch (error) {
      console.error("Error loading agencies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <LandingHeader />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                Discover trusted travel agencies
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Browse verified travel partners across Algeria. Every agency is carefully vetted to ensure your journey is safe, authentic, and memorable.
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Agencies Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No agencies found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search" : "Check back soon for new travel partners"}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredAgencies.length} {filteredAgencies.length === 1 ? "agency" : "agencies"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAgencies.map((agency) => (
                    <Link key={agency.id} href={`/agencies/${agency.slug}`}>
                      <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                        {/* Cover Image */}
                        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                          {agency.cover_image ? (
                            <Image
                              src={agency.cover_image}
                              alt=""
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Building2 className="w-12 h-12 text-primary/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        {/* Logo */}
                        <div className="relative -mt-8 px-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-card bg-card shadow-lg">
                            {agency.logo ? (
                              <Image src={agency.logo} alt={agency.name} width={64} height={64} className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <Building2 className="w-8 h-8 text-primary" />
                              </div>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4 pt-2">
                          {/* Name & Verified Badge */}
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
                              {agency.name}
                            </h3>
                            {agency.verified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{agency.location}</span>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium">{agency.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground">({agency.total_reviews > 0 ? agency.total_reviews : "موثوق"})</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium">{agency.total_offers}</span>
                              <span>offers</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Are you a travel agency?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join SAFRGO and connect with thousands of travelers. Get verified, build trust, and grow your business.
              </p>
              <Link href="/agency-setup">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Building2 className="w-5 h-5" />
                  Join as an Agency
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
