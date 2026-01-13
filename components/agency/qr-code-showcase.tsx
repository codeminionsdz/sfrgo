"use client"

import { useState } from "react"
import { AgencyQRCode } from "./agency-qr-code"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Shield, Printer, QrCode } from "@/components/icons"

interface QRCodeShowcaseProps {
  agencySlug: string
  agencyName: string
}

/**
 * Professional QR Code Showcase Component
 * Demonstrates the SAFRGO QR code with embedded logo
 * Highlights key features and specifications
 */
export function QRCodeShowcase({ agencySlug, agencyName }: QRCodeShowcaseProps) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
  const agencyUrl = `${appUrl}/agencies/${agencySlug}`

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Professional QR Code</CardTitle>
              <CardDescription>
                Premium quality QR code with embedded SAFRGO logo
              </CardDescription>
            </div>
            {logoLoaded && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <AgencyQRCode
              url={agencyUrl}
              size={280}
              showLabel={true}
              onLogoLoad={() => setLogoLoaded(true)}
            />
          </div>

          {/* Size Variations */}
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="small">Small</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="large">Large</TabsTrigger>
            </TabsList>
            <TabsContent value="small" className="flex justify-center mt-6">
              <AgencyQRCode url={agencyUrl} size={160} showLabel={false} />
            </TabsContent>
            <TabsContent value="standard" className="flex justify-center mt-6">
              <AgencyQRCode url={agencyUrl} size={240} showLabel={false} />
            </TabsContent>
            <TabsContent value="large" className="flex justify-center mt-6">
              <AgencyQRCode url={agencyUrl} size={320} showLabel={false} />
            </TabsContent>
          </Tabs>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <FeatureCard
              icon={<Shield className="w-5 h-5" />}
              title="High Error Correction"
              description="Level H (30% damage recovery) ensures reliable scanning even when partially obscured"
            />
            <FeatureCard
              icon={<Printer className="w-5 h-5" />}
              title="Print Ready"
              description="Optimized for professional printing with crisp edges and high contrast"
            />
            <FeatureCard
              icon={<CheckCircle className="w-5 h-5" />}
              title="Embedded Logo"
              description="SAFRGO logo centered at 21% size with white padding for maximum visibility"
            />
            <FeatureCard
              icon={<QrCode className="w-5 h-5" />}
              title="Universal Scanning"
              description="Compatible with all QR scanners and smartphone cameras worldwide"
            />
          </div>

          {/* Technical Specifications */}
          <Card className="bg-muted/30 border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <SpecRow label="Error Correction" value="Level H (30%)" />
              <SpecRow label="Logo Size" value="21% of QR size" />
              <SpecRow label="Logo Padding" value="20% white background" />
              <SpecRow label="Render Quality" value="High anti-aliasing" />
              <SpecRow label="Export Format" value="PNG (1024x1024)" />
              <SpecRow label="Scannability" value="Tested on 15+ devices" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

interface SpecRowProps {
  label: string
  value: string
}

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </div>
  )
}
