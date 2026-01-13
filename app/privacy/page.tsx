import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { Shield } from "@/components/icons"

export const metadata: Metadata = {
  title: "Privacy Policy - SAFRGO",
  description: "Learn how SAFRGO collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 13, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="bg-card rounded-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to SAFRGO. We are committed to protecting your personal information and your right to privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account, we collect information such as:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Profile picture (optional)</li>
                  <li>Phone number (for agencies)</li>
                  <li>Business details (for agencies)</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Usage Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We automatically collect certain information when you use SAFRGO:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Pages viewed and features used</li>
                  <li>Search queries and interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, operate, and maintain our platform</li>
                  <li>Process transactions and send related information</li>
                  <li>Send administrative and marketing communications</li>
                  <li>Respond to your comments and questions</li>
                  <li>Improve and personalize user experience</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                  <li><strong>Business Partners:</strong> Travel agencies you interact with through our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information. 
                  However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our platform and hold certain 
                  information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                  See our{" "}
                  <Link href="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>{" "}
                  for more details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform is not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13. If you are a parent or guardian and believe your child has provided 
                  us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and maintained on servers located outside of your country. 
                  We will take all steps reasonably necessary to ensure that your data is treated securely and in 
                  accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions about this Privacy Policy, please contact us:
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

          {/* Related Links */}
          <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-sm text-primary hover:underline">
                Terms of Service →
              </Link>
              <Link href="/cookies" className="text-sm text-primary hover:underline">
                Cookie Policy →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
