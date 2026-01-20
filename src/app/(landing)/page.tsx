import { CTASection } from "@/src/domains/landing/components/cta-section"
import { FeaturesSection } from "@/src/domains/landing/components/features-section"
import { Footer } from "@/src/domains/landing/components/footer"
import { HeroSection } from "@/src/domains/landing/components/hero-section"
import { HowItWorksSection } from "@/src/domains/landing/components/how-it-works-section"
import { LandingHeader } from "@/src/domains/landing/components/landing-header"
import { TestimonialsSection } from "@/src/domains/landing/components/testimonials-section"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
