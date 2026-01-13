"use client"

import { AgencyQRCode, downloadQRCode } from "./agency-qr-code"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "@/components/icons"
import { toast } from "sonner"

interface QRCodeCardProps {
  agencySlug: string
  agencyName: string
}

export function QRCodeCard({ agencySlug, agencyName }: QRCodeCardProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
  const agencyUrl = `${appUrl}/agencies/${agencySlug}`

  const handleDownloadQRCode = () => {
    downloadQRCode(agencyUrl, `safrgo-${agencySlug}-qr.png`, 1024)
      .then(() => {
        toast.success("تم تحميل رمز QR بنجاح!")
      })
      .catch(() => {
        toast.error("فشل تحميل رمز QR")
      })
  }

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${agencyName} - SAFRGO`,
          text: `زر ملف ${agencyName} على سفرقو`,
          url: agencyUrl,
        })
        toast.success("تمت المشاركة بنجاح!")
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("فشلت المشاركة")
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(agencyUrl)
      toast.success("تم نسخ الرابط!")
    }
  }

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>رمز QR للوكالة</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* QR Code Display */}
        <AgencyQRCode url={agencyUrl} size={240} showLabel={false} />

        {/* Description */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            امسح الرمز لعرض ملف الوكالة
          </p>
          <p className="text-xs text-muted-foreground">
            جودة عالية • جاهز للطباعة • قابل للمسح
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleDownloadQRCode}
            variant="outline"
            className="flex-1 gap-2 bg-transparent"
          >
            <Download className="w-4 h-4" />
            تحميل PNG
          </Button>
          <Button
            onClick={shareQRCode}
            variant="outline"
            className="flex-1 gap-2 bg-transparent"
          >
            <Share2 className="w-4 h-4" />
            مشاركة
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
