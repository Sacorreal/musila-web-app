'use client'

import { Progress } from '@/src/shared/components/UI/progress'
import type { Campaign } from '../types/campaigns.types'

interface CampaignProgressProps {
  campaign: Campaign
}

/** Progreso de cumplimiento de la campaña: seleccionadas/licenciadas/descartadas y % de cumplimiento. */
export function CampaignProgressBar({ campaign }: CampaignProgressProps) {
  const progress = campaign.progress
  if (!progress) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {progress.selectedCount} / {campaign.requiredSongsCount} canciones seleccionadas
        </span>
        <span className="font-semibold text-foreground">{progress.completionPercentage}%</span>
      </div>
      <Progress value={progress.completionPercentage} />
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Pendientes: {progress.pendingCount}</span>
        <span>Seleccionadas: {progress.selectedCount}</span>
        <span>Licenciadas: {progress.licensedCount}</span>
        <span>Descartadas: {progress.discardedCount}</span>
      </div>
    </div>
  )
}
