'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Music2 } from 'lucide-react'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { LicenseType } from '@/src/domains/tracks/types/track.types'
import { useCampaignSubmissions, useDiscardSubmission, useSelectSubmission } from '../hooks/use-campaigns.hooks'
import type { Campaign, CampaignSubmission } from '../types/campaigns.types'
import { CampaignProgressBar } from './CampaignProgress'

const SUBMISSION_STATUS_LABEL: Record<CampaignSubmission['status'], string> = {
  PENDING: 'Pendiente',
  SELECTED: 'Seleccionada',
  DISCARDED: 'Descartada',
  LICENSED: 'Licenciada',
}

interface CampaignSubmissionsListProps {
  campaign: Campaign
}

/** Bandeja de entrada de una campaña: postulaciones recibidas (§4 Revisión y Adquisición). */
export function CampaignSubmissionsList({ campaign }: CampaignSubmissionsListProps) {
  const { data: submissions, isLoading, isError } = useCampaignSubmissions(campaign.id)
  const discardSubmission = useDiscardSubmission(campaign.id)
  const [selecting, setSelecting] = useState<CampaignSubmission | null>(null)

  if (isLoading) return <LoadingState message="Cargando postulaciones…" />
  if (isError) return <ErrorState message="No se pudieron cargar las postulaciones." />

  const pending = (submissions ?? []).filter((s) => s.status === 'PENDING')
  const processed = (submissions ?? []).filter((s) => s.status !== 'PENDING')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">{campaign.title}</h1>
        <p className="text-sm text-muted-foreground">{campaign.description}</p>
      </div>

      <CampaignProgressBar campaign={campaign} />

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Pendientes de revisión ({pending.length})</p>
        {pending.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No hay postulaciones pendientes.
          </div>
        ) : (
          pending.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onApprove={() => setSelecting(submission)}
              onDiscard={() => discardSubmission.mutate(submission.id)}
              discardPending={discardSubmission.isPending}
            />
          ))
        )}
      </div>

      {processed.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Procesadas ({processed.length})</p>
          {processed.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}

      <SelectSubmissionDialog
        campaignId={campaign.id}
        submission={selecting}
        onClose={() => setSelecting(null)}
      />
    </div>
  )
}

function SubmissionCard({
  submission,
  onApprove,
  onDiscard,
  discardPending,
}: {
  submission: CampaignSubmission
  onApprove?: () => void
  onDiscard?: () => void
  discardPending?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
          {submission.trackCoverUrl ? (
            <Image src={submission.trackCoverUrl} alt={submission.trackTitle} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Music2 className="h-6 w-6" aria-hidden />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{submission.trackTitle}</p>
          <p className="truncate text-xs text-muted-foreground">{submission.composerName}</p>
          {submission.trackAudioUrl && (
            <audio controls src={submission.trackAudioUrl} className="mt-2 h-8 w-full max-w-xs" />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={submission.status === 'PENDING' ? 'secondary' : submission.status === 'DISCARDED' ? 'outline' : 'default'}>
            {SUBMISSION_STATUS_LABEL[submission.status]}
          </Badge>
          {onApprove && (
            <Button size="sm" onClick={onApprove}>
              Aprobar
            </Button>
          )}
          {onDiscard && (
            <Button size="sm" variant="ghost" disabled={discardPending} onClick={onDiscard}>
              Descartar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SelectSubmissionDialog({
  campaignId,
  submission,
  onClose,
}: {
  campaignId: string
  submission: CampaignSubmission | null
  onClose: () => void
}) {
  const [licenseType, setLicenseType] = useState<LicenseType>(LicenseType.LICENCIA_DE_PRIMER_USO)
  const selectSubmission = useSelectSubmission(campaignId)

  const handleConfirm = async () => {
    if (!submission) return
    try {
      await selectSubmission.mutateAsync({ submissionId: submission.id, licenseType })
      onClose()
    } catch {
      /* toast en el hook */
    }
  }

  return (
    <Dialog open={!!submission} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprobar postulación</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Se creará una solicitud de licencia para <strong>{submission?.trackTitle}</strong> y continuará el flujo de
          licenciamiento habitual.
        </p>

        <Select value={licenseType} onValueChange={(v) => setLicenseType(v as LicenseType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={LicenseType.LICENCIA_DE_PRIMER_USO}>Licencia de primer uso</SelectItem>
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={selectSubmission.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={selectSubmission.isPending}>
            {selectSubmission.isPending ? 'Aprobando…' : 'Aprobar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
