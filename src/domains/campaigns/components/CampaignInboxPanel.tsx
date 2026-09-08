'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import { Avatar, AvatarFallback } from '@/src/shared/components/UI/avatar'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { useMyCampaigns, useRemoveCampaign } from '../hooks/use-campaigns.hooks'
import { CreateCampaignDialog } from './CreateCampaignDialog'
import { CampaignProgressBar } from './CampaignProgress'
import { getInitials } from '../utils/get-initials'
import { CAMPAIGN_CLOSED_REASON_LABEL, formatDate, urgencyLabel } from '../utils/campaign-format'
import type { Campaign } from '../types/campaigns.types'

/**
 * Panel "Campañas": activas e historial (§CREACIÓN DE CAMPAÑAS). Reutilizable
 * tanto para el workspace de una organización (`/org/:id/campanas`) como para
 * campañas personales de cualquier usuario que pueda buscar canciones en el
 * marketplace (`/music/mis-campanas`) — el backend decide el scope según si
 * hay una organización activa (header `x-organization-id`).
 */
export function CampaignInboxPanel() {
  const { data, isLoading, isError } = useMyCampaigns()

  const grouped = useMemo(() => {
    const list = data?.data ?? []
    return {
      active: list.filter((c) => c.status === 'ACTIVE'),
      closed: list.filter((c) => c.status === 'CLOSED'),
    }
  }, [data])

  if (isLoading) return <LoadingState message="Cargando tus campañas…" />
  if (isError) return <ErrorState message="No se pudieron cargar tus campañas." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Campañas</h1>
          <p className="text-sm text-muted-foreground">Buzón de recepción de canciones.</p>
        </div>
        <CreateCampaignDialog />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Activas ({grouped.active.length})</TabsTrigger>
          <TabsTrigger value="closed">Historial ({grouped.closed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <CampaignList items={grouped.active} emptyText="No tienes campañas activas." allowDelete={false} />
        </TabsContent>
        <TabsContent value="closed" className="mt-4">
          <CampaignList items={grouped.closed} emptyText="No hay campañas en tu historial." allowDelete />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CampaignList({
  items,
  emptyText,
  allowDelete,
}: {
  items: Campaign[]
  emptyText: string
  allowDelete: boolean
}) {
  const removeCampaign = useRemoveCampaign()

  const inboxHref = (campaign: Campaign) =>
    campaign.organizationId
      ? `/org/${campaign.organizationId}/campanas/${campaign.id}`
      : `/music/mis-campanas/${campaign.id}`

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((campaign) => (
        <Card key={campaign.id}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                {campaign.displayCoverUrl ? (
                  <Image src={campaign.displayCoverUrl} alt={campaign.authorName} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-semibold">{getInitials(campaign.authorName)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link href={inboxHref(campaign)} className="hover:underline">
                  <p className="truncate text-sm font-medium text-foreground">{campaign.title}</p>
                </Link>
                <p className="truncate text-xs text-muted-foreground">{campaign.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {campaign.status === 'ACTIVE'
                    ? urgencyLabel(campaign.deadline)
                    : `${campaign.closedReason ? CAMPAIGN_CLOSED_REASON_LABEL[campaign.closedReason] : 'Cerrada'} · ${formatDate(campaign.closedAt)}`}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant={campaign.visibility === 'PUBLIC' ? 'default' : 'outline'}>
                  {campaign.visibility === 'PUBLIC' ? 'Pública' : 'Privada'}
                </Badge>
                <Button asChild size="sm" variant="ghost">
                  <Link href={inboxHref(campaign)}>Ver bandeja</Link>
                </Button>
                {campaign.visibility === 'PRIVATE' && campaign.privateToken && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const url = `${window.location.origin}/music/campanas/privada/${campaign.privateToken}`
                      navigator.clipboard.writeText(url)
                      toast.success('Enlace copiado')
                    }}
                  >
                    <Link2 className="mr-1 h-3.5 w-3.5" /> Copiar enlace
                  </Button>
                )}
                {allowDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    disabled={removeCampaign.isPending}
                    onClick={() => removeCampaign.mutate(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <CampaignProgressBar campaign={campaign} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
