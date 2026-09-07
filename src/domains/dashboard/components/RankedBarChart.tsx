'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RankedItem } from '../types/dashboard.types'

const BAR_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#10b981', '#f59e0b']

interface Props {
  data: RankedItem[]
  emptyMessage?: string
}

/** Gráfico de barras horizontal para rankings (canciones/géneros/ritmos). */
export function RankedBarChart({ data, emptyMessage = 'Sin datos todavía.' }: Props) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 8 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tick={{ fontSize: 12, fill: 'currentColor' }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'currentColor', opacity: 0.06 }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--popover)',
              color: 'var(--popover-foreground)',
              fontSize: 12,
            }}
            formatter={(value: number) => [value, 'Solicitudes']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((_, index) => (
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
