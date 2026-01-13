import type { Metadata } from "next"
import { AboutPage } from "@/components/landing/about-page"

export const metadata: Metadata = {
  title: "About SAFRGO | Connecting Travelers with Trusted Agencies",
  description: "Learn about SAFRGO's mission to make travel booking in Algeria transparent, safe, and accessible. Discover how we verify agencies and protect travelers.",
  keywords: ["about SAFRGO", "travel platform", "Algeria tourism", "verified agencies", "travel safety"],
  openGraph: {
    title: "About SAFRGO | Connecting Travelers with Trusted Agencies",
    description: "Making travel booking in Algeria transparent, safe, and accessible",
    type: "website",
  },
}

export default function About() {
  return <AboutPage />
}
