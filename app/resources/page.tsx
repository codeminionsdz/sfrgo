import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { BookOpen, Star, MessageCircle, TrendingUp, Shield, Camera, CheckCircle, ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "Partner Resources - SAFRGO",
  description: "Guides and resources to help travel agencies succeed on SAFRGO.",
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Partner Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed on SAFRGO. Guides, tips, and best practices for travel agencies.
            </p>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Getting Started</h2>
              <p className="text-muted-foreground">Your first steps to success on SAFRGO</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your agency logo, cover image, description, and location. Complete profiles get 3x more visibility.
                  </p>
                  <Link href="/agency" className="text-sm text-primary hover:underline">
                    Set up profile →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Create Great Offers</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use high-quality images, clear descriptions, and competitive pricing. First 3 offers are free!
                  </p>
                  <Link href="/agency/offers/new" className="text-sm text-primary hover:underline">
                    Create offer →
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Engage with Travelers</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Respond quickly to messages (under 2 hours) to build trust and increase booking chances.
                  </p>
                  <Link href="/agency/messages" className="text-sm text-primary hover:underline">
                    View messages →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Best Practices</h2>
              <p className="text-muted-foreground">Tips from our most successful agencies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <Camera className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">Photo Quality Matters</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Use high-resolution images (at least 1200px wide)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Show real destinations, not stock photos
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Include 5-8 images per offer for best results
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Feature people enjoying experiences when possible
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <MessageCircle className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">Communication Excellence</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Respond within 2 hours during business hours
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Be professional but friendly and personal
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Answer all questions clearly and completely
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Follow up if you don't hear back in 24 hours
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <Star className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">Build Your Reputation</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Get verified to show you're a trusted agency
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Ask satisfied customers for reviews
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Update offers regularly to show you're active
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Share your QR code offline to drive traffic
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <TrendingUp className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">Pricing Strategy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Be transparent - include all costs upfront
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Offer both budget and premium options
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Use "original price" to show value/savings
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Highlight what's included vs. excluded
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Verification Benefits */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Get Verified</h2>
              <p className="text-muted-foreground">
                Verified agencies get 5x more inquiries and bookings
              </p>
            </div>

            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Why Get Verified?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          Verified badge increases trust immediately
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          Higher placement in search results
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          Eligible for featured spots and promotions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          Unlock Umrah & Hajj service offerings
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">How to Get Verified</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                          1
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Complete your agency profile with all details
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                          2
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Submit business registration documents
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                          3
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Our team reviews (2-3 business days)
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                          4
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Get verified badge and unlock benefits
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center">
                  <Link href="/agency/settings">
                    <Button size="lg" className="gap-2">
                      Start Verification Process
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Contact Support
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg">
                  View Subscription Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
