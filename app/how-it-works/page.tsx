import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Search, MessageCircle, CheckCircle, Users, Shield, Star, ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "How It Works - SAFRGO",
  description: "Learn how SAFRGO connects travelers with trusted travel agencies. Simple, secure, and transparent.",
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              How SAFRGO Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified travel agencies, discover curated experiences, and book your next adventure with confidence.
            </p>
          </div>
        </section>

        {/* For Travelers */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">For Travelers</h2>
              <p className="text-lg text-muted-foreground">Find and book your perfect trip in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">1. Explore</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Discover Offers</h3>
                  <p className="text-muted-foreground">
                    Browse curated travel experiences from verified agencies. Filter by destination, budget, and travel style.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">2. Connect</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Chat with Agencies</h3>
                  <p className="text-muted-foreground">
                    Ask questions, customize your trip, and get instant responses from trusted travel experts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">3. Book</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Secure Your Trip</h3>
                  <p className="text-muted-foreground">
                    Finalize your booking with transparent pricing and secure payment. Your journey begins here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Agencies */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">For Travel Agencies</h2>
              <p className="text-lg text-muted-foreground">Grow your business with SAFRGO's platform</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">1. Register</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Create Your Profile</h3>
                  <p className="text-muted-foreground">
                    Sign up and complete verification. Build your agency profile with photos, description, and credentials.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">2. List Offers</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Showcase Your Services</h3>
                  <p className="text-muted-foreground">
                    Create beautiful listings for your travel packages. Highlight destinations, pricing, and unique experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">3. Connect</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Engage with Travelers</h3>
                  <p className="text-muted-foreground">
                    Respond to inquiries, build relationships, and convert conversations into bookings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Built on Trust</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your safety and satisfaction are our top priorities
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Verified Agencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Every agency goes through our verification process to ensure legitimacy and quality standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Transparent Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden fees. All costs are clearly displayed before booking.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Secure Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    All conversations happen within our platform for your protection and peace of mind.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Real Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Authentic feedback from verified travelers helps you make informed decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of travelers discovering their next adventure
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg" className="gap-2">
                  Explore Offers
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/agencies">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Browse Agencies
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
