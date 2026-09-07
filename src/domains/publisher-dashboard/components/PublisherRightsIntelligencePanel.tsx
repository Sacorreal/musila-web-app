'use client'

import { Sparkles, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Progress } from '@/src/shared/components/UI/progress'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { formatCOP } from '@/src/domains/wallet/utils/format-currency'
import { RankedBarChart } from '@/src/domains/dashboard/components/RankedBarChart'
import { DashboardCardSkeleton } from '@/src/domains/dashboard/components/DashboardCardSkeleton'
import { usePublisherRightsIntelligence } from '../hooks/publisher-dashboard.hooks'
import type { ComposerIncome, RankedItem } from '../types/publisher-dashboard.types'

export function PublisherRightsIntelligencePanel({ organizationId }: { organizationId: string }) {
  const { data, isLoading, isError } = usePublisherRightsIntelligence(organizationId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardCardSkeleton className="h-64 lg:col-span-1" />
        <DashboardCardSkeleton className="h-64 lg:col-span-2" />
      </div>
    )
  }
  if (isError || !data) {
    return <ErrorState message="No se pudo cargar la inteligencia de derechos del catálogo." />
  }

  const underused = data.catalogUtilizationPct < 25

  return (
    <div className="space-y-4">
      {data.composerHighlight && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
          <p className="text-sm">
            <span className="font-semibold">{data.composerHighlight.name}</span> produce{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {data.composerHighlight.multiple}×
            </span>{' '}
            más ingresos que el promedio de tu roster.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-violet-500" />
              Utilización del catálogo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black tabular-nums text-violet-600 dark:text-violet-400">
                  {data.catalogUtilizationPct}%
                </span>
                <span className="text-xs text-muted-foreground">de las obras con solicitudes</span>
              </div>
              <Progress value={data.catalogUtilizationPct} aria-label="Porcentaje de catálogo utilizado" />
              {underused && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Tu catálogo está subutilizado. Solo {data.catalogUtilizationPct}% de las obras han
                  recibido solicitudes.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MiniMetric label="Tasa de aprobación" value={`${data.approvalRate}%`} />
              <MiniMetric label="Solicitudes recibidas" value={String(data.requestsReceived)} />
            </div>

            <TopRequestedList title="Canciones más pedidas" items={data.topRequestedTracks} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-emerald-500" />
              Compositores por ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComposerIncomeList items={data.topComposers} />
          </CardContent>
          <CardHeader>
            <CardTitle className="text-base">Géneros más solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <RankedBarChart data={data.topGenres} emptyMessage="Aún no hay solicitudes por género." />
          </CardContent>
          <CardHeader>
            <CardTitle className="text-base">Ritmos más solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <RankedBarChart data={data.topRhythms} emptyMessage="Aún no hay solicitudes por ritmo." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

function TopRequestedList({ title, items }: { title: string; items: RankedItem[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin solicitudes todavía.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 truncate">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-500">
                  {i + 1}
                </span>
                <span className="truncate">{item.label}</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-muted-foreground">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ComposerIncomeList({ items }: { items: ComposerIncome[] }) {
  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Aún no hay ingresos atribuibles a compositores del roster.
      </p>
    )
  }

  const max = Math.max(...items.map((item) => item.income), 1)

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item.userId} className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 truncate">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-500">
                {i + 1}
              </span>
              <span className="truncate font-medium">{item.name}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatCOP(item.income)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500/70"
              style={{ width: `${Math.max((item.income / max) * 100, 4)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
