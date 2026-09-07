'use client'

import { Badge } from '@/src/shared/components/UI/badge'
import { RegistrationFileStatus } from '../types/registration-file.types'

const STATUS_CONFIG: Record<RegistrationFileStatus, { label: string; className: string }> = {
  [RegistrationFileStatus.EN_CONSTRUCCION]: {
    label: 'En construcción',
    className: 'bg-muted text-muted-foreground border-none',
  },
  [RegistrationFileStatus.INCOMPLETO]: {
    label: 'Incompleto',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none',
  },
  [RegistrationFileStatus.VALIDADO_PARCIALMENTE]: {
    label: 'Validado parcialmente',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none',
  },
  [RegistrationFileStatus.LISTO_PARA_PRESENTAR]: {
    label: 'Listo para presentar',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none',
  },
}

interface Props {
  status: RegistrationFileStatus
  caseNumber?: string
  className?: string
}

export function RegistrationFileBadge({ status, caseNumber, className }: Props) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      variant="secondary"
      className={`font-bold uppercase text-[9px] sm:text-[10px] whitespace-nowrap gap-1.5 ${config.className} ${className ?? ''}`}
    >
      {caseNumber && <span className="font-mono normal-case">{caseNumber}</span>}
      {config.label}
    </Badge>
  )
}
