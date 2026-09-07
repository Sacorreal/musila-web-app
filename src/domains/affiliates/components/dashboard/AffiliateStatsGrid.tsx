'use client'

import { Users, TrendingUp, Clock, CheckCircle2, Wallet } from 'lucide-react'
import { StatCard } from '@/src/domains/admin/components/StatCard'
import type { AffiliateKpis } from '../../types/affiliate-dashboard.types'

interface AffiliateStatsGridProps {
  kpis: AffiliateKpis
}

export function AffiliateStatsGrid({ kpis }: AffiliateStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Referidos totales" value={kpis.totalReferrals} icon={Users} color="blue" description={`${kpis.referralsThisMonth} este mes`} />
      <StatCard label="Referidos convertidos" value={kpis.convertedReferrals} icon={TrendingUp} color="violet" description={`${Math.round(kpis.conversionRate * 100)}% de conversión`} />
      <StatCard label="Comisión pendiente" value={Math.round(kpis.commissionPending)} icon={Clock} color="amber" description="COP" />
      <StatCard label="Comisión aprobada" value={Math.round(kpis.commissionApproved)} icon={CheckCircle2} color="emerald" description="COP" />
      <StatCard label="Comisión pagada" value={Math.round(kpis.commissionPaid)} icon={Wallet} color="rose" description="COP" />
      <StatCard label="Ventas generadas" value={Math.round(kpis.totalSalesAmount)} icon={TrendingUp} color="blue" description="COP en ventas referidas" />
    </div>
  )
}
