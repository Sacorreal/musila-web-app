'use client'

import { use } from 'react'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { ErrorState } from '@/src/shared/components/UI/ErrorState'
import { useCampaign } from '@/src/domains/campaigns/hooks/use-campaigns.hooks'
import { CampaignSubmissionsList } from '@/src/domains/campaigns/components/CampaignSubmissionsList'

export default function CampaignSubmissionsPage({
  params,
}: {
  params: Promise<{ organizationId: string; campaignId: string }>
}) {
  const { campaignId } = use(params)
  const { data: campaign, isLoading, isError } = useCampaign(campaignId)

  return (
    <div className="space-y-4">
      <BackButton />
      {isLoading ? (
        <LoadingState message="Cargando campaña…" />
      ) : isError || !campaign ? (
        <ErrorState message="No se pudo cargar la campaña." />
      ) : (
        <CampaignSubmissionsList campaign={campaign} />
      )}
    </div>
  )
}
