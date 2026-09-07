'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { type LucideIcon } from 'lucide-react'

export type StatCardColor =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'indigo'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: StatCardColor
  description?: string
  /** Formatea el valor animado (p. ej. moneda). Por defecto usa `toLocaleString`. */
  format?: (value: number) => string
}

const colorMap: Record<StatCardColor, { bg: string; border: string; icon: string; value: string }> = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500/10 text-blue-500',
    value: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    icon: 'bg-emerald-500/10 text-emerald-500',
    value: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    bg: 'from-violet-500/10 to-violet-600/5',
    border: 'border-violet-500/20',
    icon: 'bg-violet-500/10 text-violet-500',
    value: 'text-violet-600 dark:text-violet-400',
  },
  amber: {
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
    icon: 'bg-amber-500/10 text-amber-500',
    value: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'from-rose-500/10 to-rose-600/5',
    border: 'border-rose-500/20',
    icon: 'bg-rose-500/10 text-rose-500',
    value: 'text-rose-600 dark:text-rose-400',
  },
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-600/5',
    border: 'border-cyan-500/20',
    icon: 'bg-cyan-500/10 text-cyan-500',
    value: 'text-cyan-600 dark:text-cyan-400',
  },
  indigo: {
    bg: 'from-indigo-500/10 to-indigo-600/5',
    border: 'border-indigo-500/20',
    icon: 'bg-indigo-500/10 text-indigo-500',
    value: 'text-indigo-600 dark:text-indigo-400',
  },
}

function AnimatedNumber({ target, format }: { target: number; format?: (value: number) => string }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) =>
    format ? format(Math.round(v)) : Math.round(v).toLocaleString(),
  )

  useEffect(() => {
    spring.set(target)
  }, [target, spring])

  return <motion.span>{display}</motion.span>
}

export function StatCard({ label, value, icon: Icon, color, description, format }: StatCardProps) {
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-6 shadow-sm backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={`text-4xl font-black tabular-nums ${c.value}`}>
            <AnimatedNumber target={value} format={format} />
          </p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
