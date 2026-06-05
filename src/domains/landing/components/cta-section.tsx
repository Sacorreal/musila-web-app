"use client"

import { Button } from "@/src/shared/components/UI/button"
import { useTranslation } from "@/src/shared/libs/i18n"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary" />
          <div className="absolute inset-0 bg-[url('/abstract-music-waves-pattern.jpg')] opacity-10 bg-cover bg-center" />

          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              {t.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-base bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/register">
                  {t.cta.createAccount}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/login">{t.cta.haveAccount}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
