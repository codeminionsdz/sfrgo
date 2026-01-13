"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getPseudoRating } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Eye, Trash2, MapPin, Clock, Star, Heart, Loader2, Share2 } from "@/components/icons"
import { deleteOffer } from "@/lib/actions/offers"
import { ShareOfferButton } from "@/components/agency/share-offer-button"
import type { Agency, Offer } from "@/lib/database.types"

interface AgencyOffersProps {
  offers: (Offer & { savedCount: number })[]
  agency: Agency
}

export function AgencyOffers({ offers, agency }: AgencyOffersProps) {
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      offer.destination.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (offerId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return

    setDeletingId(offerId)
    const result = await deleteOffer(offerId)
    setDeletingId(null)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "فشل حذف العرض")
    }
  }

  const maxOffers = agency.offer_limit || 0
  const currentOffers = agency.offer_count || 0
  const canCreateMore = currentOffers < maxOffers && agency.subscription_status === "active"

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">عروضي</h1>
          <p className="text-muted-foreground">
            إدارة وإنشاء عروض السفر ({currentOffers} / {maxOffers})
          </p>
        </div>
        <Link href={canCreateMore ? "/agency/offers/new" : "#"}>
          <Button className="gap-2" disabled={!canCreateMore}>
            <Plus className="w-4 h-4" />
            إنشاء عرض
          </Button>
        </Link>
      </div>

      {!canCreateMore && agency.subscription_status !== "active" && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          يجب تفعيل الاشتراك لإنشاء عروض.{" "}
          <Link href="/agency/subscription" className="underline font-medium">
            تفعيل الآن
          </Link>
        </div>
      )}

      {!canCreateMore && agency.subscription_status === "active" && currentOffers >= maxOffers && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          لقد وصلت إلى الحد الأقصى من العروض.{" "}
          <Link href="/agency/subscription" className="underline font-medium">
            قم بترقية خطتك
          </Link>{" "}
          لإضافة المزيد.
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="البحث في العروض..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="group overflow-hidden border-0">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={offer.image || "/placeholder.svg?height=300&width=400&query=travel destination"}
                alt={offer.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant={offer.active ? "default" : "secondary"}>{offer.active ? "نشط" : "غير نشط"}</Badge>
                {offer.featured && (
                  <Badge variant="default" className="bg-amber-500">
                    مميز
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="w-8 h-8" suppressHydrationWarning>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/offers/${offer.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        معاينة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/agency/offers/${offer.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        تعديل
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(offer.id)}
                      disabled={deletingId === offer.id}
                    >
                      {deletingId === offer.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute bottom-3 left-3">
                <p className="text-xl font-bold text-white">
                  {formatPrice(offer.price, offer.currency || "DZD")}
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{offer.title}</h3>
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
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {(offer.view_count || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {offer.savedCount}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {(() => {
                    const pseudoRating = getPseudoRating(offer.id, offer.review_count || 0)
                    const displayRating = pseudoRating.label ? pseudoRating.rating : (offer.rating || 0)
                    return <span className="font-medium">{displayRating.toFixed(1)}</span>
                  })()}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <ShareOfferButton
                  offerId={offer.id}
                  offerTitle={offer.title}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        {canCreateMore && (
          <Link href="/agency/offers/new">
            <Card className="h-full min-h-[320px] border-dashed border-2 hover:border-primary transition-colors cursor-pointer">
              <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">إنشاء عرض جديد</h3>
                <p className="text-sm text-muted-foreground">أضف تجربة سفر جديدة</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {filteredOffers.length === 0 && offers.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">لا توجد عروض تطابق بحثك</p>
        </div>
      )}

      {offers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">لم تقم بإنشاء أي عروض بعد</p>
          {canCreateMore && (
            <Link href="/agency/offers/new">
              <Button>إنشاء عرضك الأول</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
