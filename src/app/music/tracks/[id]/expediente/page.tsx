import { notFound } from 'next/navigation'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { fetchTrackById } from '@/src/domains/tracks/services/tracks.actions'
import { fetchRegistrationFileByTrack } from '@/src/domains/registration-file/services/registration-file.actions'
import { RegistrationFileWizard } from '@/src/domains/registration-file/components/RegistrationFileWizard'
import { CreateRegistrationFilePrompt } from '@/src/domains/registration-file/components/CreateRegistrationFilePrompt'

export const metadata = { title: 'Expediente de Registro — Musila' }

export default async function ExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const track = await fetchTrackById(id)
  if (!track) notFound()

  const registrationFile = await fetchRegistrationFileByTrack(id)

  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <BackButton className="mb-6" />

      {registrationFile ? (
        <RegistrationFileWizard registrationFileId={registrationFile.id} initialData={registrationFile} />
      ) : (
        <CreateRegistrationFilePrompt trackId={id} trackTitle={track.title} />
      )}
    </main>
  )
}
