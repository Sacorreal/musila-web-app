'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/src/shared/components/UI/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar'
import type { Campaign } from '../types/campaigns.types'
import { getInitials } from '../utils/get-initials'
import { urgencyLabel } from '../utils/campaign-format'

interface CampaignCardProps {
  campaign: Campaign
}

/** Tarjeta pública de campaña (home "Campañas", §Publicación de la Campaña). */
export function CampaignCard({ campaign }: CampaignCardProps) {
  const genreNames = campaign.genreFilters.map((f) => f.genreName).join(', ')

  return (
    <Link
      href={`/music/campanas/${campaign.id}`}
      className="group block w-[220px] shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {campaign.displayCoverUrl ? (
          <Image
            src={campaign.displayCoverUrl}
            alt={campaign.authorName}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                {getInitials(campaign.authorName)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <Badge className="absolute right-2 top-2" variant="secondary">
          {urgencyLabel(campaign.deadline)}
        </Badge>
      </div>

      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-semibold text-foreground">{campaign.title}</p>
        <div className="flex items-center gap-1.5">
          <Avatar className="h-4 w-4">
            {campaign.displayCoverUrl && <AvatarImage src={campaign.displayCoverUrl} alt={campaign.authorName} />}
            <AvatarFallback className="text-[8px]">{getInitials(campaign.authorName)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{campaign.authorName}</span>
        </div>
        {genreNames && <p className="truncate text-[11px] text-muted-foreground/70">{genreNames}</p>}
      </div>
    </Link>
  )
}
