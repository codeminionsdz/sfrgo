import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Clock, Heart, ArrowRight, BadgeCheck } from "@/components/icons"
import { formatPrice } from "@/lib/utils"
import type { CuratedOffer } from "@/lib/actions/landing"

interface FeaturedOffersProps {
  offers: CuratedOffer[]
}

export function FeaturedOffers({ offers }: FeaturedOffersProps) {
  // Don't show section if no offers
  if (offers.length === 0) {
    return null
  }

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Curated for you</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Featured experiences</h2>
            <p className="text-lg text-muted-foreground">Exceptional travel offers from our verified agencies</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="gap-2 bg-transparent">
              Explore all offers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Link key={offer.id} href={`/offers/${offer.id}`}>
              <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-0 bg-card">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {offer.image ? (
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Save Button */}
                  <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-white">{formatPrice(offer.price, offer.currency)}</span>
                      {offer.original_price && offer.original_price > offer.price && (
                        <span className="text-sm text-white/70 line-through">
                          {formatPrice(offer.original_price, offer.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  {/* Agency */}
                  <div className="flex items-center gap-2 mb-2">
                    {offer.agency.logo ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-secondary">
                        <Image
                          src={offer.agency.logo}
                          alt={offer.agency.name}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/10" />
                    )}
                    <span className="text-xs text-muted-foreground truncate">{offer.agency.name}</span>
                    {offer.agency.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {offer.title}
                  </h3>

                  {/* Location & Duration */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{offer.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{offer.duration}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {offer.category}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
