'use client'

import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import type { RegistrationFileChecklistItem } from '../types/registration-file.types'

interface Props {
  items: RegistrationFileChecklistItem[]
  className?: string
}

export function ChecklistPanel({ items, className }: Props) {
  if (!items.length) {
    return <p className={cn('text-sm text-muted-foreground', className)}>Aún no hay nada que revisar.</p>
  }

  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex items-start gap-2 text-sm">
          {item.satisfied ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle
              className={cn('mt-0.5 h-4 w-4 shrink-0', item.severity === 'error' ? 'text-destructive' : 'text-amber-500')}
            />
          )}
          <span className={cn(!item.satisfied && item.severity === 'error' && 'text-destructive')}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
