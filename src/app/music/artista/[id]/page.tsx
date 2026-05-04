import React from 'react';
import { notFound } from 'next/navigation';
import { fetchArtistById } from '@/src/domains/artists/services/artists.actions';
import { ArtistProfileBanner } from '@/src/domains/artists/components/ArtistProfileBanner';
import { ArtistBiography } from '@/src/domains/artists/components/ArtistBiography';
import { ArtistTracksList } from '@/src/domains/artists/components/ArtistTracksList';

export default async function ArtistDetailServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const artist = await fetchArtistById(id);

    if (!artist) {
      notFound();
    }

    return (
      <main className="container mx-auto p-4 md:p-8">
        <ArtistProfileBanner artist={artist} />
        <ArtistBiography biography={artist.biography ?? undefined} />
        <ArtistTracksList 
          tracks={artist.tracks} 
          artistId={artist.id}
          artistName={artist.name}
          artistLastName={(artist as any).lastName}
        />
      </main>
    );
  } catch (error) {
    console.error('Error fetching artist details:', error);
    notFound();
  }
}
