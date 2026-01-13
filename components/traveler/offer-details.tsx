"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { saveOffer, unsaveOffer, type OfferWithAgency } from "@/lib/actions/offers"
import { startConversation } from "@/lib/actions/chat"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import {
  Star,
  MapPin,
  Clock,
  Heart,
  BadgeCheck,
  Calendar,
  Users,
  Check,
  X,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  AlertCircle,
  Share2,
} from "@/components/icons"
import { toast } from "sonner"
import { redirectToLogin } from "@/lib/utils/auth-redirect"
import { ShareOfferButton } from "@/components/agency/share-offer-button"

interface OfferDetailsProps {
  offer: OfferWithAgency
  isAuthenticated: boolean
  initialIsSaved: boolean
}

export function OfferDetails({ offer, isAuthenticated, initialIsSaved }: OfferDetailsProps) {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isPending, startTransition] = useTransition()
  const [isStartingChat, setIsStartingChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [showChatDialog, setShowChatDialog] = useState(false)

  const images = offer.images && offer.images.length > 0 ? offer.images : [offer.image]

  const isAgencyUnavailable =
    offer.agency.status === "suspended" || !["active", "pending"].includes(offer.agency.subscription_status)

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save offers")
      redirectToLogin(`/offers/${offer.id}`)
      return
    }

    startTransition(async () => {
      if (isSaved) {
        const result = await unsaveOffer(offer.id)
        if (result.success) {
          setIsSaved(false)
          toast.success("Offer removed from saved")
        }
      } else {
        const result = await saveOffer(offer.id)
        if (result.success) {
          setIsSaved(true)
          toast.success("Offer saved!")
        }
      }
    })
  }

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to contact the agency")
      redirectToLogin(`/offers/${offer.id}`)
      return
    }

    if (!chatMessage.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsStartingChat(true)
    console.log("Starting conversation for offer:", offer.id, "with message:", chatMessage)
    const result = await startConversation(offer.id, chatMessage)
    console.log("startConversation result:", result)

    if (result.conversationId) {
      toast.success("Message sent!")
      setShowChatDialog(false)
      setChatMessage("")
      router.push(`/messages`)
      router.refresh()
    } else {
      console.error("Failed to start conversation:", result.error)
      toast.error(result.error || "Failed to start conversation")
    }
    setIsStartingChat(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to explore
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={images[currentImage] || "/placeholder.svg?height=600&width=1000&query=travel destination"}
                alt={offer.title}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-offset-2 transition-all ${
                      index === currentImage ? "ring-primary" : "ring-transparent hover:ring-primary/50"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg?height=80&width=80&query=travel"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Quick Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3 inline-block">
                  {offer.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{offer.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  size="icon"
                  onClick={handleToggleSave}
                  disabled={isPending}
                  className={isSaved ? "" : "bg-transparent"}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                  )}
                </Button>
                <ShareOfferButton
                  offerId={offer.id}
                  offerTitle={offer.title}
                  variant="outline"
                  size="icon"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {offer.destination}, {offer.country}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {offer.duration}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {(() => {
                  const pseudoRating = getPseudoRating(offer.id, offer.review_count || 0)
                  const displayRating = pseudoRating.label ? pseudoRating.rating : offer.rating
                  const displayCount = pseudoRating.label ? null : offer.review_count
                  
                  return (
                    <>
                      <span className="font-medium text-foreground">{displayRating.toFixed(1)}</span>
                      {pseudoRating.label ? (
                        <span>({pseudoRating.label})</span>
                      ) : (
                        <span>({displayCount} reviews)</span>
                      )}
                    </>
                  )
                })()}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {offer.saved_count} saved
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {offer.view_count} views
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">About this trip</h2>
            <p className="text-muted-foreground leading-relaxed">{offer.description}</p>
          </div>

          {/* Highlights */}
          {offer.highlights && offer.highlights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offer.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What's Included */}
          <div className="grid sm:grid-cols-2 gap-6">
            {offer.included && offer.included.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">What&apos;s included</h2>
                <ul className="space-y-2">
                  {offer.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {offer.not_included && offer.not_included.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Not included</h2>
                <ul className="space-y-2">
                  {offer.not_included.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="sticky top-24 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-foreground">{formatPrice(offer.price, offer.currency)}</span>
                {offer.original_price && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(offer.original_price, offer.currency)}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">/ للشخص</span>
              </div>

              {offer.original_price && (
                <div className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-medium mb-4 inline-block">
                  وفر {formatPrice(offer.original_price - offer.price, offer.currency)}
                </div>
              )}

              <div className="space-y-3 mb-6">
                {offer.departure_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Next departure: {new Date(offer.departure_date).toLocaleDateString()}</span>
                  </div>
                )}
                {offer.max_group_size && (
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Max group size: {offer.max_group_size} people</span>
                  </div>
                )}
              </div>

              {isAgencyUnavailable && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>This agency is currently unavailable for chat</span>
                </div>
              )}

              <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full mb-3 gap-2" size="lg" disabled={isAgencyUnavailable}>
                    <MessageCircle className="w-5 h-5" />
                    {isAgencyUnavailable ? "Agency Unavailable" : "Contact Agency"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact {offer.agency.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Image
                        src={offer.image || "/placeholder.svg?height=60&width=60&query=travel"}
                        alt={offer.title}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{offer.title}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(offer.price, offer.currency)}</p>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Hi! I'm interested in this trip. Could you tell me more about availability and booking?"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleStartChat} disabled={isStartingChat} className="w-full">
                      {isStartingChat ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <p className="text-xs text-center text-muted-foreground">
                Chat directly with the agency to book or customize
              </p>
            </CardContent>
          </Card>

          {/* Agency Card */}
          <Card className="border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Offered by</h3>
              <Link href={`/agencies/${offer.agency.slug}`} className="flex items-center gap-3 mb-4 group">
                <Image
                  src={offer.agency.logo || "/placeholder.svg?height=56&width=56&query=agency logo"}
                  alt={offer.agency.name}
                  width={56}
                  height={56}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {offer.agency.name}
                    </span>
                    {offer.agency.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.agency.location}</p>
                </div>
              </Link>

              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {(() => {
                    const pseudoRating = getPseudoRating(offer.agency.id, offer.agency.review_count || 0)
                    if (pseudoRating.label) {
                      return (
                        <>
                          <span className="font-medium">{pseudoRating.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({pseudoRating.label})</span>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <span className="font-medium">{offer.agency.rating}</span>
                          <span className="text-muted-foreground">({offer.agency.review_count} reviews)</span>
                        </>
                      )
                    }
                  })()}
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Response time: {offer.agency.response_time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {offer.agency.follower_count?.toLocaleString()} followers
                </div>
              </div>

              {offer.agency.specialties && offer.agency.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {offer.agency.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              <Link href={`/agencies/${offer.agency.slug}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  View Agency Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
