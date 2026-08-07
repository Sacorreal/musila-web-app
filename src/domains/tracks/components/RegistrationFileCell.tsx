'use client'

import Link from 'next/link'
import { RegistrationFileBadge } from '@/src/domains/registration-file/components/RegistrationFileBadge'
import type { RegistrationFileSummaryDto } from '@/src/domains/registration-file/types/registration-file.types'

interface RegistrationFileCellProps {
  trackId: string
  summary?: RegistrationFileSummaryDto | null
}

/**
 * Estado del Expediente de Registro por fila de "Mis canciones". `summary`
 * viene de un único fetch en lote (`useRegistrationFileSummaries`) resuelto
 * por el listado padre — evita N+1 requests, mismo criterio que `CertificateCell`.
 */
export function RegistrationFileCell({ trackId, summary }: RegistrationFileCellProps) {
  if (!summary) {
    return (
      <Link
        href={`/music/tracks/${trackId}/expediente`}
        className="text-[9px] sm:text-[10px] font-bold uppercase text-primary hover:underline whitespace-nowrap"
      >
        Preparar expediente
      </Link>
    )
  }

  return (
    <Link href={`/music/tracks/${trackId}/expediente`}>
      <RegistrationFileBadge status={summary.status} caseNumber={summary.caseNumber} />
    </Link>
  )
}
