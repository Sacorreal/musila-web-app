'use client'

import { useAffiliateDashboard } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { AffiliateStatsGrid } from '@/src/domains/affiliates/components/dashboard/AffiliateStatsGrid'
import { ReferralLinkCard } from '@/src/domains/affiliates/components/dashboard/ReferralLinkCard'
import { DashboardStatusBanner } from '@/src/domains/affiliates/components/dashboard/DashboardStatusBanner'
import { DashboardTablesGrid } from '@/src/domains/affiliates/components/dashboard/DashboardTablesGrid'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'

export default function AffiliateDashboardPage() {
  const { data, isLoading, isError } = useAffiliateDashboard()

  if (isLoading) {
    return <LoadingState className="py-24" iconClassName="w-6 h-6 text-muted-foreground" />
  }

  if (isError || !data) {
    return <ErrorState message="No se pudo cargar tu panel. Intenta recargar la página." />
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      <DashboardStatusBanner status={data.affiliate.status} />

      <ReferralLinkCard referralLink={data.affiliate.referralLink} referralCode={data.affiliate.referralCode} />

      <AffiliateStatsGrid kpis={data.kpis} />

      <DashboardTablesGrid
        recentReferrals={data.recentReferrals}
        recentCommissions={data.recentCommissions}
      />
    </div>
  )
}
