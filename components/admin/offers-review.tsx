"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Eye, Clock, Package, MapPin, Loader2, BadgeCheck } from "@/components/icons"
import { approveOffer, rejectOffer } from "@/lib/actions/admin"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import type { Offer, Agency } from "@/lib/database.types"

interface AdminOffersProps {
  pendingOffers: (Offer & { agencies: Pick<Agency, "name" | "logo" | "verified"> | null })[]
  stats: {
    pendingCount: number
    totalOffers: number
    activeOffers: number
  }
}

export function AdminOffers({ pendingOffers, stats }: AdminOffersProps) {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<(typeof pendingOffers)[0] | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [action, setAction] = useState<"approve" | "reject">("approve")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = (offer: (typeof pendingOffers)[0], actionType: "approve" | "reject") => {
    setSelectedOffer(offer)
    setAction(actionType)
    setShowDialog(true)
  }

  const confirmAction = async () => {
    if (!selectedOffer) return

    setIsLoading(true)

    let result
    if (action === "approve") {
      result = await approveOffer(selectedOffer.id)
    } else {
      result = await rejectOffer(selectedOffer.id, notes)
    }

    setIsLoading(false)

    if (result.success) {
      setShowDialog(false)
      setNotes("")
      router.refresh()
    } else {
      alert(result.error || "فشلت العملية")
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">مراجعة العروض</h1>
        <p className="text-muted-foreground">مراجعة والموافقة على عروض السفر الجديدة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingCount}</p>
              <p className="text-sm text-muted-foreground">بانتظار المراجعة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeOffers}</p>
              <p className="text-sm text-muted-foreground">عروض نشطة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalOffers}</p>
              <p className="text-sm text-muted-foreground">إجمالي العروض</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Offers */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle>العروض المعلقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingOffers.length > 0 ? (
              pendingOffers.map((offer) => (
                <div key={offer.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={offer.images?.[0] || "/placeholder.svg?height=64&width=96&query=travel destination"}
                      alt={offer.title}
                      width={96}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{offer.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      {offer.destination}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">بواسطة:</span>
                      <span className="text-sm font-medium">{offer.agencies?.name}</span>
                      {offer.agencies?.verified && <BadgeCheck className="w-4 h-4 text-primary" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{formatPrice(offer.price, offer.currency)}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.created_at ? formatDistanceToNow(new Date(offer.created_at), { addSuffix: true, locale: ar }) : 'غير متاح'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent" asChild>
                      <a href={`/offers/${offer.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4" />
                        عرض
                      </a>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleAction(offer, "approve")}
                    >
                      <Check className="w-4 h-4" />
                      موافقة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleAction(offer, "reject")}
                    >
                      <X className="w-4 h-4" />
                      رفض
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">لا توجد عروض معلقة للمراجعة</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "الموافقة على العرض" : "رفض العرض"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? `الموافقة على عرض "${selectedOffer?.title}"؟`
                : `رفض عرض "${selectedOffer?.title}"؟`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={action === "approve" ? "إضافة ملاحظة (اختياري)..." : "سبب الرفض..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-transparent">
              إلغاء
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : action === "approve" ? (
                "تأكيد الموافقة"
              ) : (
                "تأكيد الرفض"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
