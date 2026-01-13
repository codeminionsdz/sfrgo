import { Shield, BadgeCheck, MessageCircle, Globe } from "@/components/icons"

const features = [
  {
    icon: Shield,
    title: "Verified Agencies",
    description: "Every agency is manually verified to ensure quality, reliability, and trustworthiness.",
  },
  {
    icon: BadgeCheck,
    title: "Trust Badges",
    description: "Agencies earn badges based on performance, reviews, and engagement with travelers.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Chat directly with agencies to customize your perfect trip without intermediaries.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access 2,500+ agencies across 85 countries, each specializing in local expertise.",
  },
]

export function LandingFeatures() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">Travel with confidence</h2>
          <p className="text-lg text-muted-foreground">
            SAFRGO connects you with trusted travel professionals through a platform built on transparency and
            relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-2xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
