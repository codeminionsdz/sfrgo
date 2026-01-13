import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Mail, MessageCircle, MapPin, Phone, Send } from "@/components/icons"

export const metadata: Metadata = {
  title: "Contact Us - SAFRGO",
  description: "Get in touch with the SAFRGO team. We're here to help.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Options & Form */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Choose the best way to reach us. We typically respond within 24 hours.
                  </p>
                </div>

                <Card className="border-0 bg-card">
                  <CardContent className="p-6">
                    <Mail className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <a 
                      href="mailto:support@safrgo.online" 
                      className="text-sm text-primary hover:underline"
                    >
                      support@safrgo.online
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      General inquiries & support
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card">
                  <CardContent className="p-6">
                    <Mail className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Business</h3>
                    <a 
                      href="mailto:business@safrgo.online" 
                      className="text-sm text-primary hover:underline"
                    >
                      business@safrgo.online
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      Partnerships & collaborations
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card">
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Algeria
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Remote-first company
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 bg-card">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                    
                    <form className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        We'll get back to you as soon as possible. Usually within 24 hours.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Common Questions</h2>
              <p className="text-muted-foreground">
                Before reaching out, check if your question is answered below
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">How do I create an account?</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Sign Up" in the header and choose whether you're a traveler or agency. 
                    Fill in your details and you're ready to go!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Is SAFRGO free for travelers?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! Browsing offers, chatting with agencies, and saving favorites is completely free. 
                    You only pay when you book a trip through an agency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">How do I become a verified agency?</h3>
                  <p className="text-sm text-muted-foreground">
                    Register as an agency, complete your profile, and submit verification documents. 
                    Our team will review and verify your agency within 2-3 business days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Can I modify or cancel a booking?</h3>
                  <p className="text-sm text-muted-foreground">
                    Booking modifications and cancellations depend on the agency's policy. 
                    Contact the agency directly through our chat system to discuss changes.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Still have questions?
              </p>
              <Link href="/about">
                <Button variant="outline" className="bg-transparent">
                  Visit Help Center
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
