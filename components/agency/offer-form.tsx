"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, X } from "@/components/icons"
import { createOffer } from "@/lib/actions/offers"

interface OfferFormProps {
  agencyId: string
  initialData?: any
}

export function OfferForm({ agencyId, initialData }: OfferFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights || [""])
  const [included, setIncluded] = useState<string[]>(initialData?.included || [""])
  const [notIncluded, setNotIncluded] = useState<string[]>(initialData?.not_included || [""])
  const [images, setImages] = useState<string[]>(initialData?.images || [])

  const addItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, ""])
  }

  const updateItem = (list: string[], setList: (items: string[]) => void, index: number, value: string) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const removeItem = (list: string[], setList: (items: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("agencyId", agencyId)
    formData.append("highlights", JSON.stringify(highlights.filter((h) => h.trim())))
    formData.append("included", JSON.stringify(included.filter((i) => i.trim())))
    formData.append("notIncluded", JSON.stringify(notIncluded.filter((i) => i.trim())))
    formData.append("images", JSON.stringify(images.filter((i) => i.trim())))

    const result = await createOffer(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/agency/offers")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">المعلومات الأساسية</h2>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">عنوان العرض *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                placeholder="مثال: رحلة سياحية إلى دبي - 5 أيام"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">الوجهة *</Label>
                <Input
                  id="destination"
                  name="destination"
                  required
                  defaultValue={initialData?.destination}
                  placeholder="مثال: دبي"
                />
              </div>
              <div>
                <Label htmlFor="country">الدولة *</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  defaultValue={initialData?.country}
                  placeholder="مثال: الإمارات"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                name="description"
                required
                defaultValue={initialData?.description}
                rows={5}
                placeholder="اكتب وصفاً تفصيلياً للرحلة..."
              />
            </div>

            <div>
              <Label htmlFor="category">الفئة *</Label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category || ""}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">اختر فئة</option>
                <option value="adventure">مغامرة</option>
                <option value="beach">شاطئ</option>
                <option value="culture">ثقافة</option>
                <option value="family">عائلي</option>
                <option value="luxury">فاخر</option>
                <option value="nature">طبيعة</option>
                <option value="city">مدينة</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">التسعير والمدة</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">السعر *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                defaultValue={initialData?.price}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData?.original_price}
                placeholder="1500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">العملة *</Label>
              <select
                id="currency"
                name="currency"
                required
                defaultValue={initialData?.currency || "DZD"}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="DZD">دج (DZD)</option>
                <option value="USD">دولار (USD)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="duration">المدة *</Label>
              <Input
                id="duration"
                name="duration"
                required
                defaultValue={initialData?.duration}
                placeholder="5 أيام / 4 ليالي"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureDate">تاريخ المغادرة *</Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                required
                defaultValue={initialData?.departure_date}
              />
            </div>
            <div>
              <Label htmlFor="maxGroupSize">الحد الأقصى للمجموعة</Label>
              <Input
                id="maxGroupSize"
                name="maxGroupSize"
                type="number"
                min="1"
                defaultValue={initialData?.max_group_size}
                placeholder="20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">الصورة الرئيسية</h2>
          <div>
            <Label htmlFor="image">رابط الصورة *</Label>
            <Input
              id="image"
              name="image"
              type="url"
              required
              defaultValue={initialData?.image}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">ادخل رابط صورة من الإنترنت</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">أبرز المعالم</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(highlights, setHighlights)}>
              <Plus className="w-4 h-4 mr-1" />
              إضافة
            </Button>
          </div>
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={highlight}
                onChange={(e) => updateItem(highlights, setHighlights, index, e.target.value)}
                placeholder="مثال: زيارة برج خليفة"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(highlights, setHighlights, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">ما هو مشمول</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(included, setIncluded)}>
              <Plus className="w-4 h-4 mr-1" />
              إضافة
            </Button>
          </div>
          {included.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(included, setIncluded, index, e.target.value)}
                placeholder="مثال: الإقامة في فندق 5 نجوم"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(included, setIncluded, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">ما هو غير مشمول</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(notIncluded, setNotIncluded)}>
              <Plus className="w-4 h-4 mr-1" />
              إضافة
            </Button>
          </div>
          {notIncluded.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(notIncluded, setNotIncluded, index, e.target.value)}
                placeholder="مثال: تذاكر الطيران"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(notIncluded, setNotIncluded, index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "نشر العرض"
          )}
        </Button>
      </div>
    </form>
  )
}
