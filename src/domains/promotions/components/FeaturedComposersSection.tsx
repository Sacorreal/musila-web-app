'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar'
import { useFeaturedComposers } from '../hooks/use-featured.hooks'

/**
 * Componente público “Compositores Destacados” (requerimiento §FEATURES 7):
 * hasta 5 compositores pautados vigentes con avatar, nombre y género; enlaza al
 * perfil. Ante error o vacío no renderiza nada (fallback silencioso, §Flow 5).
 */
export function FeaturedComposersSection() {
  const { data, isLoading, isError } = useFeaturedComposers()

  if (isLoading) {
    return (
      <section className="py-8 w-full">
        <h2 className="mb-6 px-4 text-2xl font-bold text-foreground">Compositores Destacados</h2>
        <div className="flex gap-6 overflow-x-hidden px-4 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex w-[110px] shrink-0 flex-col items-center">
              <div className="mb-3 h-24 w-24 animate-pulse rounded-full bg-muted" />
              <div className="mb-1 h-3.5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data || data.length === 0) return null

  const initials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  return (
    <section className="py-8 w-full">
      <div className="mb-6 flex flex-col px-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Compositores Destacados</h2>
        <span className="text-xs font-medium text-muted-foreground">
          Creadores destacados en la plataforma
        </span>
      </div>

      <div className="flex gap-6 overflow-x-auto px-4 pb-4">
        {data.map((composer) => (
          <Link
            key={composer.promotionId}
            href={`/music/artista/${composer.composerId}`}
            className="group flex w-[110px] shrink-0 flex-col items-center text-center"
          >
            <Avatar className="mb-3 h-24 w-24 ring-2 ring-transparent transition group-hover:ring-primary">
              {composer.avatarUrl && <AvatarImage src={composer.avatarUrl} alt={composer.name} />}
              <AvatarFallback>{initials(composer.name)}</AvatarFallback>
            </Avatar>
            <p className="w-full truncate text-sm font-semibold text-foreground">{composer.name}</p>
            {composer.genre && (
              <p className="w-full truncate text-xs text-muted-foreground">{composer.genre}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
