"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "@/components/icons"

export function LandingHero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/hero.png')",
      }}
    >
      {/* Soft White Overlay for Text Readability */}
      <div className="absolute inset-0 z-0 bg-white/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Trusted by 150,000+ travelers worldwide
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
            Discover the world with <span className="text-primary">trusted</span> travel partners
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Connect with verified travel agencies, explore curated experiences, and build lasting relationships that
            turn your travel dreams into reality.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl shadow-xl p-2 max-w-3xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-0 bg-secondary/50 text-base"
                />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 h-14 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Any time</span>
                </div>
                <div className="flex items-center gap-2 px-4 h-14 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Any group</span>
                </div>
              </div>
              <Link href={`/explore${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}>
                <Button size="lg" className="h-14 px-8 gap-2 w-full md:w-auto">
                  <Search className="w-5 h-5" />
                  <span className="md:hidden lg:inline">Search</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {["Bali", "Maldives", "Santorini", "Tokyo", "Paris"].map((dest) => (
              <Link
                key={dest}
                href={`/explore?destination=${dest}`}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                {dest}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-foreground/40 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
