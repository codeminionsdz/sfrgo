import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Check, Star, Zap, Crown, ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "Pricing - SAFRGO",
  description: "Annual subscription plans for travel agencies in Algeria. Transparent pricing in Algerian Dinar (DZD).",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "15,000",
      currency: "DZD",
      period: "/year",
      description: "Perfect for new agencies getting started",
      features: [
        "Agency profile page",
        "Up to 5 active offers",
        "Chat with travelers",
        "QR code for agency profile",
        "Standard visibility",
        "Basic support",
      ],
      cta: "Subscribe",
      href: "/auth/signup?role=agency",
      popular: false,
    },
    {
      name: "Professional",
      price: "30,000",
      currency: "DZD",
      period: "/year",
      description: "For established agencies ready to grow",
      features: [
        "Everything in Starter",
        "Up to 15 active offers",
        "Featured placement in listings",
        "Agency verification badge",
        "Advanced profile (media gallery)",
        "Analytics dashboard",
        "Priority support",
      ],
      cta: "Subscribe",
      href: "/auth/signup?role=agency",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "60,000",
      currency: "DZD",
      period: "/year",
      description: "For large agencies with high volume",
      features: [
        "Everything in Professional",
        "Unlimited offers",
        "Umrah & Hajj publishing access (if verified)",
        "Dedicated account support",
        "API access (future)",
        "Highest visibility & priority",
      ],
      cta: "Request Access",
      href: "/contact",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Subscription Plans for Travel Agencies
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparent annual pricing in Algerian Dinar. Choose the plan that fits your business.
            </p>
          </div>
        </section>

        {/* For Travelers */}
        <section className="py-12 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Star className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Free for Travelers</h2>
            <p className="text-muted-foreground">
              Browsing, saving, and chatting with agencies is completely free. Always.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative overflow-hidden border-0 ${
                    plan.popular 
                      ? 'ring-2 ring-primary shadow-xl' 
                      : 'bg-card'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        {plan.name === "Professional" && <Zap className="w-5 h-5 text-primary" />}
                        {plan.name === "Enterprise" && <Crown className="w-5 h-5 text-primary" />}
                        <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-lg text-muted-foreground ml-1">{plan.currency}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href={plan.href} className="block">
                      <Button 
                        className="w-full gap-2" 
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">How do I pay for my subscription?</h3>
                  <p className="text-sm text-muted-foreground">
                    After signing up and choosing a plan, our admin team will review your agency profile. Once approved, you'll receive payment instructions. You can pay via bank transfer or at our office.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">When does my subscription start?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your subscription activates after payment confirmation and receipt upload. The admin team will approve your payment within 24-48 hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Can I upgrade my plan later?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! You can upgrade at any time. Contact support to adjust your plan, and we'll calculate the prorated difference for the remaining period.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">What happens when my subscription expires?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your offers will be hidden from travelers until you renew. You'll receive renewal reminders 30 days and 7 days before expiration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to grow your agency?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join SAFRGO and connect with thousands of travelers across Algeria
            </p>
            <Link href="/auth/signup?role=agency">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
