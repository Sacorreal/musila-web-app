'use client'

import { use } from 'react'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { useCampaign } from '@/src/domains/campaigns/hooks/use-campaigns.hooks'
import { CampaignSubmissionsList } from '@/src/domains/campaigns/components/CampaignSubmissionsList'

/** Bandeja de entrada de una campaña personal (sin organización). */
export default function MyCampaignSubmissionsPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params)
  const { data: campaign, isLoading, isError } = useCampaign(campaignId)

  return (
    <main className="container mx-auto space-y-4 p-4 md:p-8">
      <BackButton />
      {isLoading ? (
        <LoadingState message="Cargando campaña…" />
      ) : isError || !campaign ? (
        <ErrorState message="No se pudo cargar la campaña." />
      ) : (
        <CampaignSubmissionsList campaign={campaign} />
      )}
    </main>
  )
}
