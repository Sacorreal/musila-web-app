import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { BackButton } from '@/src/shared/components/UI/BackButton';
import { fetchTrackById } from '@/src/domains/tracks/services/tracks.actions';
import { TrackDetailHero } from '@/src/domains/tracks/components/TrackDetailHero';
import { TrackLyrics } from '@/src/domains/tracks/components/TrackLyrics';
import { TrackRequestsTable } from '@/src/domains/requests/components/TrackRequestsTable';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const track = await fetchTrackById(id);
    if (!track) return { title: 'Músila - Canción no encontrada' };

    const authorsNames = track.authors?.map(a => `${a.name} ${a.lastName || ''}`).join(', ') || 'Varios autores';
    const description = `Escucha "${track.title}" de ${authorsNames} en Músila. La plataforma que conecta compositores con intérpretes.`;
    
    return {
      title: `${track.title} - ${authorsNames} | Músila`,
      description,
      openGraph: {
        title: track.title,
        description,
        images: [
          {
            url: track.coverUrl,
            width: 1200,
            height: 630,
            alt: `Carátula de ${track.title}`,
          },
        ],
        type: 'music.song',
        siteName: 'Músila',
      },
      twitter: {
        card: 'summary_large_image',
        title: track.title,
        description,
        images: [track.coverUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Músila - Detalle de Canción',
    };
  }
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const track = await fetchTrackById(id);

    if (!track) {
      notFound();
    }

    return (
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        {/* Back button */}
        <BackButton className="mb-8" />

        {/* Hero: cover + info + autores */}
        <TrackDetailHero track={track} />

        {/* Letra */}
        <TrackLyrics lyric={track.lyric} />

        {/* Tabla de solicitudes — visible solo para autores de la canción */}
        <TrackRequestsTable trackId={id} authors={track.authors || []} />

        {/* Spacer inferior */}
        <div className="pb-20" />
      </main>
    );
  } catch (error) {
    console.error('Error al cargar el detalle de la canción:', error);
    notFound();
  }
}
