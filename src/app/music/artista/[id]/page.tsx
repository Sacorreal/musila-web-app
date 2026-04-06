import React from 'react';
import { notFound } from 'next/navigation';
import { fetchArtistById, fetchArtistTracks } from '@/src/domains/artists/services/artists.actions';
import { ArtistProfileBanner } from '@/src/domains/artists/components/ArtistProfileBanner';
import { ArtistBiography } from '@/src/domains/artists/components/ArtistBiography';
import { ArtistTracksList } from '@/src/domains/artists/components/ArtistTracksList';

export default async function ArtistDetailServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Parallel fetch for optimal performance
    const [artist, tracks] = await Promise.all([
      fetchArtistById(id),
      fetchArtistTracks(id)
    ]);

    if (!artist) {
      notFound();
    }

    return (
      <main className="container mx-auto p-4 md:p-8">
        <ArtistProfileBanner artist={artist} />
        <ArtistBiography biography={artist.biography} />
        <ArtistTracksList tracks={tracks} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching artist details:', error);
    // In case of error (like 404 from backend), trigger Next.js notFound or show an error state
    notFound();
  }
}
