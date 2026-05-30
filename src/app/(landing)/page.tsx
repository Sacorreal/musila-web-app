import { CTASection } from "@/src/domains/landing/components/cta-section"
import { FaqSection } from "@/src/domains/landing/components/faq-section"
import { FeaturesSection } from "@/src/domains/landing/components/features-section"
import { Footer } from "@/src/domains/landing/components/footer"
import { HeroSection } from "@/src/domains/landing/components/hero-section"
import { HowItWorksSection } from "@/src/domains/landing/components/how-it-works-section"
import { LandingHeader } from "@/src/domains/landing/components/landing-header"
import { PricingSection } from "@/src/domains/landing/components/pricing-section"
import { TestimonialsSection } from "@/src/domains/landing/components/testimonials-section"
import { getExchangeRate } from "@/src/domains/payments/currency.actions"
import { WhatsAppButton } from "@/src/shared/components/WhatsAppButton"
import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "https://musila.co",
  },
}

export default async function LandingPage() {
  const currencyInfo = await getExchangeRate();

  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection currencyInfo={currencyInfo} />
      <FaqSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
