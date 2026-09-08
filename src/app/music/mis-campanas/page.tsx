import { CampaignInboxPanel } from '@/src/domains/campaigns/components/CampaignInboxPanel'

/** Campañas personales (sin organización) de cualquier usuario que puede buscar canciones. */
export default function MisCampanasPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <CampaignInboxPanel />
    </main>
  )
}
