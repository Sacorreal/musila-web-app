"use client";

import React from 'react';
import Link from 'next/link';
import { Music2, User2, FileText } from 'lucide-react';
import { TrackResponse } from '@/src/domains/tracks/types/track.types';
import { MusicalGenreDto } from '@/src/domains/musical-genre/types/musical-genre.types';
import { RequestTrackModal } from '@/src/domains/requests/components/RequestTrackModal';
import { AddToPlaylistModal } from '@/src/domains/playlists/components/AddToPlaylistModal';
import { Button } from '@/src/shared/components/UI/button';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { PlaylistIcon } from '@/src/shared/components/Icons/icons';
import { usePlayerStore } from '@/src/domains/player/store/use-player-store';
import { Play } from 'lucide-react';

interface TrackDetailHeroProps {
  track: TrackResponse;
}

function resolveGenreName(genre?: MusicalGenreDto | string): string {
  if (!genre) return '';
  if (typeof genre === 'string') return genre;
  return genre.genre ?? '';
}

export function TrackDetailHero({ track }: TrackDetailHeroProps) {
  const genreName = resolveGenreName(track.genre);
  const userId = useAuthStore((s) => s.user?.id);

  // Ocultar "Solicitar Uso" si el usuario autenticado es uno de los autores del track
  const isAuthor = track.authors?.some((a) => a.id === userId) ?? false;

  return (
    <section className="relative w-full">
      {/* Background blur based on cover */}
      <div
        className="absolute inset-0 -z-10 opacity-20 blur-3xl scale-110"
        style={{ backgroundImage: `url(${track.coverUrl || '/cover-default.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end">
        {/* Cover Art */}
        <div className="shrink-0">
          <img
            src={track.coverUrl || '/cover-default.png'}
            alt={`Portada de ${track.title}`}
            className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl object-cover shadow-2xl border border-white/10"
          />
        </div>

        <div className="flex flex-col gap-4 min-w-0 flex-1 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Canción</p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight break-words">
            {track.title}
          </h1>

          {/* Género y Subgénero */}
          <div className="flex flex-wrap gap-2">
            {genreName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/20 dark:border-blue-500/30 tracking-wide uppercase">
                {genreName}
              </span>
            )}
            {track.subGenre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 tracking-wide uppercase">
                {track.subGenre}
              </span>
            )}
          </div>

          {/* Autores */}
          {track.authors && track.authors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-muted-foreground">Autor: </span>
              <User2 className="w-4 h-4 text-muted-foreground shrink-0" />
              {track.authors.map((author, index) => (
                <React.Fragment key={author.id}>
                  <Link
                    href={`/music/artista/${author.id}`}
                    className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                     {author.name} {author.lastName || ''}
                  </Link>
                  {index < track.authors!.length - 1 && (
                    <span className="text-muted-foreground/50 text-xs">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Action Buttons — stack on mobile, row on sm+ */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
            <Button
              size="lg"
              onClick={() => usePlayerStore.getState().play(track)}
              className="gap-2 rounded-full font-black uppercase tracking-tight px-5 sm:px-8 bg-foreground text-background shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 h-10 sm:h-12"
            >
              <Play className="w-5 h-5 fill-current" />
              Reproducir
            </Button>

            <AddToPlaylistModal trackId={track.id} trackTitle={track.title}>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-full font-bold px-4 sm:px-6 border-white/20 hover:bg-white/10 h-10 sm:h-12 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <PlaylistIcon className="w-5 h-5" />
                Agregar a Playlist
              </Button>
            </AddToPlaylistModal>

            {/* Solo visible para no-autores */}
            {!isAuthor && (
              <RequestTrackModal
                trackId={track.id}
                genreSlug={typeof track.genre === 'object' ? (track.genre as any).slug : undefined}
              >
                <Button
                  size="lg"
                  className="gap-2 sm:gap-3 rounded-full font-black uppercase tracking-tight px-5 sm:px-8 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border-none h-10 sm:h-12"
                >
                  <FileText className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Solicitar Uso
                </Button>
              </RequestTrackModal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
