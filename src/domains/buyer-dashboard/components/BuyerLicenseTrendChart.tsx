'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { useBuyerOverview } from '../hooks/buyer-dashboard.hooks'
import type { BuyerMonthlyLicenseTrendPoint } from '../types/buyer-dashboard.types'

const monthLabelFormatter = new Intl.DateTimeFormat('es-CO', { month: 'short', year: '2-digit' })
const monthFullFormatter = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' })

function parseMonth(month: string): Date {
  const [year, monthIndex] = month.split('-').map(Number)
  return new Date(year, (monthIndex ?? 1) - 1, 1)
}

function formatMonthTick(month: string): string {
  return monthLabelFormatter.format(parseMonth(month))
}

function formatMonthLabel(month: string): string {
  const label = monthFullFormatter.format(parseMonth(month))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatLicensesTooltip(value: number): [string, string] {
  return [`${value} licencia${value === 1 ? '' : 's'}`, '']
}

function hasData(trend: BuyerMonthlyLicenseTrendPoint[]): boolean {
  return trend.length > 0 && trend.some((point) => point.count > 0)
}

export function BuyerLicenseTrendChart({ organizationId }: { organizationId: string }) {
  const { data, isLoading, isError } = useBuyerOverview(organizationId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          Licencias por mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[220px] animate-pulse rounded-xl bg-muted" aria-hidden="true" />
        ) : isError || !data ? (
          <ErrorState message="No se pudo cargar la tendencia de licencias de tu roster." />
        ) : !hasData(data.monthlyLicenseTrend) ? (
          <p className="flex h-[220px] items-center justify-center text-center text-sm text-muted-foreground">
            Aún no hay licencias registradas en los últimos meses.
          </p>
        ) : (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyLicenseTrend} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="buyerLicenseTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="currentColor" className="text-muted-foreground/15" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthTick}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip
                  cursor={{ stroke: 'currentColor', strokeOpacity: 0.15 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--popover)',
                    color: 'var(--popover-foreground)',
                    fontSize: 12,
                  }}
                  formatter={formatLicensesTooltip}
                  labelFormatter={formatMonthLabel}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#buyerLicenseTrendFill)"
                  activeDot={{ r: 4 }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
