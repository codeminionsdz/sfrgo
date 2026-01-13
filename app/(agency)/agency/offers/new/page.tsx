import type { Metadata } from "next"
import { OfferForm } from "@/components/agency/offer-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "@/components/icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Create Offer - SAFRGO Agency",
  description: "Create a new travel offer",
}

export default async function NewOfferPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: agency } = await supabase
    .from("agencies")
    .select("id, name, status, subscription_status, offer_limit, offer_count")
    .eq("owner_id", user.id)
    .single()

  if (!agency) {
    redirect("/agency-setup")
  }

  if (agency.status === "inactive") {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">الوكالة غير نشطة</h2>
                <p className="text-muted-foreground mb-4">
                  يجب الموافقة على وكالتك من قبل الإدارة قبل أن تتمكن من إنشاء عروض. يرجى التأكد من:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                  <li>إكمال ملف الوكالة بالكامل</li>
                  <li>اختيار خطة اشتراك</li>
                  <li>رفع إيصال الدفع</li>
                  <li>انتظار موافقة الإدارة</li>
                </ul>
                <Link href="/agency/subscription">
                  <Button>إدارة الاشتراك</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (agency.status === "suspended") {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">الوكالة موقوفة</h2>
                <p className="text-muted-foreground">
                  تم إيقاف وكالتك مؤقتاً. يرجى التواصل مع الإدارة لمعرفة السبب وحل المشكلة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (agency.subscription_status !== "active") {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">اشتراك غير نشط</h2>
                <p className="text-muted-foreground mb-4">
                  {agency.subscription_status === "pending"
                    ? "اشتراكك في انتظار موافقة الإدارة. سيتم إخطارك عند الموافقة."
                    : agency.subscription_status === "rejected"
                      ? "تم رفض طلب الاشتراك الخاص بك. يرجى التواصل مع الإدارة."
                      : "تحتاج إلى اشتراك نشط لإنشاء عروض."}
                </p>
                <Link href="/agency/subscription">
                  <Button>إدارة الاشتراك</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (agency.offer_count >= agency.offer_limit) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">وصلت للحد الأقصى من العروض</h2>
                <p className="text-muted-foreground mb-4">
                  لقد وصلت إلى الحد الأقصى من العروض ({agency.offer_limit}) المسموح بها في خطتك الحالية. يرجى ترقية
                  اشتراكك لإنشاء المزيد من العروض.
                </p>
                <Link href="/agency/subscription">
                  <Button>ترقية الخطة</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">إنشاء عرض جديد</h1>
        <p className="text-muted-foreground">أضف تفاصيل رحلتك الجديدة</p>
        <p className="text-sm text-muted-foreground mt-2">
          العروض المتاحة: {agency.offer_count} / {agency.offer_limit}
        </p>
      </div>
      <OfferForm agencyId={agency.id} />
    </div>
  )
}
