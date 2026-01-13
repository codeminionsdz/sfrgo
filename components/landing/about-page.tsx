"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import {
  CheckCircle,
  Shield,
  Users,
  Globe,
  BadgeCheck,
  TrendingUp,
  Heart,
  Star,
  Compass,
  Building2,
} from "@/components/icons"

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Making travel booking transparent and trustworthy
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                SAFRGO connects travelers with verified travel agencies across Algeria, creating a safer and more transparent booking experience for everyone.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    <Compass className="w-5 h-5" />
                    Start exploring
                  </Button>
                </Link>
                <Link href="/agency-setup">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Building2 className="w-5 h-5" />
                    Join as agency
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our mission</h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Travel should be exciting, not stressful. Yet for too long, finding a trustworthy travel agency in Algeria meant relying on word-of-mouth recommendations or taking risks with unknown providers.
                </p>
                <p>
                  <span className="font-semibold text-foreground">SAFRGO was founded to change that.</span> We built a platform where transparency meets trust, where every agency is verified, and where travelers can book with confidence.
                </p>
                <p>
                  Whether you're planning a pilgrimage to Mecca, a European adventure, or exploring Algeria's hidden gems, SAFRGO ensures you're working with legitimate, professional agencies that value your safety and satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why travelers & agencies trust SAFRGO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Verified agencies only</h3>
                  <p className="text-muted-foreground">
                    Every agency on SAFRGO goes through a rigorous verification process. We check licenses, business registration, and track record to ensure legitimacy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BadgeCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Transparent pricing</h3>
                  <p className="text-muted-foreground">
                    No hidden fees, no surprise charges. All prices are displayed upfront in Algerian Dinars (DZD), so you know exactly what you're paying.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Authentic reviews</h3>
                  <p className="text-muted-foreground">
                    Real reviews from real travelers. We verify bookings before allowing reviews, ensuring every rating reflects genuine experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Direct communication</h3>
                  <p className="text-muted-foreground">
                    Chat directly with agencies through our secure messaging system. Ask questions, customize your trip, and get personalized service.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Multi-currency support</h3>
                  <p className="text-muted-foreground">
                    Browse prices in DZD, USD, EUR, or GBP. International travelers and local Algerians both feel at home on our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Built for Algeria</h3>
                  <p className="text-muted-foreground">
                    We understand the local market, regulations, and travel culture. SAFRGO is designed specifically for the Algerian travel ecosystem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How SAFRGO works</h2>

            <div className="max-w-4xl mx-auto space-y-12">
              {/* For Travelers */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Compass className="w-6 h-6 text-primary" />
                  For travelers
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Explore verified offers</h4>
                      <p className="text-muted-foreground">
                        Browse travel packages from verified agencies. Filter by destination, price, duration, and more.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Connect with agencies</h4>
                      <p className="text-muted-foreground">
                        Message agencies directly to ask questions, request customizations, or get more details about your trip.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Book with confidence</h4>
                      <p className="text-muted-foreground">
                        Make informed decisions based on transparent pricing, verified reviews, and direct communication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Agencies */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  For agencies
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Get verified</h4>
                      <p className="text-muted-foreground">
                        Submit your business documents and complete our verification process. We check licenses, registration, and credibility.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Create offers</h4>
                      <p className="text-muted-foreground">
                        List your travel packages with rich details, photos, and pricing. Showcase what makes your agency special.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Grow your business</h4>
                      <p className="text-muted-foreground">
                        Connect with thousands of travelers, build your reputation through reviews, and grow your customer base.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">Our commitment to trust & safety</h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Trust is the foundation of travel. Here's how we protect it:
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Rigorous verification</h4>
                    <p className="text-muted-foreground">
                      We manually review every agency application, checking business licenses, tourism permits, and professional credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Continuous monitoring</h4>
                    <p className="text-muted-foreground">
                      Agencies are monitored for compliance, customer satisfaction, and professional conduct. We suspend or remove problematic partners.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Verified reviews only</h4>
                    <p className="text-muted-foreground">
                      Reviews come from confirmed travelers who actually booked through our platform. Fake reviews are impossible.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Transparent disputes</h4>
                    <p className="text-muted-foreground">
                      If issues arise, our support team mediates fairly between travelers and agencies to find resolutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to start your journey?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers discovering amazing destinations through verified, trusted agencies.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/explore">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Compass className="w-5 h-5" />
                    Explore offers
                  </Button>
                </Link>
                <Link href="/agencies">
                  <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                    <Building2 className="w-5 h-5" />
                    Browse agencies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
