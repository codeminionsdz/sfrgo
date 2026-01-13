import type React from "react"
import Link from "next/link"
import { SafrgoLogoText } from "@/components/icons"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-block mb-8">
            <SafrgoLogoText />
          </Link>
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative">
        <img
          src="/bali-temple-sunset.jpg"
          alt="Travel destination"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <blockquote className="text-white">
            <p className="text-2xl font-medium mb-4 text-balance">
              "SAFRGO connected me with the most amazing agency. Our Bali trip was absolutely perfect."
            </p>
            <footer className="flex items-center gap-3">
              <img src="/placeholder.svg?height=48&width=48" alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <cite className="not-italic font-semibold">Sarah Mitchell</cite>
                <p className="text-white/70 text-sm">Traveled to 12 destinations</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
