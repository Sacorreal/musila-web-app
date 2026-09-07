import { BackButton } from '@/src/shared/components/UI/BackButton'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { fetchTrackById } from '@/src/domains/tracks/services/tracks.actions'
import { SongPerformancePanel } from '@/src/domains/dashboard/components/SongPerformancePanel'

export default async function SongDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const track = await fetchTrackById(id).catch(() => null)

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <BackButton />
      <PageHeader
        title="Rendimiento de la canción"
        description={track?.title ?? 'Analiza las reproducciones y el alcance de esta canción'}
      />
      <SongPerformancePanel trackId={id} fallbackTitle={track?.title} />
    </div>
  )
}
