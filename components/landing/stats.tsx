import { Building2, Package, Star, TrendingUp } from "@/components/icons"

interface PlatformStatsProps {
  stats: {
    verifiedAgencies: number
    activeOffers: number
    totalReviews: number
  }
}

export function PlatformStats({ stats }: PlatformStatsProps) {
  const displayStats = [
    {
      icon: Building2,
      value: stats.verifiedAgencies,
      suffix: "+",
      label: "Verified Agencies",
    },
    {
      icon: Package,
      value: stats.activeOffers,
      suffix: "+",
      label: "Travel Offers",
    },
    {
      icon: Star,
      value: stats.totalReviews,
      suffix: "+",
      label: "Reviews",
    },
    {
      icon: TrendingUp,
      value: "100",
      suffix: "%",
      label: "Verified Partners",
    },
  ]

  return (
    <section className="py-16 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
