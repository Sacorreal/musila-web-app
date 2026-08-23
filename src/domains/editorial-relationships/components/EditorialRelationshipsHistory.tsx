'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import type { EditorialRelationshipDto, EditorialRelationshipStatus } from '../types/editorial-relationship.types'

const STATUS_LABEL: Record<EditorialRelationshipStatus, string> = {
  declarada: 'Declarada',
  confirmada: 'Confirmada',
  rechazada: 'Rechazada',
  activa_sin_confirmar: 'Activa (sin confirmar)',
}

const STATUS_VARIANT: Record<EditorialRelationshipStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  declarada: 'outline',
  confirmada: 'default',
  rechazada: 'destructive',
  activa_sin_confirmar: 'secondary',
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

interface EditorialRelationshipsHistoryProps {
  items?: EditorialRelationshipDto[]
  isLoading: boolean
  isError: boolean
  /** 'author': muestra el nombre de la editora. 'publisher': muestra el nombre del autor. */
  perspective: 'author' | 'publisher'
  emptyActionHref?: string
  emptyActionLabel?: string
}

/** Historial unificado de relaciones editora-autor (Flow 3): declaradas, confirmadas y rechazadas. */
export function EditorialRelationshipsHistory({
  items,
  isLoading,
  isError,
  perspective,
  emptyActionHref,
  emptyActionLabel,
}: EditorialRelationshipsHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState message="No se pudo cargar el historial de relaciones editoriales." />
  }

  if (!items?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm font-medium text-foreground">Todavía no hay relaciones registradas.</p>
          {emptyActionHref && (
            <Link href={emptyActionHref} className="text-sm font-medium text-primary underline underline-offset-4">
              {emptyActionLabel ?? 'Registrar tu primera relación editorial'}
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const name = perspective === 'author' ? item.editoraName : item.counterpartyName ?? '—'
        const dateLabel = item.confirmedAt ? formatDate(item.confirmedAt) : formatDate(item.createdAt)
        return (
          <Card key={`${item.source}-${index}`}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.percentage !== null ? `${item.percentage}% · ` : ''}
                  {dateLabel}
                  {item.editoraIpiNumber ? ` · IPI ${item.editoraIpiNumber}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={STATUS_VARIANT[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                {item.documentUrl ? (
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-4"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Ver documento
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">Sin documento</span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
