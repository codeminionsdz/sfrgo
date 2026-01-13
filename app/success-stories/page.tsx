import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Trophy, Star, Heart, TrendingUp, Users, Globe } from "@/components/icons"

export const metadata: Metadata = {
  title: "Success Stories - SAFRGO",
  description: "See how travel agencies are growing their business with SAFRGO.",
}

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real agencies, real growth. See how SAFRGO is helping travel businesses thrive.
            </p>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-0 bg-card">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Stories Coming Soon
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We're just getting started! As our partner agencies grow and succeed on the platform, 
                  we'll be sharing their inspiring stories here.
                </p>
                <p className="text-muted-foreground mb-8">
                  Check back soon to see how agencies are:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-8">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Increasing their bookings by 200%+
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Reaching international travelers
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Building 5-star reputations
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Creating loyal customer bases
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What You Can Expect
              </h2>
              <p className="text-muted-foreground">
                When we share success stories, here's what you'll learn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Real Numbers</h3>
                  <p className="text-sm text-muted-foreground">
                    Actual growth metrics, booking increases, and revenue impact from agencies using SAFRGO.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Best Practices</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn the strategies and tactics that successful agencies use to stand out and convert leads.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Honest Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Real challenges, solutions, and lessons learned from agencies building their business.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Early Success Stats */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Early Platform Stats
              </h2>
              <p className="text-muted-foreground">
                We're proud of the community we're building
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">Growing</p>
                  <p className="text-sm text-muted-foreground">Active Agencies</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">Daily</p>
                  <p className="text-sm text-muted-foreground">New Travelers</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">Fast</p>
                  <p className="text-sm text-muted-foreground">Response Times</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">High</p>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Want to Be Featured?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you're an agency growing on SAFRGO and have a story to share, 
              we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup?role=agency">
                <Button size="lg">
                  Join as an Agency
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Share Your Story
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
