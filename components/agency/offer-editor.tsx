"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, Loader2, ArrowLeft, AlertCircle } from "@/components/icons"
import { createOffer, updateOffer } from "@/lib/actions/offers"
import Link from "next/link"
import type { Agency, Offer, SubscriptionPlan } from "@/lib/database.types"

interface OfferEditorProps {
  agency: Agency & { subscription_plans: SubscriptionPlan | null }
  offer?: Offer
}

const categories = [
  { value: "beach", label: "شاطئ" },
  { value: "mountain", label: "جبال" },
  { value: "city", label: "مدينة" },
  { value: "adventure", label: "مغامرة" },
  { value: "cultural", label: "ثقافي" },
  { value: "religious", label: "ديني" },
  { value: "honeymoon", label: "شهر عسل" },
  { value: "family", label: "عائلي" },
]

export function OfferEditor({ agency, offer }: OfferEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    offerType: (offer?.offer_type as "travel" | "umrah" | "hajj") || "travel",
    title: offer?.title || "",
    description: offer?.description || "",
    destination: offer?.destination || "",
    duration: offer?.duration || "",
    price: offer?.price?.toString() || "",
    category: offer?.category || "",
    includes: offer?.includes || [],
    excludes: offer?.excludes || [],
    itinerary: offer?.itinerary || [],
    // Umrah & Hajj specific fields
    season: offer?.season || "",
    accommodationDetails: offer?.accommodation_details || "",
    transportDetails: offer?.transport_details || "",
    religiousProgram: offer?.religious_program || [],
  })
  const [newInclude, setNewInclude] = useState("")
  const [newExclude, setNewExclude] = useState("")
  const [newReligiousActivity, setNewReligiousActivity] = useState("")
  const [images, setImages] = useState<string[]>(offer?.images || [])

  const handleAddInclude = () => {
    if (newInclude && !formData.includes.includes(newInclude)) {
      setFormData({
        ...formData,
        includes: [...formData.includes, newInclude],
      })
      setNewInclude("")
    }
  }

  const handleAddExclude = () => {
    if (newExclude && !formData.excludes.includes(newExclude)) {
      setFormData({
        ...formData,
        excludes: [...formData.excludes, newExclude],
      })
      setNewExclude("")
    }
  }

  const handleRemoveInclude = (item: string) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((i) => i !== item),
    })
  }

  const handleRemoveExclude = (item: string) => {
    setFormData({
      ...formData,
      excludes: formData.excludes.filter((i) => i !== item),
    })
  }

  const handleAddReligiousActivity = () => {
    if (newReligiousActivity && !formData.religiousProgram.includes(newReligiousActivity)) {
      setFormData({
        ...formData,
        religiousProgram: [...formData.religiousProgram, newReligiousActivity],
      })
      setNewReligiousActivity("")
    }
  }

  const handleRemoveReligiousActivity = (item: string) => {
    setFormData({
      ...formData,
      religiousProgram: formData.religiousProgram.filter((i) => i !== item),
    })
  }

  const handleSubmit = async (status: "draft" | "pending") => {
    setIsLoading(true)

    const offerData = {
      offer_type: formData.offerType,
      title: formData.title,
      description: formData.description,
      destination: formData.destination,
      duration: formData.duration,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      includes: formData.includes,
      excludes: formData.excludes,
      itinerary: formData.itinerary,
      images,
      status,
      agency_id: agency.id,
      // Umrah & Hajj specific fields
      ...(formData.offerType !== "travel" && {
        season: formData.season,
        accommodation_details: formData.accommodationDetails,
        transport_details: formData.transportDetails,
        religious_program: formData.religiousProgram,
      }),
    }

    let result
    if (offer) {
      result = await updateOffer(offer.id, offerData)
    } else {
      result = await createOffer(offerData)
    }

    setIsLoading(false)

    if (result.success) {
      router.push("/agency/offers")
    } else {
      alert(result.error || "فشل في حفظ العرض")
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/agency/offers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{offer ? "تعديل العرض" : "إنشاء عرض جديد"}</h1>
          <p className="text-muted-foreground">أضف تفاصيل عرض السفر</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Images */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>صور العرض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                  <Image src={image || "/placeholder.svg"} alt="" fill className="object-cover" />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">إضافة صورة</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">أضف حتى 10 صور. الصورة الأولى ستكون الغلاف.</p>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offerType">نوع العرض *</Label>
              <Select
                value={formData.offerType}
                onValueChange={(value: "travel" | "umrah" | "hajj") => 
                  setFormData({ ...formData, offerType: value })
                }
                disabled={!agency.verified && formData.offerType !== "travel"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العرض" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">سفر عادي</SelectItem>
                  <SelectItem value="umrah" disabled={!agency.verified}>
                    عمرة {!agency.verified && "(للوكالات الموثقة فقط)"}
                  </SelectItem>
                  <SelectItem value="hajj" disabled={!agency.verified}>
                    حج {!agency.verified && "(للوكالات الموثقة فقط)"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Warning for Umrah/Hajj */}
            {formData.offerType !== "travel" && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      مسؤولية خاصة
                    </p>
                    <p className="text-sm text-muted-foreground">
                      عروض {formData.offerType === "umrah" ? "العمرة" : "الحج"} تتطلب مستوى عالٍ من الأمانة والمسؤولية. 
                      يرجى التأكد من صحة جميع المعلومات والالتزام بالمعايير الدينية والقانونية.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">عنوان العرض *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: رحلة استكشافية إلى بالي"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">الوجهة *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="مثال: بالي، إندونيسيا"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">المدة *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="مثال: 7 أيام / 6 ليالي"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (بالدولار) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="1500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">الفئة *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="resize-none"
                placeholder="اكتب وصفاً تفصيلياً للعرض..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Umrah & Hajj Specific Fields */}
        {formData.offerType !== "travel" && (
          <Card className="border-0 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-primary" />
                معلومات {formData.offerType === "umrah" ? "العمرة" : "الحج"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="season">الموسم / الفترة *</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder={formData.offerType === "umrah" ? "مثال: رمضان 1447" : "مثال: حج 1447 هـ"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodationDetails">تفاصيل الإقامة *</Label>
                <Textarea
                  id="accommodationDetails"
                  value={formData.accommodationDetails}
                  onChange={(e) => setFormData({ ...formData, accommodationDetails: e.target.value })}
                  rows={4}
                  className="resize-none"
                  placeholder="اذكر تفاصيل الفنادق، المسافة من الحرم، التصنيف، الخدمات..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportDetails">تفاصيل النقل *</Label>
                <Textarea
                  id="transportDetails"
                  value={formData.transportDetails}
                  onChange={(e) => setFormData({ ...formData, transportDetails: e.target.value })}
                  rows={4}
                  className="resize-none"
                  placeholder="اذكر تفاصيل الطيران، النقل الداخلي، الحافلات..."
                />
              </div>

              <div className="space-y-2">
                <Label>البرنامج الديني</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.religiousProgram.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1 pr-1">
                      {item}
                      <button
                        onClick={() => handleRemoveReligiousActivity(item)}
                        className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="مثال: زيارة غار حراء"
                    value={newReligiousActivity}
                    onChange={(e) => setNewReligiousActivity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddReligiousActivity())}
                  />
                  <Button variant="outline" onClick={handleAddReligiousActivity} className="bg-transparent">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Includes */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>يشمل العرض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.includes.map((item) => (
                <Badge key={item} variant="secondary" className="gap-1 pr-1">
                  {item}
                  <button
                    onClick={() => handleRemoveInclude(item)}
                    className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="مثال: الإقامة في فندق 5 نجوم"
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInclude())}
              />
              <Button variant="outline" onClick={handleAddInclude} className="bg-transparent">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Excludes */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>لا يشمل العرض</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.excludes.map((item) => (
                <Badge key={item} variant="outline" className="gap-1 pr-1">
                  {item}
                  <button
                    onClick={() => handleRemoveExclude(item)}
                    className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="مثال: تذاكر الطيران"
                value={newExclude}
                onChange={(e) => setNewExclude(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExclude())}
              />
              <Button variant="outline" onClick={handleAddExclude} className="bg-transparent">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isLoading}
            className="bg-transparent"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            حفظ كمسودة
          </Button>
          <Button onClick={() => handleSubmit("pending")} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            إرسال للمراجعة
          </Button>
        </div>
      </div>
    </div>
  )
}
