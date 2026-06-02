"use client"

import { useTranslation } from "@/src/shared/libs/i18n"

const STEP_IMAGES = [
  "/person-signing-up-on-laptop-music-app.jpg",
  "/musician-uploading-music-to-computer.jpg",
  "/two-musicians-collaborating-shaking-hands.jpg",
]

export function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {t.howItWorks.title}
          </h2>
          <p className="text-lg text-muted-foreground">{t.howItWorks.subtitle}</p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {t.howItWorks.steps.map((step, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <span className="text-5xl font-bold text-primary/30">0{index + 1}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">{step.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border">
                  <img
                    src={STEP_IMAGES[index] || "/placeholder.svg"}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
