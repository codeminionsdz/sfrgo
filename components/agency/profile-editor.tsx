"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, BadgeCheck, Loader2 } from "@/components/icons"
import { updateAgencyProfile } from "@/lib/actions/agencies"
import type { Agency } from "@/lib/database.types"
import { QRCodeCard } from "./qr-code-card"
import { LocationPicker } from "./location-picker"

interface AgencyProfileEditorProps {
  agency: Agency
}

export function AgencyProfileEditor({ agency }: AgencyProfileEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: agency.name,
    description: agency.description || "",
    location: agency.location || "",
    latitude: agency.latitude || null,
    longitude: agency.longitude || null,
    specialties: agency.specialties || [],
    phone: agency.phone || "",
    email: agency.email || "",
    website: agency.website || "",
    logo: agency.logo || "",
    cover_image: agency.cover_image || "",
  })
  const [newSpecialty, setNewSpecialty] = useState("")

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({ ...formData, latitude: lat, longitude: lng })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to base64 for simple storage
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      if (type === 'logo') {
        setFormData({ ...formData, logo: base64String })
      } else {
        setFormData({ ...formData, cover_image: base64String })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddSpecialty = () => {
    if (newSpecialty && !formData.specialties.includes(newSpecialty)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty],
      })
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    const result = await updateAgencyProfile(agency.id, formData)

    setIsLoading(false)

    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || "فشل في تحديث الملف الشخصي")
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">ملف الوكالة</h1>
        <p className="text-muted-foreground">إدارة كيفية ظهور وكالتك للمسافرين</p>
      </div>

      <div className="space-y-6">
        {/* Cover Image */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>صورة الغلاف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 rounded-xl overflow-hidden bg-secondary mb-4">
              <Image
                src={formData.cover_image || "/placeholder.svg?height=200&width=800&query=travel agency cover"}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <Button type="button" variant="secondary" onClick={() => document.getElementById('cover-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    تغيير الغلاف
                  </Button>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">الحجم الموصى به: 1400x400 بكسل، JPG أو PNG</p>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>شعار الوكالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary cursor-pointer group">
                <Image
                  src={formData.logo || "/placeholder.svg?height=100&width=100&query=travel agency logo"}
                  alt=""
                  fill
                  className="object-cover"
                />
                <label htmlFor="logo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-6 h-6 text-white" />
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                  />
                </label>
              </div>
              <div>
                <Button 
                  type="button"
                  variant="outline" 
                  className="mb-2 bg-transparent"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  رفع شعار جديد
                </Button>
                <p className="text-sm text-muted-foreground">صورة مربعة، 200x200 بكسل على الأقل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الوكالة</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {agency.verified && (
                  <Badge variant="secondary" className="gap-1 flex-shrink-0">
                    <BadgeCheck className="w-3 h-3" />
                    موثق
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="المدينة، الدولة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="resize-none"
                placeholder="اكتب وصفاً عن وكالتك..."
              />
              <p className="text-xs text-muted-foreground">{formData.description.length}/500 حرف</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 XX XXX XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
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
              <Label htmlFor="website">الموقع الإلكتروني</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.agency.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>التخصصات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="gap-1 pr-1">
                  {specialty}
                  <button
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="أضف تخصص..."
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
              />
              <Button variant="outline" onClick={handleAddSpecialty} className="bg-transparent">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Location Map */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle>موقع المكتب على الخريطة</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              حدد موقع مكتبك الفعلي ليتمكن العملاء من زيارتك
            </p>
          </CardHeader>
          <CardContent>
            <LocationPicker
              initialLat={formData.latitude}
              initialLng={formData.longitude}
              onLocationChange={handleLocationChange}
            />
          </CardContent>
        </Card>

        {/* QR Code */}
        <QRCodeCard agencySlug={agency.slug} agencyName={agency.name} />

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="bg-transparent">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
