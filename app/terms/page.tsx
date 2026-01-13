import type { Metadata } from "next"
import Link from "next/link"
import { LandingHeader } from "@/components/landing/header"
import { LandingFooter } from "@/components/landing/footer"
import { FileText } from "@/components/icons"

export const metadata: Metadata = {
  title: "Terms of Service - SAFRGO",
  description: "Terms and conditions for using the SAFRGO platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 13, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="bg-card rounded-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using SAFRGO, you agree to be bound by these Terms of Service and all applicable 
                  laws and regulations. If you do not agree with any of these terms, you are prohibited from using 
                  or accessing this platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SAFRGO is a marketplace platform that connects travelers with verified travel agencies. We facilitate 
                  communication and discovery but are not party to the actual travel bookings or services provided by 
                  travel agencies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">Registration</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mb-2">Account Types</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Traveler Accounts:</strong> For individuals seeking travel services</li>
                  <li><strong>Agency Accounts:</strong> For travel agencies offering services (subject to verification)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree NOT to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the platform's functionality</li>
                  <li>Scrape or collect user data without permission</li>
                  <li>Upload viruses or malicious code</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Travel Agency Obligations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Travel agencies using SAFRGO agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate information about their services and pricing</li>
                  <li>Respond to traveler inquiries in a timely manner</li>
                  <li>Honor the terms and conditions of their listed offers</li>
                  <li>Maintain all necessary licenses and insurance</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not engage in misleading or deceptive practices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Content and Intellectual Property</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You retain ownership of content you post on SAFRGO. By posting content, you grant us a worldwide, 
                  non-exclusive, royalty-free license to use, display, and distribute your content on the platform.
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">Our Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  SAFRGO and its original content, features, and functionality are owned by SAFRGO and are protected 
                  by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Bookings and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Important points about bookings:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>SAFRGO facilitates connections but does not process or guarantee bookings</li>
                  <li>Payment terms are determined between travelers and agencies</li>
                  <li>We are not responsible for disputes between travelers and agencies</li>
                  <li>Cancellation policies are set by individual agencies</li>
                  <li>Travelers should verify all details before confirming bookings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Fees and Subscriptions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For travel agencies:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Subscription fees are charged monthly or annually as selected</li>
                  <li>Fees are non-refundable except as required by law</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>We may change fees with 30 days notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SAFRGO is provided "as is" and "as available" without warranties of any kind. We do not guarantee:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>Accuracy or reliability of content</li>
                  <li>Quality of services provided by travel agencies</li>
                  <li>That defects will be corrected</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, SAFRGO shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages resulting from your use of or inability to use the platform. 
                  This includes damages for lost profits, data loss, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless SAFRGO from any claims, damages, losses, liabilities, and 
                  expenses arising from your use of the platform, your violation of these Terms, or your violation of 
                  any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the platform:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>For violation of these Terms</li>
                  <li>For fraudulent or illegal activity</li>
                  <li>At our sole discretion for any reason</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Upon termination, your right to use the platform will cease immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Algeria, without 
                  regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                  by posting the new Terms on this page and updating the "Last updated" date. Your continued use of 
                  the platform after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For questions about these Terms, please contact us:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>Email:{" "}
                    <a href="mailto:legal@safrgo.online" className="text-primary hover:underline">
                      legal@safrgo.online
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
              <Link href="/privacy" className="text-sm text-primary hover:underline">
                Privacy Policy →
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
