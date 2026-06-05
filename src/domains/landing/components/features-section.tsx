"use client"

import { MusicNoteIcon, PlaylistIcon, RequestIcon, UploadIcon } from "@/src/shared/components/Icons/icons"
import { useTranslation } from "@/src/shared/libs/i18n"
import { Shield, Users } from "lucide-react"

const FEATURE_ICONS = [MusicNoteIcon, RequestIcon, UploadIcon, PlaylistIcon, Shield, Users]

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section id="features" className="py-20 md:py-32 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">{t.features.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index]
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
