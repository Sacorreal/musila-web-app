'use client'

import { Progress } from '@/src/shared/components/UI/progress'
import { cn } from '@/src/shared/libs/cn'

interface Props {
  percentage: number
  label?: string
  className?: string
}

export function CompletenessProgress({ percentage, label = 'Completitud del expediente', className }: Props) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{percentage}%</span>
      </div>
      <Progress value={percentage} />
    </div>
  )
}
