'use client'

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Music2 } from 'lucide-react';
import { useFeaturedTracks } from '../hooks/use-tracks.hooks';
import { MusicalGenreDto } from '@/src/domains/musical-genre/types/musical-genre.types';

function resolveGenreName(genre?: MusicalGenreDto | string): string {
  if (!genre) return '';
  if (typeof genre === 'string') return genre;
  return genre.genre ?? '';
}

export function FeaturedTracksCarousel() {
  const { data: tracks, isLoading, isError } = useFeaturedTracks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -600 : 600,
        behavior: 'smooth',
      });
    }
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="py-8 w-full">
        <h2 className="text-2xl font-bold text-white mb-6 px-4">Canciones Destacadas</h2>
        <div className="flex gap-4 overflow-x-hidden px-4 pb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shrink-0 w-[160px] sm:w-[180px]">
              <div className="w-full aspect-square rounded-xl bg-slate-800 animate-pulse mb-3" />
              <div className="w-3/4 h-3.5 bg-slate-800 animate-pulse rounded mb-2" />
              <div className="w-1/2 h-3 bg-slate-800/60 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !tracks || tracks.length === 0) return null;

  const featuredTracks = tracks.slice(0, 20);

  return (
    <div className="py-8 w-full group/carousel relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-white tracking-tight">Canciones Destacadas</h2>
          <span className="text-xs text-slate-500 font-medium">
            {featuredTracks.length} canciones seleccionadas para ti
          </span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-700/50 to-transparent ml-6 hidden md:block" />
      </div>

      <div className="relative overflow-hidden">
        {/* Chevron izquierdo */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/60 hidden md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Chevron derecho */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-black/60 hidden md:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable track list */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 px-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {featuredTracks.map((track) => {
            const genreName = resolveGenreName(track.genre);

            return (
              <Link
                key={track.id}
                href={`/music/tracks/${track.id}`}
                className="group/track flex flex-col shrink-0 snap-start w-[155px] sm:w-[170px] md:w-[185px] cursor-pointer"
                aria-label={`Ver detalle de ${track.title}`}
              >
                {/* Cover */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 shadow-lg transition-transform duration-300 group-hover/track:scale-[1.04] group-active/track:scale-95">
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={`Portada de ${track.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <Music2 className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/track:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Genre chip */}
                  {genreName && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-slate-200 border border-white/10 backdrop-blur-sm uppercase tracking-wide">
                      {genreName}
                    </span>
                  )}
                </div>

                {/* Title */}
                <span className="text-sm font-bold text-white group-hover/track:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1">
                  {track.title}
                </span>

                {/* Authors — not available in list response */}
                <span className="text-xs text-slate-500 line-clamp-1">—</span>
              </Link>
            );
          })}

          {/* Spacer final */}
          <div className="w-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
