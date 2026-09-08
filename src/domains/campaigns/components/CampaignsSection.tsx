'use client'

import { usePublicCampaigns } from '../hooks/use-campaigns.hooks'
import { CampaignCard } from './CampaignCard'

/**
 * Sección pública "Campañas" en el home principal (§Publicación de la
 * Campaña): campañas activas ordenadas por fecha de vencimiento más próxima.
 * Fallback silencioso si está vacío o falla, igual que los destacados.
 */
export function CampaignsSection() {
  const { data, isLoading, isError } = usePublicCampaigns()

  if (isLoading) {
    return (
      <section className="py-8 w-full">
        <h2 className="mb-6 px-4 text-2xl font-bold text-foreground">Campañas</h2>
        <div className="flex gap-4 overflow-x-hidden px-4 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[220px] shrink-0">
              <div className="mb-3 aspect-video w-full animate-pulse rounded-xl bg-muted" />
              <div className="mb-2 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data || data.data.length === 0) return null

  return (
    <section className="py-8 w-full">
      <div className="mb-6 flex flex-col px-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Campañas</h2>
        <span className="text-xs font-medium text-muted-foreground">
          Sellos y compositores buscando canciones para licenciar. Postula tus tracks publicados.
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 pb-4">
        {data.data.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  )
}
