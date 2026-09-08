import { notFound } from 'next/navigation'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { fetchCampaignByIdAction } from '@/src/domains/campaigns/services/campaigns.actions'
import { CampaignComposerView } from '@/src/domains/campaigns/components/CampaignComposerView'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await fetchCampaignByIdAction(id)

  if (!campaign) notFound()

  return (
    <main className="container mx-auto p-4 md:p-8">
      <BackButton className="mb-4" />
      <CampaignComposerView campaign={campaign} />
    </main>
  )
}
