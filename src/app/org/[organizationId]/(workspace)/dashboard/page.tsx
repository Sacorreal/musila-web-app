'use client'

import { use } from 'react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { DashboardCardSkeletonGrid } from '@/src/domains/dashboard/components/DashboardCardSkeleton'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import { PublisherMetricsGrid } from '@/src/domains/publisher-dashboard/components/PublisherMetricsGrid'
import { PublisherRightsIntelligencePanel } from '@/src/domains/publisher-dashboard/components/PublisherRightsIntelligencePanel'
import { PublisherRightsCompliancePanel } from '@/src/domains/publisher-dashboard/components/PublisherRightsCompliancePanel'
import { PublisherFinancialCards } from '@/src/domains/publisher-dashboard/components/PublisherFinancialCards'
import { BuyerMetricsGrid } from '@/src/domains/buyer-dashboard/components/BuyerMetricsGrid'
import { BuyerLicenseTrendChart } from '@/src/domains/buyer-dashboard/components/BuyerLicenseTrendChart'
import { BuyerLicensedTracksTable } from '@/src/domains/buyer-dashboard/components/BuyerLicensedTracksTable'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function PublisherDashboard({ organizationId }: { organizationId: string }) {
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

function BuyerDashboard({ organizationId }: { organizationId: string }) {
  return (
    <div className="space-y-10">
      <PageHeader title="Dashboard" description="Comprende cuánto escucha y licencia tu roster" />

      <section className="space-y-4">
        <SectionHeading title="Métricas clave" />
        <BuyerMetricsGrid organizationId={organizationId} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Tendencia de licencias"
          subtitle="Licencias adquiridas por tu roster en los últimos meses"
        />
        <BuyerLicenseTrendChart organizationId={organizationId} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Canciones licenciadas"
          subtitle="Detalle de las licencias adquiridas por tu roster este mes"
        />
        <BuyerLicensedTracksTable organizationId={organizationId} />
      </section>
    </div>
  )
}

export default function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)
  const { data: memberships, isLoading } = organizationsHooks.useMyMemberships()

  if (isLoading) {
    return (
      <div className="space-y-10">
        <PageHeader title="Dashboard" />
        <DashboardCardSkeletonGrid count={4} />
      </div>
    )
  }

  const membership = [
    ...(memberships?.organizationMemberships ?? []),
    ...(memberships?.rosterMemberships ?? []),
  ].find((m) => m.organizationId === organizationId)

  if (!membership) {
    return <ErrorState message="No se encontró tu membresía en esta organización." />
  }

  if (membership.organization.type === 'PUBLISHER') {
    return <PublisherDashboard organizationId={organizationId} />
  }

  return <BuyerDashboard organizationId={organizationId} />
}
