import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Newspaper, Download, Mail, Building2, Globe } from "@/components/icons"

export const metadata: Metadata = {
  title: "Press - SAFRGO",
  description: "Media resources, press releases, and brand assets for SAFRGO.",
}

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Newspaper className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resources and information for journalists, bloggers, and content creators.
            </p>
          </div>
        </section>

        {/* About SAFRGO */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">About SAFRGO</h2>
            
            <Card className="border-0 bg-card mb-8">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  SAFRGO is a modern travel marketplace connecting travelers with verified travel agencies worldwide. 
                  Our platform makes it easy for people to discover curated travel experiences, communicate directly 
                  with trusted agencies, and book their dream trips with confidence.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe in transparency, trust, and making travel planning accessible to everyone. By bridging 
                  the gap between travelers and agencies, we're creating a more connected and authentic travel industry.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Founded</h3>
                  <p className="text-2xl font-bold text-foreground">2025</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Headquarters</h3>
                  <p className="text-2xl font-bold text-foreground">Algeria</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6 text-center">
                  <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Mission</h3>
                  <p className="text-sm text-muted-foreground">Connect travelers with trusted experiences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Brand Assets */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Brand Assets</h2>
              <p className="text-muted-foreground">
                Download our logos and brand materials for your publication
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="bg-secondary rounded-lg p-8 mb-4 flex items-center justify-center min-h-[200px]">
                    <Image 
                      src="/logo.png" 
                      alt="SAFRGO Logo" 
                      width={120} 
                      height={120}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Primary Logo (Color)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use on light backgrounds for maximum visibility
                  </p>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Download PNG
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="bg-secondary rounded-lg p-8 mb-4 flex items-center justify-center min-h-[200px]">
                    <Image 
                      src="/icon.svg" 
                      alt="SAFRGO Icon" 
                      width={120} 
                      height={120}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Icon/Symbol</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect for social media avatars and app icons
                  </p>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Download SVG
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 bg-card mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Usage Guidelines</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Maintain minimum clear space around the logo</li>
                  <li>• Don't alter, rotate, or distort the logo</li>
                  <li>• Use provided colors - don't change logo colors</li>
                  <li>• Ensure sufficient contrast with background</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Key Facts</h2>
            </div>

            <div className="space-y-4">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">What We Do</h3>
                  <p className="text-sm text-muted-foreground">
                    SAFRGO is a travel marketplace platform that connects travelers with verified travel agencies. 
                    We provide tools for agencies to showcase their offers and for travelers to discover, compare, 
                    and book travel experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Who We Serve</h3>
                  <p className="text-sm text-muted-foreground">
                    We serve two main groups: travelers looking for trusted travel experiences, and travel agencies 
                    seeking to reach more customers and grow their business online.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">What Makes Us Different</h3>
                  <p className="text-sm text-muted-foreground">
                    We focus on trust and transparency. Every agency is verified, all communication happens in-platform 
                    for safety, and pricing is always clear. We're building a marketplace that feels personal and trustworthy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Press Contact */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Press Inquiries</h2>
            <p className="text-lg text-muted-foreground mb-8">
              For press inquiries, interviews, or more information about SAFRGO
            </p>
            
            <Card className="border-0 bg-card">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Contact our press team:</p>
                <a 
                  href="mailto:press@safrgo.online" 
                  className="text-xl font-semibold text-primary hover:underline"
                >
                  press@safrgo.online
                </a>
                <p className="text-sm text-muted-foreground mt-4">
                  We typically respond within 24-48 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
