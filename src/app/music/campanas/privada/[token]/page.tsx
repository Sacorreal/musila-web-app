import { notFound } from 'next/navigation'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { fetchCampaignByTokenAction } from '@/src/domains/campaigns/services/campaigns.actions'
import { CampaignComposerView } from '@/src/domains/campaigns/components/CampaignComposerView'

/** Campaña privada del sello, accedida por su enlace único (§Campaña Privada). */
export default async function PrivateCampaignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const campaign = await fetchCampaignByTokenAction(token)

  if (!campaign) notFound()

  return (
    <main className="container mx-auto p-4 md:p-8">
      <BackButton className="mb-4" />
      <CampaignComposerView campaign={campaign} />
    </main>
  )
}
