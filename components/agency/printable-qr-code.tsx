"use client"

import { useRef } from "react"
import { AgencyQRCode, downloadQRCode } from "./agency-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Printer, ArrowLeft } from "@/components/icons"
import { useRouter } from "next/navigation"
import type { Agency } from "@/lib/database.types"
import Image from "next/image"

interface PrintableQRCodeProps {
  agency: Agency
}

export function PrintableQRCode({ agency }: PrintableQRCodeProps) {
  const router = useRouter()
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
  const agencyUrl = `${appUrl}/agencies/${agency.slug}`

  const handleDownload = () => {
    downloadQRCode(agencyUrl, `safrgo-${agency.slug}-qr.png`, 1024)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden when printing */}
      <div className="print:hidden border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              رجوع
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل PNG
              </Button>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                طباعة
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="container mx-auto px-4 py-8 print:p-0">
        <div className="max-w-2xl mx-auto">
          {/* Print-optimized layout */}
          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-12 print:p-16 flex flex-col items-center space-y-8">
              {/* Agency Logo */}
              <div className="w-24 h-24 relative rounded-xl overflow-hidden border-2 border-border">
                <Image
                  src={agency.logo || "/placeholder.svg?height=96&width=96"}
                  alt={agency.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Agency Name */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {agency.name}
                </h1>
                {agency.location && (
                  <p className="text-lg text-muted-foreground">
                    {agency.location}
                  </p>
                )}
              </div>

              {/* QR Code */}
              <div ref={qrContainerRef} className="my-4">
                <AgencyQRCode url={agencyUrl} size={320} />
              </div>

              {/* Instructions */}
              <div className="text-center space-y-3 max-w-md">
                <h2 className="text-xl font-semibold text-foreground">
                  امسح الرمز لعرض ملفنا الكامل
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  استخدم كاميرا هاتفك أو تطبيق QR للوصول الفوري إلى عروضنا السياحية
                  ومعلومات الوكالة
                </p>
              </div>

              {/* URL */}
              <div className="text-center pt-4 border-t border-border w-full">
                <p className="text-sm text-muted-foreground font-mono">
                  {agencyUrl}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/icon.png"
                    alt="SAFRGO"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-foreground">SAFRGO</span>
                <span>•</span>
                <span>منصة السفر الموثوقة</span>
              </div>
            </CardContent>
          </Card>

          {/* Print Instructions - Hidden when printing */}
          <div className="print:hidden mt-8 p-6 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">
              نصائح للطباعة:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• استخدم ورق A4 أبيض عالي الجودة</li>
              <li>• اختر إعدادات الطباعة بالألوان</li>
              <li>• تأكد من تفعيل "طباعة الخلفيات"</li>
              <li>• اختبر مسح الرمز قبل التوزيع</li>
              <li>• يمكن تحميل الصورة بدقة 1024x1024 للطباعة الاحترافية</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
