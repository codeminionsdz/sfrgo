import { BadgeCheck, MessageCircle, Shield, Building2 } from "@/components/icons"

export function HowItWorks() {
  const steps = [
    {
      icon: BadgeCheck,
      title: "Verified Agencies",
      description: "Agencies subscribe and are reviewed by admin before they can list offers",
    },
    {
      icon: Building2,
      title: "Real Travel Offers",
      description: "Agencies publish real offers only after approval—no fake listings",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Travelers contact agencies directly via chat—no middlemen",
    },
    {
      icon: Shield,
      title: "Travel with Confidence",
      description: "Transparent connections between verified agencies and travelers",
    },
  ]

  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            How SAFRGO Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple, transparent way to travel with confidence
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{index + 1}</span>
                </div>

                {/* Card */}
                <div className="h-full p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
