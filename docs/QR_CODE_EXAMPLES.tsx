/**
 * Example Integration: Agency QR Code in Profile Page
 * 
 * This file demonstrates how to integrate the SAFRGO QR code system
 * into an agency profile page with multiple use cases.
 */

import { AgencyQRCode, downloadQRCode } from "@/components/agency/agency-qr-code"
import { QRCodeCard } from "@/components/agency/qr-code-card"
import { QRCodeShowcase } from "@/components/agency/qr-code-showcase"
import { PrintableQRCode } from "@/components/agency/printable-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer, Share2 } from "@/components/icons"
import { useRef } from "react"

// ========================================
// EXAMPLE 1: Basic QR Code Display
// ========================================
export function BasicQRExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agency QR Code</h2>
      <AgencyQRCode 
        url="https://safrgo.com/agencies/awesome-travel"
        size={256}
        showLabel={true}
      />
    </div>
  )
}

// ========================================
// EXAMPLE 2: QR Code with Download
// ========================================
export function QRCodeWithDownload() {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      downloadQRCode(canvas, "agency-qr-code.png", 1024)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={qrRef}>
          <AgencyQRCode 
            url="https://safrgo.com/agencies/awesome-travel"
            size={240}
            showLabel={false}
          />
        </div>
        <Button onClick={handleDownload} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  )
}

// ========================================
// EXAMPLE 3: Interactive QR Card
// ========================================
export function InteractiveQRCard() {
  return (
    <QRCodeCard 
      agencySlug="awesome-travel"
      agencyName="Awesome Travel Agency"
    />
  )
}

// ========================================
// EXAMPLE 4: Multiple Sizes
// ========================================
export function MultipleSizesExample() {
  const sizes = [
    { size: 160, label: "Small (160px)" },
    { size: 240, label: "Medium (240px)" },
    { size: 320, label: "Large (320px)" },
  ]

  return (
    <div className="space-y-8">
      {sizes.map(({ size, label }) => (
        <div key={size} className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <AgencyQRCode 
            url="https://safrgo.com/agencies/awesome-travel"
            size={size}
          />
        </div>
      ))}
    </div>
  )
}

// ========================================
// EXAMPLE 5: Full Profile Section
// ========================================
interface AgencyData {
  id: string
  slug: string
  name: string
  logo: string
  location: string
}

export function AgencyProfileQRSection({ agency }: { agency: AgencyData }) {
  const qrRef = useRef<HTMLDivElement>(null)
  const agencyUrl = `${window.location.origin}/agencies/${agency.slug}`

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      downloadQRCode(canvas, `${agency.slug}-qr.png`, 1024)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: agency.name,
          text: `Check out ${agency.name} on SAFRGO`,
          url: agencyUrl,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      await navigator.clipboard.writeText(agencyUrl)
      alert("Link copied to clipboard!")
    }
  }

  const handlePrint = () => {
    window.open(`/agency/qr-code?slug=${agency.slug}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share This Agency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div ref={qrRef} className="flex justify-center">
          <AgencyQRCode 
            url={agencyUrl}
            size={280}
            showLabel={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center">
          Scan this QR code to instantly view our complete profile, offers, and contact information
        </p>
      </CardContent>
    </Card>
  )
}

// ========================================
// EXAMPLE 6: Showcase with Features
// ========================================
export function ShowcaseExample() {
  return (
    <QRCodeShowcase 
      agencySlug="awesome-travel"
      agencyName="Awesome Travel Agency"
    />
  )
}

// ========================================
// EXAMPLE 7: Printable Version
// ========================================
export function PrintableExample({ agency }: { agency: AgencyData }) {
  return <PrintableQRCode agency={agency} />
}

// ========================================
// EXAMPLE 8: Dynamic URL Generation
// ========================================
export function DynamicQRExample({ agencyId }: { agencyId: string }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const agencyUrl = `${baseUrl}/agencies/${agencyId}`

  return (
    <AgencyQRCode 
      url={agencyUrl}
      size={256}
      showLabel={true}
      onLogoLoad={() => console.log("QR code ready!")}
    />
  )
}

// ========================================
// EXAMPLE 9: With Loading State
// ========================================
export function QRWithLoadingState() {
  return (
    <Card>
      <CardContent className="p-6 flex justify-center">
        <AgencyQRCode 
          url="https://safrgo.com/agencies/awesome-travel"
          size={240}
          showLabel={true}
          onLogoLoad={() => {
            console.log("QR code loaded and ready")
            // You can trigger analytics, enable download button, etc.
          }}
        />
      </CardContent>
    </Card>
  )
}

// ========================================
// USAGE IN ACTUAL PAGE
// ========================================
export default function AgencyQRCodePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // In a real implementation, fetch agency data
  const agency = {
    id: "1",
    slug: params.slug,
    name: "Awesome Travel Agency",
    logo: "/placeholder-logo.png",
    location: "Dubai, UAE",
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">QR Code Examples</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <BasicQRExample />
        <QRCodeWithDownload />
        <InteractiveQRCard />
        <AgencyProfileQRSection agency={agency} />
      </div>

      <ShowcaseExample />
    </div>
  )
}
