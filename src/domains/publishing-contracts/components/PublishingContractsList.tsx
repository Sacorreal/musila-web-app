'use client'

import { useState } from 'react'
import { FileText, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/components/UI/alert-dialog'
import { useDeletePublishingContract, useMyPublishingContracts } from '../hooks/use-publishing-contracts.hooks'
import { CreatePublishingContractDialog } from './CreatePublishingContractDialog'
import { PublishingContractStatus, type PublishingContractDto } from '../types/publishing-contract.types'

function isEffectivelyFinalized(contract: PublishingContractDto): boolean {
  if (contract.status === PublishingContractStatus.FINALIZADO) return true
  return !!contract.endDate && new Date(contract.endDate).getTime() < Date.now()
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function PublishingContractsList() {
  const { data: contracts, isLoading, error } = useMyPublishingContracts()
  const { mutate: deleteContract, isPending: isDeleting } = useDeletePublishingContract()

  const [editTarget, setEditTarget] = useState<PublishingContractDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PublishingContractDto | null>(null)

  if (isLoading) return <LoadingState message="Cargando contratos editoriales..." />
  if (error) return <ErrorState message="No se pudieron cargar tus contratos editoriales" />

  if (!contracts?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Aún no has registrado ningún contrato editorial.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {contracts.map((contract) => {
        const finalized = isEffectivelyFinalized(contract)
        return (
          <Card key={contract.id}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{contract.publisherName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(contract.startDate)}
                    {contract.endDate ? ` — ${formatDate(contract.endDate)}` : ' — indefinido'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={finalized ? 'secondary' : 'default'}>
                  {finalized ? 'Finalizado' : 'Vigente'}
                </Badge>
                <a href={contract.documentUrl} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon-sm" aria-label="Ver documento">
                    <FileText className="h-4 w-4" />
                  </Button>
                </a>
                <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={() => setEditTarget(contract)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar"
                  onClick={() => setDeleteTarget(contract)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <CreatePublishingContractDialog isOpen={!!editTarget} onClose={() => setEditTarget(null)} initialData={editTarget} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contrato editorial?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los expedientes que ya lo referencian conservarán la relación, pero no
              podrás volver a seleccionarlo para nuevas obras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (deleteTarget) deleteContract(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
