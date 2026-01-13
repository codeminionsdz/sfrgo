import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Briefcase, Users, Rocket, Heart, ArrowRight, Mail } from "@/components/icons"

export const metadata: Metadata = {
  title: "Careers - SAFRGO",
  description: "Join our team and help connect travelers with amazing experiences worldwide.",
}

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of travel discovery and connect people with their dream destinations.
            </p>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why SAFRGO?</h2>
              <p className="text-lg text-muted-foreground">We're building something special</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 bg-card">
                <CardContent className="p-8 text-center">
                  <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Fast Growing</h3>
                  <p className="text-muted-foreground">
                    Join us in our exciting growth phase and make a real impact on our product and vision.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Great Team</h3>
                  <p className="text-muted-foreground">
                    Work with talented, passionate people who love travel and technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">Meaningful Work</h3>
                  <p className="text-muted-foreground">
                    Help connect travelers with trusted agencies and create unforgettable experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What We Offer</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Remote-First Culture</h3>
                  <p className="text-sm text-muted-foreground">
                    Work from anywhere. We believe in flexibility and trust our team to do great work.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Competitive Compensation</h3>
                  <p className="text-sm text-muted-foreground">
                    Fair salary, equity options, and performance bonuses for exceptional work.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Learning Budget</h3>
                  <p className="text-sm text-muted-foreground">
                    Annual budget for courses, conferences, and professional development.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Health & Wellness</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive health insurance and wellness programs to keep you healthy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Travel Perks</h3>
                  <p className="text-sm text-muted-foreground">
                    Special discounts on travel packages through our partner agencies.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Flexible Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    We care about results, not hours. Work when you're most productive.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">We're Growing</h2>
              <p className="text-lg text-muted-foreground">
                While we don't have specific openings right now, we're always looking for talented people.
              </p>
            </div>

            <Card className="border-0 bg-card">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">Interested in joining us?</h3>
                <p className="text-muted-foreground mb-6">
                  We're particularly interested in developers, designers, marketers, and customer success specialists who are passionate about travel and technology.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Send us your resume, portfolio, and tell us why you want to join SAFRGO.
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <a href="mailto:careers@safrgo.online">
                    <Mail className="w-4 h-4" />
                    Send Your Application
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Trust First</h3>
                  <p className="text-sm text-muted-foreground">
                    We build trust with our users, partners, and each other through transparency and reliability.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">User-Centric</h3>
                  <p className="text-sm text-muted-foreground">
                    Every decision starts with asking: "How does this help our users?"
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Move Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    We ship quickly, learn fast, and iterate based on real feedback.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Think Global</h3>
                  <p className="text-sm text-muted-foreground">
                    We're building for travelers and agencies worldwide, with respect for diverse cultures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
