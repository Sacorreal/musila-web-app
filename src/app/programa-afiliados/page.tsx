import type { Metadata } from 'next'
import { LandingHeader } from '@/src/domains/landing/components/landing-header'
import { Footer } from '@/src/domains/landing/components/footer'
import { ProgramHero } from '@/src/domains/affiliates/components/landing/ProgramHero'
import { HowItWorksSteps } from '@/src/domains/affiliates/components/landing/HowItWorksSteps'
import { CommissionTiersTable } from '@/src/domains/affiliates/components/landing/CommissionTiersTable'
import { ProgramBenefits } from '@/src/domains/affiliates/components/landing/ProgramBenefits'
import { AffiliateFAQSection } from '@/src/domains/affiliates/components/landing/AffiliateFAQSection'
import { AffiliateCTASection } from '@/src/domains/affiliates/components/landing/AffiliateCTASection'

export const metadata: Metadata = {
  title: 'Programa de Afiliados | Musila',
  description:
    'Recomienda Musila y genera ingresos ayudando a autores, compositores e intérpretes a encontrar nuevas oportunidades para su música. Hasta 30% de comisión.',
}

export default function AffiliateProgramPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <ProgramHero />
        <HowItWorksSteps />
        <CommissionTiersTable />
        <ProgramBenefits />
        <AffiliateFAQSection />
        <AffiliateCTASection />
      </main>
      <Footer />
    </div>
  )
}
