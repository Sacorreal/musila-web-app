'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose'
  description?: string
}

const colorMap = {
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
}

function AnimatedNumber({ target }: { target: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())

  useEffect(() => {
    spring.set(target)
  }, [target, spring])

  return <motion.span>{display}</motion.span>
}

export function StatCard({ label, value, icon: Icon, color, description }: StatCardProps) {
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-6 shadow-sm backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={`text-4xl font-black tabular-nums ${c.value}`}>
            <AnimatedNumber target={value} />
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
