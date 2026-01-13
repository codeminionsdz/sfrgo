"use client"

import { AgencyQRCode } from "@/components/agency/agency-qr-code"
import { QRCodeCard } from "@/components/agency/qr-code-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestQRPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
  
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">اختبار QR Code مع الشعار</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Test 1: Basic QR Code */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code أساسي</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <AgencyQRCode 
              url={`${appUrl}/agencies/test-agency`}
              size={280}
              showLabel={true}
              onLogoLoad={() => {
                console.log("✓ تم تحميل الشعار بنجاح!")
                alert("✓ تم تحميل شعار SAFRGO بنجاح!")
              }}
            />
          </CardContent>
        </Card>

        {/* Test 2: QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code بطاقة تفاعلية</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodeCard 
              agencySlug="test-agency"
              agencyName="وكالة الاختبار"
            />
          </CardContent>
        </Card>

        {/* Test 3: Different Sizes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>أحجام مختلفة</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-around gap-8">
            <div className="text-center">
              <p className="text-sm mb-2">صغير (160px)</p>
              <AgencyQRCode 
                url={`${appUrl}/agencies/test`}
                size={160}
              />
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">متوسط (240px)</p>
              <AgencyQRCode 
                url={`${appUrl}/agencies/test`}
                size={240}
              />
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">كبير (320px)</p>
              <AgencyQRCode 
                url={`${appUrl}/agencies/test`}
                size={320}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">ملاحظة:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>يجب أن يظهر شعار SAFRGO في وسط كل رمز QR</li>
            <li>الشعار محاط بدائرة بيضاء للوضوح</li>
            <li>تحقق من وحدة التحكم (Console) لرسائل التحميل</li>
            <li>امسح QR Code بكاميرا هاتفك للتأكد من أنه يعمل</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
