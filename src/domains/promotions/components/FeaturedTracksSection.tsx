'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Music2 } from 'lucide-react'
import { useFeaturedTracks } from '../hooks/use-featured.hooks'

/**
 * Componente público “Tracks Destacados” (requerimiento §FEATURES 6): hasta 10
 * tracks pautados vigentes con imagen, título, autor y género; enlaza al detalle
 * del track. Ante error o vacío no renderiza nada (fallback silencioso, §Flow 4).
 */
export function FeaturedTracksSection() {
  const { data, isLoading, isError } = useFeaturedTracks()

  if (isLoading) {
    return (
      <section className="py-8 w-full">
        <h2 className="mb-6 px-4 text-2xl font-bold text-foreground">Tracks Destacados</h2>
        <div className="flex gap-4 overflow-x-hidden px-4 pb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[135px] shrink-0 sm:w-[155px] md:w-[175px]">
              <div className="mb-3 aspect-square w-full animate-pulse rounded-xl bg-muted" />
              <div className="mb-2 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data || data.length === 0) return null

  return (
    <section className="py-8 w-full">
      <div className="mb-6 flex flex-col px-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Tracks Destacados</h2>
        <span className="text-xs font-medium text-muted-foreground">
          Contenido destacado en la plataforma
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 pb-4">
        {data.map((track) => (
          <Link
            key={track.promotionId}
            href={`/music/tracks/${track.trackId}`}
            className="group w-[135px] shrink-0 sm:w-[155px] md:w-[175px]"
          >
            <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-muted">
              {track.coverUrl ? (
                <Image
                  src={track.coverUrl}
                  alt={track.title}
                  fill
                  sizes="175px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Music2 className="h-8 w-8" aria-hidden />
                </div>
              )}
            </div>
            <p className="truncate text-sm font-semibold text-foreground">{track.title}</p>
            {track.author && (
              <p className="truncate text-xs text-muted-foreground">{track.author}</p>
            )}
            {track.genre && (
              <p className="truncate text-[11px] text-muted-foreground/70">{track.genre}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
