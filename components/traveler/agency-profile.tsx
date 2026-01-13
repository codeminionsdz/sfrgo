"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { followAgency, unfollowAgency, type AgencyWithOffers } from "@/lib/actions/agencies"
import { Star, MapPin, Clock, Heart, BadgeCheck, MessageCircle, ChevronLeft, Shield, Loader2 } from "@/components/icons"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import { toast } from "sonner"
import { redirectToLogin } from "@/lib/utils/auth-redirect"
import { LocationDisplay, LocationNotSet } from "@/components/agency/location-display"

interface AgencyProfileProps {
  agency: AgencyWithOffers
  isAuthenticated: boolean
  initialIsFollowing: boolean
}

export function AgencyProfile({ agency, isAuthenticated, initialIsFollowing }: AgencyProfileProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()
  const [followerCount, setFollowerCount] = useState(agency.follower_count)

  const activeOffers = agency.offers?.filter((o) => o.active) || []
  
  // Check if agency provides Umrah or Hajj services
  const providesUmrah = activeOffers.some((o) => o.offer_type === "umrah")
  const providesHajj = activeOffers.some((o) => o.offer_type === "hajj")
  const providesReligiousServices = providesUmrah || providesHajj

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to follow agencies")
      redirectToLogin(`/agencies/${agency.slug}`)
      return
    }

    startTransition(async () => {
      if (isFollowing) {
        const result = await unfollowAgency(agency.id)
        if (result.success) {
          setIsFollowing(false)
          setFollowerCount((prev) => Math.max(0, prev - 1))
          toast.success(`Unfollowed ${agency.name}`)
        }
      } else {
        const result = await followAgency(agency.id)
        if (result.success) {
          setIsFollowing(true)
          setFollowerCount((prev) => prev + 1)
          toast.success(`Now following ${agency.name}`)
        }
      }
    })
  }

  const handleMessage = () => {
    if (!isAuthenticated) {
      toast.error("Please login to send messages")
      redirectToLogin(`/agencies/${agency.slug}`)
      return
    }
    router.push(`/messages?agency=${agency.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to explore
      </Link>

      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6">
        <Image
          src={agency.cover_image || "/placeholder.svg?height=400&width=1200&query=travel agency cover"}
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Agency Info */}
      <div className="relative -mt-16 sm:-mt-20 mb-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-background bg-background shadow-xl">
            <Image
              src={agency.logo || "/placeholder.svg?height=128&width=128&query=agency logo"}
              alt={agency.name}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{agency.name}</h1>
                  {agency.verified && <BadgeCheck className="w-6 h-6 text-primary" />}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {agency.location}
                </div>
                {/* Umrah & Hajj Badge */}
                {providesReligiousServices && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Provides {providesUmrah && "Umrah"}{providesUmrah && providesHajj && " & "}{providesHajj && "Hajj"} Services
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  onClick={handleToggleFollow}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                  )}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="bg-transparent" onClick={handleMessage}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {agency.description || "No description provided yet."}
            </p>
          </div>

          {/* Specialties */}
          {agency.specialties && agency.specialties.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {agency.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Travel Offers ({activeOffers.length})</h2>
            {activeOffers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeOffers.map((offer) => (
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
                        <div className="absolute bottom-3 left-3">
                          <p className="text-xl font-bold text-white">{formatPrice(offer.price, offer.currency)}</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
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
              <Card className="border-0">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No active offers at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="border-0">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  {(() => {
                    const pseudoRating = getPseudoRating(agency.id, agency.review_count || 0)
                    if (pseudoRating.label) {
                      // Show pseudo rating with "موثوق" label
                      return (
                        <>
                          <span className="font-semibold">{pseudoRating.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({pseudoRating.label})</span>
                        </>
                      )
                    } else {
                      // Show real rating with review count
                      return (
                        <>
                          <span className="font-semibold">{agency.rating}</span>
                          <span className="text-sm text-muted-foreground">({agency.review_count})</span>
                        </>
                      )
                    }
                  })()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Followers</span>
                <span className="font-semibold">{followerCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response time</span>
                <span className="font-semibold">{agency.response_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member since</span>
                <span className="font-semibold">{new Date(agency.created_at).getFullYear()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info Card */}
          {(agency.phone || agency.email || agency.website) && (
            <Card className="border-0">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                {agency.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <a href={`tel:${agency.phone}`} className="font-medium text-primary hover:underline">
                      {agency.phone}
                    </a>
                  </div>
                )}
                {agency.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <a href={`mailto:${agency.email}`} className="font-medium text-primary hover:underline">
                      {agency.email}
                    </a>
                  </div>
                )}
                {agency.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Website</span>
                    <a 
                      href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          <Card className="border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Office Location</h3>
              {agency.latitude && agency.longitude ? (
                <LocationDisplay
                  lat={agency.latitude}
                  lng={agency.longitude}
                  agencyName={agency.name}
                />
              ) : (
                <LocationNotSet />
              )}
            </CardContent>
          </Card>

          {/* Trust Badges */}
          {agency.verified && (
            <Card className="border-0 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Verified Agency</h3>
                    <p className="text-sm text-muted-foreground">Identity & credentials confirmed</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This agency has been manually verified by SAFRGO for authenticity and reliability.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
