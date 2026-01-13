"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { unsaveOffer, type OfferWithAgency } from "@/lib/actions/offers"
import { unfollowAgency } from "@/lib/actions/agencies"
import type { Agency } from "@/lib/database.types"
import { Star, MapPin, Clock, Heart, BadgeCheck, Bookmark, Loader2 } from "@/components/icons"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import { toast } from "sonner"

interface SavedOffersProps {
  initialSavedOffers: OfferWithAgency[]
  initialFollowedAgencies: Agency[]
}

export function SavedOffers({ initialSavedOffers, initialFollowedAgencies }: SavedOffersProps) {
  const [savedOffers, setSavedOffers] = useState<OfferWithAgency[]>(initialSavedOffers)
  const [followedAgencies, setFollowedAgencies] = useState<Agency[]>(initialFollowedAgencies)
  const [isPending, startTransition] = useTransition()
  const [savingOfferId, setSavingOfferId] = useState<string | null>(null)
  const [unfollowingAgencyId, setUnfollowingAgencyId] = useState<string | null>(null)

  const handleUnsaveOffer = async (offerId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavingOfferId(offerId)

    startTransition(async () => {
      const result = await unsaveOffer(offerId)
      if (result.success) {
        setSavedOffers((prev) => prev.filter((o) => o.id !== offerId))
        toast.success("Offer removed from saved")
      } else {
        toast.error(result.error || "Failed to remove offer")
      }
      setSavingOfferId(null)
    })
  }

  const handleUnfollowAgency = async (agencyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUnfollowingAgencyId(agencyId)

    startTransition(async () => {
      const result = await unfollowAgency(agencyId)
      if (result.success) {
        setFollowedAgencies((prev) => prev.filter((a) => a.id !== agencyId))
        toast.success("Unfollowed agency")
      } else {
        toast.error(result.error || "Failed to unfollow")
      }
      setUnfollowingAgencyId(null)
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Saved</h1>
        <p className="text-muted-foreground">Your favorite offers and agencies</p>
      </div>

      <Tabs defaultValue="offers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="offers" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Offers ({savedOffers.length})
          </TabsTrigger>
          <TabsTrigger value="agencies" className="gap-2">
            <Heart className="w-4 h-4" />
            Following ({followedAgencies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          {savedOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOffers.map((offer) => (
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
                        onClick={(e) => handleUnsaveOffer(offer.id, e)}
                        disabled={savingOfferId === offer.id}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        {savingOfferId === offer.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 fill-current" />
                        )}
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <p className="text-2xl font-bold text-white">{formatPrice(offer.price, offer.currency)}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      {offer.agency && (
                        <div className="flex items-center gap-2 mb-2">
                          <Image
                            src={offer.agency.logo || "/placeholder.svg?height=20&width=20&query=agency logo"}
                            alt={offer.agency.name}
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                          />
                          <span className="text-xs text-muted-foreground truncate">{offer.agency.name}</span>
                          {offer.agency.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </div>
                      )}
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
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No saved offers yet</h3>
              <p className="text-muted-foreground mb-4">Start exploring and save offers you like</p>
              <Link href="/explore" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Explore offers
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="agencies">
          {followedAgencies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedAgencies.map((agency) => (
                <Link key={agency.id} href={`/agencies/${agency.slug}`}>
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={agency.cover_image || "/placeholder.svg?height=200&width=400&query=travel agency"}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={(e) => handleUnfollowAgency(agency.id, e)}
                        disabled={unfollowingAgencyId === agency.id}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        {unfollowingAgencyId === agency.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    </div>
                    <div className="relative -mt-8 px-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-card bg-card shadow-lg">
                        <Image
                          src={agency.logo || "/placeholder.svg?height=64&width=64&query=agency logo"}
                          alt={agency.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {agency.name}
                        </h3>
                        {agency.verified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{agency.location}</p>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Not following any agencies</h3>
              <p className="text-muted-foreground mb-4">Follow agencies to see their latest offers</p>
              <Link href="/explore" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                Browse agencies
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
