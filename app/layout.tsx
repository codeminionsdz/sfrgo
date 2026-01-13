import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "SAFRGO – Your Trusted Travel Companion",
  description:
    "Connect with verified travel agencies and discover trusted travel experiences worldwide.",
  keywords: ["travel", "travel agency", "vacation", "trip planning", "travel booking"],
  metadataBase: new URL('https://safrgo.online'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://safrgo.online',
    title: 'SAFRGO – Your Trusted Travel Companion',
    description: 'Connect with verified travel agencies and discover trusted travel experiences worldwide.',
    siteName: 'SAFRGO',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'SAFRGO Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAFRGO – Your Trusted Travel Companion',
    description: 'Connect with verified travel agencies and discover trusted travel experiences worldwide.',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-icon.png',
  }
}

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
