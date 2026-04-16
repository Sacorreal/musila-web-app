import React from 'react';
import Link from 'next/link';
import { Music2, User2 } from 'lucide-react';
import { TrackDetailResponse } from '@/src/domains/tracks/types/track.types';
import { MusicalGenreDto } from '@/src/domains/musical-genre/types/musical-genre.types';

interface TrackDetailHeroProps {
  track: TrackDetailResponse;
}

function resolveGenreName(genre?: MusicalGenreDto | string): string {
  if (!genre) return '';
  if (typeof genre === 'string') return genre;
  return genre.genre ?? '';
}

export function TrackDetailHero({ track }: TrackDetailHeroProps) {
  const genreName = resolveGenreName(track.genre);

  return (
    <section className="relative w-full">
      {/* Background blur based on cover */}
      {track.coverUrl && (
        <div
          className="absolute inset-0 -z-10 opacity-20 blur-3xl scale-110"
          style={{ backgroundImage: `url(${track.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-end">
        {/* Cover Art */}
        <div className="shrink-0">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={`Portada de ${track.title}`}
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl border border-white/10"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
              <Music2 className="w-20 h-20 text-slate-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 min-w-0 flex-1 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Canción</p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight break-words">
            {track.title}
          </h1>

          {/* Género y Subgénero */}
          <div className="flex flex-wrap gap-2">
            {genreName && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 tracking-wide uppercase">
                {genreName}
              </span>
            )}
            {track.subGenre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                {track.subGenre}
              </span>
            )}
          </div>

          {/* Autores */}
          {track.authors && track.authors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <User2 className="w-4 h-4 text-slate-400 shrink-0" />
              {track.authors.map((author, index) => (
                <React.Fragment key={author.id}>
                  <Link
                    href={`/music/artista/${author.id}`}
                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    {author.name} {author.lastName}
                  </Link>
                  {index < track.authors!.length - 1 && (
                    <span className="text-slate-600 text-xs">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
