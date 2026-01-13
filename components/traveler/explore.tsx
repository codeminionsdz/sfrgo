"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { saveOffer, unsaveOffer, type OfferWithAgency } from "@/lib/actions/offers"
import {
  Search,
  Star,
  MapPin,
  Clock,
  Heart,
  BadgeCheck,
  SlidersHorizontal,
  Globe,
  Mountain,
  Umbrella,
  Bird,
  Landmark,
  X,
  Loader2,
} from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const categories = [
  { id: "all", name: "All", icon: "Globe" },
  { id: "umrah", name: "Umrah", icon: "BadgeCheck" },
  { id: "hajj", name: "Hajj", icon: "BadgeCheck" },
  { id: "cultural", name: "Cultural", icon: "Landmark" },
  { id: "adventure", name: "Adventure", icon: "Mountain" },
  { id: "beach", name: "Beach", icon: "Umbrella" },
  { id: "wildlife", name: "Wildlife", icon: "Bird" },
  { id: "romance", name: "Romance", icon: "Heart" },
]

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Mountain,
  Umbrella,
  Bird,
  Landmark,
  Heart,
  BadgeCheck,
}

interface ExploreOffersProps {
  initialOffers: OfferWithAgency[]
  initialSavedOfferIds: string[]
}

export function ExploreOffers({ initialOffers, initialSavedOfferIds }: ExploreOffersProps) {
  const [offers] = useState<OfferWithAgency[]>(initialOffers)
  const [savedOfferIds, setSavedOfferIds] = useState<string[]>(initialSavedOfferIds)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [isPending, startTransition] = useTransition()
  const [savingOfferId, setSavingOfferId] = useState<string | null>(null)

  // Filter offers client-side
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      !search ||
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.destination.toLowerCase().includes(search.toLowerCase())

    // Special handling for Umrah/Hajj filters
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "umrah" && offer.offer_type === "umrah") ||
      (selectedCategory === "hajj" && offer.offer_type === "hajj") ||
      (selectedCategory !== "umrah" && selectedCategory !== "hajj" && 
       offer.category.toLowerCase() === selectedCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  // Sort offers
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return b.featured ? 1 : -1
    }
  })

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

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
    setSortBy("featured")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Explore offers</h1>
        <p className="text-muted-foreground">Discover curated travel experiences from trusted agencies</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search destinations, offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filters */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden h-12 gap-2 bg-transparent">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div>
                <h4 className="font-medium mb-4">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = categoryIcons[cat.icon] || Globe
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Categories */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.icon] || Globe
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || search) && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X className="w-3 h-3" />
            </button>
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              &quot;{search}&quot;
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-6">{sortedOffers.length} offers found</p>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedOffers.map((offer) => (
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
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white backdrop-blur-sm">
                    {offer.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{formatPrice(offer.price, offer.currency)}</span>
                    {offer.original_price && (
                      <span className="text-sm text-white/70 line-through">
                        {formatPrice(offer.original_price, offer.currency)}
                      </span>
                    )}
                  </div>
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
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {offer.destination}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {offer.duration}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {(() => {
                    const pseudoRating = getPseudoRating(offer.id, offer.review_count || 0)
                    const displayRating = pseudoRating.label ? pseudoRating.rating : offer.rating
                    const displayCount = pseudoRating.label ? null : offer.review_count
                    
                    return (
                      <>
                        <span className="text-sm font-medium">{displayRating.toFixed(1)}</span>
                        {pseudoRating.label ? (
                          <span className="text-xs text-muted-foreground">({pseudoRating.label})</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">({displayCount} reviews)</span>
                        )}
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {sortedOffers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No offers found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
          <Button variant="outline" onClick={clearFilters} className="bg-transparent">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
