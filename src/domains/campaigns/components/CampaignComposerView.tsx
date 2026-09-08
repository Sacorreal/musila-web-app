'use client'

import Image from 'next/image'
import { Music2, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import type { Campaign, MatchingTrack } from '../types/campaigns.types'
import { getInitials } from '../utils/get-initials'
import { CAMPAIGN_CLOSED_REASON_LABEL, formatDate, urgencyLabel } from '../utils/campaign-format'
import { useMatchingTracks, useSubmitToCampaign } from '../hooks/use-campaigns.hooks'

interface CampaignComposerViewProps {
  campaign: Campaign
}

/** Vista del compositor al entrar a una campaña (pública o privada por enlace). */
export function CampaignComposerView({ campaign }: CampaignComposerViewProps) {
  const { data: tracks, isLoading, isError } = useMatchingTracks(campaign.id)
  const submit = useSubmitToCampaign(campaign.id)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-8">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          {campaign.displayCoverUrl ? (
            <Image src={campaign.displayCoverUrl} alt={campaign.authorName} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                  {getInitials(campaign.authorName)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground">{campaign.title}</h1>
          <p className="text-sm text-muted-foreground">{campaign.authorName}</p>
          <p className="mt-1 text-xs text-muted-foreground">{campaign.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'outline'}>
              {campaign.status === 'ACTIVE' ? urgencyLabel(campaign.deadline) : 'Campaña cerrada'}
            </Badge>
            {campaign.status === 'CLOSED' && campaign.closedReason && (
              <span className="text-xs text-muted-foreground">
                {CAMPAIGN_CLOSED_REASON_LABEL[campaign.closedReason]} · {formatDate(campaign.closedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {campaign.status !== 'ACTIVE' ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Esta campaña ya no está recibiendo canciones.
        </div>
      ) : isLoading ? (
        <LoadingState message="Buscando canciones de tu catálogo que coincidan…" />
      ) : isError ? (
        <ErrorState message="No se pudieron cargar tus canciones." />
      ) : !tracks || tracks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Ninguna de tus canciones publicadas coincide con los géneros/ritmos buscados por esta campaña.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Tus canciones que coinciden ({tracks.length})
          </p>
          {tracks.map((track: MatchingTrack) => (
            <Card key={track.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {track.coverUrl ? (
                    <Image src={track.coverUrl} alt={track.title} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Music2 className="h-6 w-6" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{track.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {track.genre}
                    {track.ritmo ? ` · ${track.ritmo}` : ''}
                  </p>
                </div>
                {track.alreadySubmitted ? (
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Postulada
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    className="shrink-0"
                    disabled={submit.isPending}
                    onClick={() => submit.mutate(track.id)}
                  >
                    Enviar track
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
