'use client'

import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { AuthorMetricsGrid } from '@/src/domains/dashboard/components/AuthorMetricsGrid'
import { RightsIntelligencePanel } from '@/src/domains/dashboard/components/RightsIntelligencePanel'
import { RightsCompliancePanel } from '@/src/domains/dashboard/components/RightsCompliancePanel'
import { FinancialSummaryCards } from '@/src/domains/dashboard/components/FinancialSummaryCards'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default function AuthorDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <PageHeader
        title="Dashboard"
        description="Comprende el rendimiento de tus canciones y el potencial comercial de tu catálogo"
      />

      <section className="space-y-4">
        <SectionHeading title="Métricas clave" />
        <AuthorMetricsGrid />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Inteligencia de derechos"
          subtitle="Cómo se traduce tu catálogo en interés y oportunidades comerciales"
        />
        <RightsIntelligencePanel />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Finanzas" subtitle="Tu wallet y próximos cobros de licencias" />
        <FinancialSummaryCards />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Cumplimiento de derechos"
          subtitle="Estado de registro, splits y visibilidad de tu catálogo"
        />
        <RightsCompliancePanel />
      </section>
    </div>
  )
}
