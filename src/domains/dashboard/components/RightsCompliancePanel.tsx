'use client'

import {
  CalendarClock,
  CheckCircle2,
  Eye,
  EyeOff,
  FileWarning,
  Percent,
  ScrollText,
  ShieldCheck,
  Tag,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { useRightsCompliance } from '../hooks/dashboard.hooks'
import { DashboardCardSkeleton } from './DashboardCardSkeleton'

export function RightsCompliancePanel() {
  const { data, isLoading, isError } = useRightsCompliance()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <DashboardCardSkeleton key={i} className="h-20" />
        ))}
      </div>
    )
  }
  if (isError || !data) {
    return <ErrorState message="No se pudo cargar el cumplimiento de derechos." />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <CountTile label="Obras activas" value={data.activeWorks} icon={CheckCircle2} tone="emerald" />
        <CountTile label="Obras licenciadas" value={data.licensedWorks} icon={ShieldCheck} tone="violet" />
        <CountTile label="Sin split" value={data.worksWithoutSplit} icon={ScrollText} tone="amber" />
        <CountTile label="Sin registro SAYCO" value={data.worksWithoutRegistration} icon={FileWarning} tone="amber" />
        <CountTile label="Privadas" value={data.privateWorks} icon={EyeOff} tone="rose" />
        <CountTile label="Visibles" value={data.visibleWorks} icon={Eye} tone="cyan" />
        <CountTile label="Inactivas" value={data.inactiveWorks} icon={XCircle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Tiempo promedio de negociación"
          value={`${data.avgNegotiationDays} días`}
          icon={CalendarClock}
        />
        <MetricCard label="Tasa de cierre" value={`${data.closeRate}%`} icon={Percent} />
        <MetricCard label="Valor promedio de licencia" value={formatCOP(data.avgLicenseValue)} icon={Tag} />
      </div>
    </div>
  )
}

const toneMap: Record<string, string> = {
  emerald: 'text-emerald-500',
  violet: 'text-violet-500',
  amber: 'text-amber-500',
  rose: 'text-rose-500',
  cyan: 'text-cyan-500',
}

function CountTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: LucideIcon
  tone: keyof typeof toneMap
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xl font-black tabular-nums">{value}</p>
        <Icon className={`h-5 w-5 ${toneMap[tone]}`} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Icon className="h-4 w-4" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}
