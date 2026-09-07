'use client'

import { use } from 'react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { PublisherMetricsGrid } from '@/src/domains/publisher-dashboard/components/PublisherMetricsGrid'
import { PublisherRightsIntelligencePanel } from '@/src/domains/publisher-dashboard/components/PublisherRightsIntelligencePanel'
import { PublisherRightsCompliancePanel } from '@/src/domains/publisher-dashboard/components/PublisherRightsCompliancePanel'
import { PublisherFinancialCards } from '@/src/domains/publisher-dashboard/components/PublisherFinancialCards'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default function PublisherDashboardPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        description="Comprende el rendimiento de las canciones de tu roster y el potencial comercial de tu catálogo"
      />

      <section className="space-y-4">
        <SectionHeading title="Métricas clave" />
        <PublisherMetricsGrid organizationId={organizationId} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Inteligencia de derechos"
          subtitle="Cómo se traduce tu catálogo en interés y oportunidades comerciales"
        />
        <PublisherRightsIntelligencePanel organizationId={organizationId} />
      </section>

      <section className="space-y-4">
        <SectionHeading title="Finanzas" subtitle="Wallet de la organización y próximos cobros del catálogo" />
        <PublisherFinancialCards organizationId={organizationId} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Cumplimiento de derechos"
          subtitle="Estado de registro, splits y visibilidad del catálogo administrado"
        />
        <PublisherRightsCompliancePanel organizationId={organizationId} />
      </section>
    </div>
  )
}
