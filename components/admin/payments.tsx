"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Eye, Clock, Building2, Loader2 } from "@/components/icons"
import { approveSubscription, rejectSubscription } from "@/lib/actions/admin"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import type { Agency, SubscriptionPlan } from "@/lib/database.types"

interface SubscriptionRequest {
  id: string
  agency_id: string
  plan: string
  receipt_url: string
  status: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
  agency: {
    id: string
    name: string
    subscription_receipt_url?: string
  }
}

interface AdminPaymentsProps {
  pendingPayments: SubscriptionRequest[]
  stats: {
    pendingCount: number
    approvedThisMonth: number
    revenueThisMonth: number
  }
}

export function AdminPayments({ pendingPayments, stats }: AdminPaymentsProps) {
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<(typeof pendingPayments)[0] | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [action, setAction] = useState<"approve" | "reject">("approve")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = (payment: (typeof pendingPayments)[0], actionType: "approve" | "reject") => {
    setSelectedPayment(payment)
    setAction(actionType)
    setShowDialog(true)
  }

  const confirmAction = async () => {
    if (!selectedPayment) return

    setIsLoading(true)

    try {
      let result
      if (action === "approve") {
        result = await approveSubscription(selectedPayment.id)
      } else {
        result = await rejectSubscription(selectedPayment.id, notes)
      }

      if (result.success) {
        setShowDialog(false)
        setNotes("")
        // Reload page to refresh data
        window.location.reload()
      } else {
        alert(result.error || "فشلت العملية")
        setIsLoading(false)
      }
    } catch (error) {
      alert("حدث خطأ أثناء تنفيذ العملية")
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">إيصالات الدفع</h1>
        <p className="text-muted-foreground">مراجعة والموافقة على مدفوعات اشتراكات الوكالات</p>
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
              <p className="text-2xl font-bold text-foreground">{stats.approvedThisMonth}</p>
              <p className="text-sm text-muted-foreground">تمت الموافقة هذا الشهر</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${stats.revenueThisMonth.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">الإيرادات هذا الشهر</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle>المدفوعات المعلقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayments.length > 0 ? (
              pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={payment.receipt_url || "/placeholder.svg?height=80&width=64&query=receipt"}
                      alt="إيصال"
                      width={64}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{payment.agency?.name || "Unknown"}</h4>
                      <Badge variant="secondary">{payment.plan}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تم الإرسال {payment.submitted_at ? formatDistanceToNow(new Date(payment.submitted_at), { addSuffix: true, locale: ar }) : 'غير متاح'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 bg-transparent"
                      onClick={() => window.open(payment.receipt_url, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                      عرض
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleAction(payment, "approve")}
                      disabled={isLoading}
                    >
                      <Check className="w-4 h-4" />
                      موافقة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleAction(payment, "reject")}
                    >
                      <X className="w-4 h-4" />
                      رفض
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">لا توجد مدفوعات معلقة</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "الموافقة على الدفع" : "رفض الدفع"}</DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? `الموافقة على دفع ${selectedPayment?.name} لخطة ${selectedPayment?.subscription_plans?.name}؟`
                : `رفض طلب دفع ${selectedPayment?.name}؟`}
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
