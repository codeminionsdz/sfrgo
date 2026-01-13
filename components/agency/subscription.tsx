"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, Clock, AlertCircle, Loader2, Upload, CheckCircle, XCircle, BadgeCheck, Shield, Star, Copy, Banknote, CreditCard, Receipt, Info } from "@/components/icons"
import { cn, formatPrice } from "@/lib/utils"
import { submitSubscriptionRequest } from "@/lib/actions/agencies"
import type { Agency } from "@/lib/database.types"
import { toast } from "sonner"
import {
  PRICING,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS_LABELS,
  type SubscriptionPlan,
  PAYMENT_INFO,
} from "@/lib/constants/subscription"

interface SubscriptionManagementProps {
  agency: Agency
  pendingRequest?: any
}

export function SubscriptionManagement({ agency, pendingRequest }: SubscriptionManagementProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptUrl, setReceiptUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)

  const currentPlan = agency.subscription_plan as SubscriptionPlan | null
  const currentStatus = agency.subscription_status
  const expiresAt = agency.subscription_expires_at

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف كبير جداً", {
          description: "يجب أن يكون حجم الملف أقل من 5 ميغابايت",
        })
        return
      }
      setReceiptFile(file)
      // In a real app, upload to storage and get URL
      // For now, simulate with object URL
      const objectUrl = URL.createObjectURL(file)
      setReceiptUrl(objectUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPlan) {
      toast.error("يرجى اختيار خطة")
      return
    }

    if (!receiptUrl) {
      toast.error("يرجى رفع إيصال الدفع")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("plan", selectedPlan)
      formData.append("receiptUrl", receiptUrl)
      formData.append("agencyId", agency.id)
      formData.append("amount", PRICING[selectedPlan].price.toString())

      const result = await submitSubscriptionRequest(formData)

      if (result.error) {
        toast.error("فشل إرسال الطلب", {
          description: result.error,
        })
      } else {
        toast.success("تم إرسال الطلب بنجاح", {
          description: "سيتم مراجعة طلبك خلال 24-48 ساعة",
        })
        setShowUploadForm(false)
        setSelectedPlan(null)
        setReceiptFile(null)
        setReceiptUrl("")
        router.refresh()
      }
    } catch (error) {
      toast.error("حدث خطأ", {
        description: "يرجى المحاولة مرة أخرى",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowUploadForm(true)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`تم نسخ ${label}`, {
        description: "تم نسخ المعلومات إلى الحافظة",
      })
    } catch (error) {
      toast.error("فشل النسخ", {
        description: "يرجى نسخ المعلومات يدوياً",
      })
    }
  }

  const getPlanBadgeIcon = (plan: SubscriptionPlan) => {
    const badge = PRICING[plan].features.badge
    if (badge === 'verified') return <Shield className="w-5 h-5" />
    if (badge === 'trusted') return <BadgeCheck className="w-5 h-5" />
    return null
  }

  // Subscription status display
  const renderStatusBadge = () => {
    if (!currentStatus || currentStatus === SUBSCRIPTION_STATUS.NONE) return null

    const statusConfig = {
      [SUBSCRIPTION_STATUS.PENDING]: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      [SUBSCRIPTION_STATUS.ACTIVE]: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      [SUBSCRIPTION_STATUS.EXPIRED]: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      [SUBSCRIPTION_STATUS.REJECTED]: { color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[currentStatus as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon

    return (
      <Badge className={cn("gap-1.5", config.color)}>
        <Icon className="w-3.5 h-3.5" />
        {SUBSCRIPTION_STATUS_LABELS[currentStatus as keyof typeof SUBSCRIPTION_STATUS_LABELS]}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {currentStatus && currentStatus !== SUBSCRIPTION_STATUS.NONE && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>حالة الاشتراك الحالي</CardTitle>
                <CardDescription className="mt-1.5">
                  {currentPlan && `خطة ${PRICING[currentPlan].nameAr}`}
                </CardDescription>
              </div>
              {renderStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStatus === SUBSCRIPTION_STATUS.PENDING && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">طلبك قيد المراجعة</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      سيتم مراجعة طلبك خلال 24-48 ساعة. سنرسل لك إشعاراً عند الموافقة.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStatus === SUBSCRIPTION_STATUS.ACTIVE && expiresAt && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">اشتراكك نشط</p>
                    <p className="text-xs text-green-700 mt-1">
                      ينتهي في: {new Date(expiresAt).toLocaleDateString('ar-DZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStatus === SUBSCRIPTION_STATUS.EXPIRED && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">انتهى اشتراكك</p>
                    <p className="text-xs text-red-700 mt-1">
                      يرجى تجديد الاشتراك للاستمرار في نشر العروض
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStatus === SUBSCRIPTION_STATUS.REJECTED && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">تم رفض طلبك</p>
                    <p className="text-xs text-red-700 mt-1">
                      يرجى التواصل مع الدعم لمعرفة السبب
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentPlan && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">الخطة الحالية</p>
                  <p className="text-sm font-medium mt-1">{PRICING[currentPlan].nameAr}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">عدد العروض المسموح</p>
                  <p className="text-sm font-medium mt-1">
                    {agency.offer_count} / {PRICING[currentPlan].features.offers}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans Selection */}
      {!showUploadForm && (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">اختر خطة الاشتراك</h2>
            <p className="text-muted-foreground">
              جميع الخطط سنوية • أسعار بالدينار الجزائري
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PRICING).map(([key, plan]) => {
              const planKey = key as SubscriptionPlan
              const isCurrentPlan = currentPlan === planKey
              const isPopular = planKey === SUBSCRIPTION_PLANS.PRO

              return (
                <Card
                  key={planKey}
                  className={cn(
                    "relative overflow-hidden transition-all hover:shadow-lg",
                    isPopular && "border-primary border-2"
                  )}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1.5 text-xs font-medium">
                      الأكثر شعبية
                    </div>
                  )}
                  
                  <CardHeader className={cn(isPopular && "pt-10")}>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{plan.nameAr}</CardTitle>
                      {getPlanBadgeIcon(planKey)}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{formatPrice(plan.price, plan.currency)}</span>
                      <span className="text-sm text-muted-foreground">/ {plan.periodAr}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.featuresListAr.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(planKey)}
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                      disabled={currentStatus === SUBSCRIPTION_STATUS.PENDING}
                    >
                      {isCurrentPlan ? "الخطة الحالية" : "اختر هذه الخطة"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Upload Receipt Form */}
      {showUploadForm && selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>إتمام الاشتراك - خطة {PRICING[selectedPlan].nameAr}</CardTitle>
            <CardDescription>
              المبلغ المطلوب: {formatPrice(PRICING[selectedPlan].price, PRICING[selectedPlan].currency)} / سنوي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Instructions - Enhanced */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">معلومات الدفع</h3>
                </div>

                {/* Bank Account Section */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">اسم الحساب</p>
                          <p className="font-semibold text-base">{PAYMENT_INFO.accountName}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">البنك</p>
                          <p className="font-medium text-sm">{PAYMENT_INFO.bank}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">رقم الحساب البنكي</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5"
                              onClick={() => copyToClipboard(PAYMENT_INFO.accountNumber, "رقم الحساب")}
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-xs">نسخ</span>
                            </Button>
                          </div>
                          <div className="bg-background/80 rounded-md px-3 py-2 font-mono text-sm border">
                            {PAYMENT_INFO.accountNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CCP Section */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Receipt className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">الحوالة البريدية</p>
                          <p className="font-medium text-sm">{PAYMENT_INFO.ccpName}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">رقم الحساب البريدي CCP</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5"
                              onClick={() => copyToClipboard(PAYMENT_INFO.ccpNumber, "رقم CCP")}
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-xs">نسخ</span>
                            </Button>
                          </div>
                          <div className="bg-background/80 rounded-md px-3 py-2 font-mono text-sm border border-blue-200">
                            {PAYMENT_INFO.ccpNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Required Amount */}
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-900 font-medium">المبلغ المطلوب</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        خطة {PRICING[selectedPlan].nameAr} - اشتراك سنوي
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {formatPrice(PRICING[selectedPlan].price, PRICING[selectedPlan].currency)}
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        يرجى كتابة هذا في خانة المرجع/البيان:
                      </p>
                      <div className="bg-blue-100 rounded-md px-3 py-2 font-medium text-blue-900">
                        {agency.name} - {PRICING[selectedPlan].nameAr}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  خطوات الاشتراك
                </h4>
                <ol className="space-y-2">
                  {PAYMENT_INFO.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground flex-1 pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Important Warning */}
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1">تنبيه مهم</p>
                    <p className="text-amber-800">{PAYMENT_INFO.note}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-3">
                <Label htmlFor="receipt" className="text-base font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  رفع وصل الدفع *
                </Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      required
                      className="flex-1"
                    />
                    {receiptFile && (
                      <Badge variant="secondary" className="gap-1.5 px-3">
                        <CheckCircle className="w-3.5 h-3.5" />
                        تم الرفع
                      </Badge>
                    )}
                  </div>
                  {receiptFile && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>الملف:</strong> {receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    الصيغ المقبولة: JPG, PNG, PDF • الحجم الأقصى: 5 ميغابايت
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false)
                    setSelectedPlan(null)
                    setReceiptFile(null)
                    setReceiptUrl("")
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !receiptUrl} 
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      إرسال الطلب للمراجعة
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
