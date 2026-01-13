"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "@/components/icons"
import { cn } from "@/lib/utils"
import { createAgency } from "@/lib/actions/agencies"
import type { SubscriptionPlan } from "@/lib/database.types"

interface AgencySetupProps {
  plans: SubscriptionPlan[]
}

export function AgencySetup({ plans }: AgencySetupProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phone: "",
    email: "",
  })

  const handleSubmit = async () => {
    setIsLoading(true)

    const result = await createAgency({
      ...formData,
      subscription_plan_id: selectedPlan,
    })

    setIsLoading(false)

    if (result.success) {
      router.push("/agency")
    } else {
      alert(result.error || "فشل في إنشاء الوكالة")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            )}
          >
            1
          </div>
          <div className={cn("w-20 h-1 rounded-full", step >= 2 ? "bg-primary" : "bg-secondary")} />
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            )}
          >
            2
          </div>
        </div>

        {step === 1 && (
          <Card className="border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">إنشاء ملف الوكالة</CardTitle>
              <p className="text-muted-foreground">أدخل معلومات وكالتك للبدء</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الوكالة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="اسم وكالة السفر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">الموقع *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="المدينة، الدولة"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 XX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@agency.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف الوكالة</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="resize-none"
                  placeholder="اكتب وصفاً موجزاً عن وكالتك..."
                />
              </div>
              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.location || !formData.phone || !formData.email}
              >
                التالي: اختر الخطة
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">اختر خطة الاشتراك</h1>
              <p className="text-muted-foreground">اختر الخطة المناسبة لوكالتك</p>
            </div>

            <div className="grid gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedPlan === plan.id ? "ring-2 ring-primary border-primary" : "border-0 hover:shadow-lg",
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{plan.name}</h3>
                          {plan.name === "Premium" && <Badge>الأكثر شعبية</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {plan.features?.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">${plan.price}</p>
                        <p className="text-sm text-muted-foreground">/شهر</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                رجوع
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء الوكالة"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
