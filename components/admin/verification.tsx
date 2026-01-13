"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, FileText, Building2, MapPin, Clock, Check, X, Loader2 } from "@/components/icons"
import { verifyAgency, rejectVerification } from "@/lib/actions/admin"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import type { Agency } from "@/lib/database.types"

interface AdminVerificationProps {
  pendingVerifications: Agency[]
  stats: {
    pendingCount: number
    verifiedCount: number
    verificationRate: number
  }
}

export function AdminVerification({ pendingVerifications, stats }: AdminVerificationProps) {
  const router = useRouter()
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleVerify = async (agencyId: string) => {
    setLoadingId(agencyId)
    const result = await verifyAgency(agencyId)
    setLoadingId(null)
    if (result.success) {
      // Reload page to refresh data
      window.location.reload()
    } else {
      alert(result.error || "فشل في توثيق الوكالة")
    }
  }

  const handleReject = async (agencyId: string) => {
    if (!confirm("هل أنت متأكد من رفض طلب التوثيق؟")) return
    setLoadingId(agencyId)
    const result = await rejectVerification(agencyId)
    setLoadingId(null)
    if (result.success) {
      // Reload page to refresh data
      window.location.reload()
    } else {
      alert(result.error || "فشل في رفض الطلب")
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">توثيق الوكالات</h1>
        <p className="text-muted-foreground">مراجعة وتوثيق بيانات الوكالات</p>
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
              <p className="text-sm text-muted-foreground">بانتظار التوثيق</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.verifiedCount}</p>
              <p className="text-sm text-muted-foreground">وكالات موثقة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.verificationRate}%</p>
              <p className="text-sm text-muted-foreground">نسبة التوثيق</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Queue */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle>طابور التوثيق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingVerifications.length > 0 ? (
              pendingVerifications.map((agency) => (
                <div key={agency.id} className="rounded-xl border border-border overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedRequest(expandedRequest === agency.id ? null : agency.id)}
                  >
                    <Image
                      src={agency.logo || "/placeholder.svg?height=48&width=48&query=agency logo"}
                      alt={agency.name}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground">{agency.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {agency.location || "غير محدد"}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">بانتظار المراجعة</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {agency.created_at ? formatDistanceToNow(new Date(agency.created_at), { addSuffix: true, locale: ar }) : 'غير متاح'}
                      </p>
                    </div>
                  </div>

                  {expandedRequest === agency.id && (
                    <div className="p-4 bg-secondary/30 border-t border-border">
                      <h5 className="font-medium text-foreground mb-3">معلومات الوكالة</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">الهاتف: {agency.phone || "غير متوفر"}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">البريد: {agency.email || "غير متوفر"}</span>
                        </div>
                        {agency.website && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">الموقع: {agency.website}</span>
                          </div>
                        )}
                        {agency.verification_documents && agency.verification_documents.length > 0 && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-background">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm">{agency.verification_documents.length} مستندات مرفقة</span>
                            <Button variant="ghost" size="sm" className="ml-auto text-primary">
                              عرض
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{agency.description || "لا يوجد وصف"}</p>
                      <div className="flex items-center gap-3">
                        <Button
                          className="gap-2"
                          onClick={() => handleVerify(agency.id)}
                          disabled={loadingId === agency.id}
                        >
                          {loadingId === agency.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          الموافقة على التوثيق
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleReject(agency.id)}
                          disabled={loadingId === agency.id}
                        >
                          <X className="w-4 h-4" />
                          رفض
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">لا توجد طلبات توثيق معلقة</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
