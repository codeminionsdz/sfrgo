"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import {
  Star,
  MapPin,
  Clock,
  Heart,
  BadgeCheck,
  Compass,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Loader2,
} from "@/components/icons"
import { saveOffer, unsaveOffer, type OfferWithAgency } from "@/lib/actions/offers"
import type { Agency, Profile } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TravelerHomeProps {
  profile: Profile
  featuredOffers: OfferWithAgency[]
  recentOffers: OfferWithAgency[]
  followedAgencies: Agency[]
  savedOfferIds: string[]
  followedAgencyIds: string[]
}

export function TravelerHome({
  profile,
  featuredOffers,
  recentOffers,
  followedAgencies,
  savedOfferIds: initialSavedOfferIds,
}: TravelerHomeProps) {
  const [savedOfferIds, setSavedOfferIds] = useState<string[]>(initialSavedOfferIds)
  const [isPending, startTransition] = useTransition()
  const [savingOfferId, setSavingOfferId] = useState<string | null>(null)

  const handleToggleSave = async (offerId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavingOfferId(offerId)

    const isSaved = savedOfferIds.includes(offerId)

    startTransition(async () => {
      if (isSaved) {
        const result = await unsaveOffer(offerId)
        if (result.success) {
          setSavedOfferIds((prev) => prev.filter((id) => id !== offerId))
          toast.success("Offer removed from saved")
        }
      } else {
        const result = await saveOffer(offerId)
        if (result.success) {
          setSavedOfferIds((prev) => [...prev, offerId])
          toast.success("Offer saved!")
        }
      }
      setSavingOfferId(null)
    })
  }

  const isOfferSaved = (offerId: string) => savedOfferIds.includes(offerId)

  const stats = {
    savedOffers: savedOfferIds.length,
    followedAgencies: followedAgencies.length,
    destinations: new Set(recentOffers.map((o) => o.country)).size,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Welcome back, {profile.name?.split(" ")[0] || "Traveler"}
        </h1>
        <p className="text-muted-foreground">Ready for your next adventure?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Bookmark, label: "Saved Offers", value: stats.savedOffers.toString() },
          { icon: Heart, label: "Following", value: stats.followedAgencies.toString() },
          { icon: Compass, label: "Destinations", value: stats.destinations.toString() },
          { icon: TrendingUp, label: "This Month", value: "+5" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Featured for you</h2>
          <Link href="/explore" className="text-sm text-primary hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOffers.map((offer, index) => (
              <Link key={offer.id} href={`/offers/${offer.id}`}>
                <Card
                  className={cn(
                    "group overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-0",
                    index === 0 && "md:col-span-2 md:row-span-2",
                  )}
                >
                  <div className={cn("relative overflow-hidden", index === 0 ? "aspect-[16/10]" : "aspect-[4/3]")}>
                    <Image
                      src={offer.image || "/placeholder.svg?height=600&width=800&query=travel destination"}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <button
                      onClick={(e) => handleToggleSave(offer.id, e)}
                      disabled={savingOfferId === offer.id}
                      className={cn(
                        "absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors",
                        isOfferSaved(offer.id) && "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {savingOfferId === offer.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className={cn("w-4 h-4", isOfferSaved(offer.id) && "fill-current")} />
                      )}
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm">
                          {offer.category}
                        </span>
                        {offer.original_price && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                            وفر {formatPrice(offer.original_price - offer.price, offer.currency)}
                          </span>
                        )}
                      </div>
                      <h3
                        className={cn(
                          "font-semibold text-white mb-1 line-clamp-2",
                          index === 0 ? "text-xl" : "text-base",
                        )}
                      >
                        {offer.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {offer.destination}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {(() => {
                            const pseudoRating = getPseudoRating(offer.id, offer.review_count || 0)
                            return pseudoRating.label ? pseudoRating.rating.toFixed(1) : offer.rating
                          })()}
                        </div>
                      </div>
                      <p className={cn("font-bold text-white mt-2", index === 0 ? "text-2xl" : "text-lg")}>
                        {formatPrice(offer.price, offer.currency)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-secondary/50">
            <CardContent className="p-8 text-center">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No featured offers yet</h3>
              <p className="text-muted-foreground mb-4">Check back soon for exciting travel deals</p>
              <Link href="/explore" className="text-primary font-medium hover:underline">
                Browse all offers
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Followed Agencies */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Agencies you follow</h2>
          <Link href="/explore" className="text-sm text-primary hover:underline flex items-center gap-1">
            Browse all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {followedAgencies.length > 0 ? (
            followedAgencies.map((agency) => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`} className="flex-shrink-0">
                <Card className="w-72 hover:shadow-lg transition-shadow border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={agency.logo || "/placeholder.svg?height=48&width=48&query=travel agency logo"}
                        alt={agency.name}
                        width={48}
                        height={48}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-foreground truncate">{agency.name}</h3>
                          {agency.verified && <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{agency.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {(() => {
                          const pseudoRating = getPseudoRating(agency.id, agency.review_count || 0)
                          return pseudoRating.label ? (
                            <span className="font-medium">{pseudoRating.rating.toFixed(1)}</span>
                          ) : (
                            <span className="font-medium">{agency.rating}</span>
                          )
                        })()}
                      </div>
                      <span className="text-muted-foreground">{agency.offer_count} offers</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="w-72 flex-shrink-0 border-dashed border-2">
              <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center py-8">
                <Heart className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">You&apos;re not following any agencies yet</p>
              </CardContent>
            </Card>
          )}
          <Card className="w-72 flex-shrink-0 border-dashed border-2 hover:border-primary transition-colors">
            <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <Compass className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Discover more agencies</p>
              <Link href="/explore" className="text-sm text-primary font-medium hover:underline mt-1">
                Browse now
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Offers */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recently added</h2>
          <Link href="/explore" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentOffers.map((offer) => (
              <Link key={offer.id} href={`/offers/${offer.id}`}>
                <Card className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={offer.image || "/placeholder.svg?height=400&width=600&query=travel destination"}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button
                      onClick={(e) => handleToggleSave(offer.id, e)}
                      disabled={savingOfferId === offer.id}
                      className={cn(
                        "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors",
                        isOfferSaved(offer.id) && "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {savingOfferId === offer.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart className={cn("w-4 h-4", isOfferSaved(offer.id) && "fill-current")} />
                      )}
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-xl font-bold text-white">{formatPrice(offer.price, offer.currency)}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        src={offer.agency?.logo || "/placeholder.svg?height=20&width=20&query=agency logo"}
                        alt={offer.agency?.name || "Agency"}
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <span className="text-xs text-muted-foreground truncate">{offer.agency?.name}</span>
                      {offer.agency?.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {offer.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {offer.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {offer.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-0 bg-secondary/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No offers available yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
