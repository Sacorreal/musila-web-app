'use client'

import { Loader2 } from 'lucide-react'
import { useAffiliateDashboard } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { AffiliateStatsGrid } from '@/src/domains/affiliates/components/dashboard/AffiliateStatsGrid'
import { ReferralLinkCard } from '@/src/domains/affiliates/components/dashboard/ReferralLinkCard'
import { ReferralsTable } from '@/src/domains/affiliates/components/dashboard/ReferralsTable'
import { CommissionsTable } from '@/src/domains/affiliates/components/dashboard/CommissionsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'

export default function AffiliateDashboardPage() {
  const { data, isLoading, isError } = useAffiliateDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="text-center py-24 text-sm text-muted-foreground">
        No se pudo cargar tu panel. Intenta recargar la página.
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {data.affiliate.status !== 'approved' && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Tu cuenta está en estado <strong>{data.affiliate.status}</strong>. Contacta al equipo de
          Musila para más información.
        </div>
      )}

      <ReferralLinkCard referralLink={data.affiliate.referralLink} referralCode={data.affiliate.referralCode} />

      <AffiliateStatsGrid kpis={data.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referidos recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReferralsTable referrals={data.recentReferrals} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comisiones recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <CommissionsTable commissions={data.recentCommissions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
