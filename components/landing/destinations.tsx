"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { popularDestinations } from "@/lib/mock-data"
import { ArrowRight } from "@/components/icons"

export function PopularDestinations() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">Popular destinations</h2>
            <p className="text-lg text-muted-foreground">Explore trending locations loved by travelers</p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="gap-2 bg-transparent">
              See all destinations
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((destination, index) => (
            <Link
              key={destination.name}
              href={`/explore?destination=${encodeURIComponent(destination.name)}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white mb-0.5">{destination.name}</h3>
                <p className="text-sm text-white/80">{destination.offerCount} offers</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
