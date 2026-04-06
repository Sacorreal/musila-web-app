'use client'

import React from 'react';
import Link from 'next/link';
import { useFeaturedArtists } from '../hooks/use-artists.hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar';

export function ArtistsCarousel() {
  const { data: artists, isLoading, isError } = useFeaturedArtists();

  if (isLoading) {
    return (
      <div className="py-6 w-full overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-4">Autores Destacados</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-800 animate-pulse" />
              <div className="w-20 h-4 bg-slate-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="py-6 w-full overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-4">Autores Destacados</h2>
      <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {artists.map((artist) => (
          <Link key={artist.id} href={`/music/artista/${artist.id}`} className="flex flex-col items-center gap-3 shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity outline-none ring-0">
            <div className="p-1 rounded-full bg-white relative shadow-md">
               <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                  <AvatarImage src={artist.avatar} alt={`${artist.name || ''} ${artist.lastName || ''}`} className="object-cover" />
                  <AvatarFallback className="bg-slate-700 text-white font-medium text-lg">
                    {(artist.name?.charAt(0) || '') + (artist.lastName?.charAt(0) || '')}
                  </AvatarFallback>
               </Avatar>
            </div>
            <span className="text-sm font-semibold text-white whitespace-nowrap mt-1">
              {artist.name} {artist.lastName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
