"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Loader2, ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"

export default function OGDebugPage() {
  const [offerId, setOfferId] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [metadataStatus, setMetadataStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [imageUrl, setImageUrl] = useState("")
  const [pageUrl, setPageUrl] = useState("")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"

  const testOffer = async () => {
    if (!offerId.trim()) {
      toast.error("الرجاء إدخال معرف العرض")
      return
    }

    setLoading(true)
    setImageStatus("loading")
    setMetadataStatus("loading")

    const testImageUrl = `${appUrl}/api/og/offer/${offerId}`
    const testPageUrl = `${appUrl}/offers/${offerId}`
    
    setImageUrl(testImageUrl)
    setPageUrl(testPageUrl)

    // Test image generation
    try {
      const imgResponse = await fetch(testImageUrl)
      if (imgResponse.ok) {
        setImageStatus("success")
      } else {
        setImageStatus("error")
        toast.error(`فشل توليد الصورة: ${imgResponse.status}`)
      }
    } catch (error) {
      setImageStatus("error")
      toast.error("خطأ في توليد الصورة")
    }

    // Test page metadata
    try {
      const pageResponse = await fetch(testPageUrl)
      if (pageResponse.ok) {
        const html = await pageResponse.text()
        if (html.includes('property="og:image"') && html.includes('property="og:title"')) {
          setMetadataStatus("success")
        } else {
          setMetadataStatus("error")
          toast.error("الميتاداتا غير مكتملة")
        }
      } else {
        setMetadataStatus("error")
        toast.error(`فشل تحميل الصفحة: ${pageResponse.status}`)
      }
    } catch (error) {
      setMetadataStatus("error")
      toast.error("خطأ في تحميل الصفحة")
    }

    setLoading(false)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("تم نسخ الرابط")
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")
  }

  const testInFacebook = () => {
    window.open(`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(pageUrl)}`, "_blank")
  }

  const testInTwitter = () => {
    window.open(`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(pageUrl)}`, "_blank")
  }

  const testInOpenGraph = () => {
    window.open(`https://www.opengraph.xyz/?url=${encodeURIComponent(pageUrl)}`, "_blank")
  }

  const StatusIcon = ({ status }: { status: "idle" | "loading" | "success" | "error" }) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case "success":
        return <Check className="w-5 h-5 text-green-500" />
      case "error":
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Open Graph Debug Tool</h1>
          <p className="text-muted-foreground mt-2">
            Test Open Graph metadata and image generation for offer pages
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Offer</CardTitle>
            <CardDescription>Enter an offer ID to test OG implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Offer ID (UUID)"
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && testOffer()}
              />
              <Button onClick={testOffer} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={imageStatus} />
                  <div>
                    <div className="font-medium">OG Image Generation</div>
                    <div className="text-sm text-muted-foreground">/api/og/offer/[id]</div>
                  </div>
                </div>
                {imageUrl && imageStatus === "success" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyUrl(imageUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openInNewTab(imageUrl)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={metadataStatus} />
                  <div>
                    <div className="font-medium">Page Metadata</div>
                    <div className="text-sm text-muted-foreground">/offers/[id]</div>
                  </div>
                </div>
                {pageUrl && metadataStatus === "success" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyUrl(pageUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openInNewTab(pageUrl)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {imageStatus === "success" && metadataStatus === "success" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How the offer will appear when shared</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <img src={imageUrl} alt="OG Preview" className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test on Platforms</CardTitle>
                <CardDescription>Verify how the link appears on different platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={testInFacebook}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test on Facebook Debugger
                </Button>
                <Button className="w-full" variant="outline" onClick={testInTwitter}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test on Twitter Card Validator
                </Button>
                <Button className="w-full" variant="outline" onClick={testInOpenGraph}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test on OpenGraph.xyz
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Offer Page:</div>
                  <div className="flex gap-2">
                    <Input value={pageUrl} readOnly className="font-mono text-xs" />
                    <Button size="sm" variant="outline" onClick={() => copyUrl(pageUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">OG Image:</div>
                  <div className="flex gap-2">
                    <Input value={imageUrl} readOnly className="font-mono text-xs" />
                    <Button size="sm" variant="outline" onClick={() => copyUrl(imageUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Testing Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
            <p>• WhatsApp caches URLs for ~7 days. Use new offers or add ?v=2 to URL to bypass cache</p>
            <p>• Facebook Debugger allows you to force re-scrape with &quot;Scrape Again&quot; button</p>
            <p>• Test on actual WhatsApp/Facebook for best results (debuggers may differ)</p>
            <p>• Image generation uses Edge runtime - expect &lt;100ms generation time</p>
            <p>• OG images are cached for 24 hours with 12h stale-while-revalidate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
