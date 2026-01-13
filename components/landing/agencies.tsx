import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, BadgeCheck, ArrowRight, Building2 } from "@/components/icons"
import type { CuratedAgency } from "@/lib/actions/landing"

interface FeaturedAgenciesProps {
  agencies: CuratedAgency[]
}

export function FeaturedAgencies({ agencies }: FeaturedAgenciesProps) {
  // Don't show section if no agencies
  if (agencies.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Verified partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Top-rated agencies</h2>
            <p className="text-lg text-muted-foreground">Meet the travel experts trusted by thousands</p>
          </div>
          <Link href="/agencies">
            <Button variant="outline" className="gap-2 bg-transparent">
              Browse all agencies
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agencies.map((agency) => (
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
                  
                  {/* Verified Badge */}
                  {agency.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
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
                  {/* Name */}
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {agency.name}
                  </h3>

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
                      <span className="text-sm text-muted-foreground">(موثوق)</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-medium">{agency.total_offers}</span> offers
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
