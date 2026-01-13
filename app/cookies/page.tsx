import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Cookie Policy - SAFRGO",
  description: "Learn about how SAFRGO uses cookies and similar technologies.",
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Cookie className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: January 13, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="bg-card rounded-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. They are widely 
                  used to make websites work more efficiently and provide information to website owners. Cookies help us 
                  understand how you use SAFRGO and improve your experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SAFRGO uses cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>To keep you logged in between sessions</li>
                  <li>To remember your preferences and settings</li>
                  <li>To understand how you use our platform</li>
                  <li>To improve platform performance and features</li>
                  <li>To provide personalized content and recommendations</li>
                  <li>To analyze traffic and measure effectiveness</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <Card className="border-0 bg-secondary/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Essential Cookies</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        These cookies are necessary for the platform to function and cannot be disabled.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Session cookies, authentication tokens, security cookies
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-secondary/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Functional Cookies</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Language preferences, theme settings, saved searches
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-secondary/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Cookies</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        These cookies help us understand how visitors interact with our platform.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Page views, user flows, feature usage, error tracking
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-secondary/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Marketing Cookies</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        These cookies track your online activity to help show relevant ads.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Examples: Ad targeting, conversion tracking, retargeting campaigns
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use services from trusted third-party providers that may set their own cookies:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Analytics:</strong> Google Analytics, Vercel Analytics</li>
                  <li><strong>Authentication:</strong> Supabase</li>
                  <li><strong>Performance:</strong> Vercel Edge Network</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These third parties have their own privacy policies and cookie practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookie Duration</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Session Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporary cookies that expire when you close your browser.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Persistent Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      Remain on your device for a set period (typically 30 days to 2 years) or until you delete them.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Managing Cookies</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">Browser Settings</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>View cookies stored on your device</li>
                  <li>Delete cookies individually or all at once</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block third-party cookies</li>
                  <li>Block all cookies (may affect functionality)</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Browser-Specific Instructions</h3>
                <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
                  <p><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</p>
                  <p><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
                  <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                  <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you disable or refuse cookies:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You may not be able to access certain features</li>
                  <li>You may need to log in each time you visit</li>
                  <li>Your preferences will not be saved</li>
                  <li>The platform may not function properly</li>
                  <li>You may see less relevant content and ads</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Do Not Track</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some browsers have a "Do Not Track" (DNT) feature that lets you tell websites you don't want to be 
                  tracked. Currently, we do not respond to DNT signals, but we are committed to respecting your privacy 
                  preferences and may support this in the future.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or 
                  our operations. We will notify you of any material changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions about our use of cookies, please contact us:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>Email:{" "}
                    <a href="mailto:privacy@safrgo.online" className="text-primary hover:underline">
                      privacy@safrgo.online
                    </a>
                  </li>
                  <li>
                    Contact Form:{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      Contact Page
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Cookie Consent CTA */}
          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You can manage your cookie preferences at any time through your browser settings or by contacting us.
            </p>
            <Button>
              Manage Cookie Preferences
            </Button>
          </div>

          {/* Related Links */}
          <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-sm text-primary hover:underline">
                Privacy Policy →
              </Link>
              <Link href="/terms" className="text-sm text-primary hover:underline">
                Terms of Service →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
