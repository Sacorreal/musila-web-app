"use client"

import { ArtistCard } from "@/src/components/app/artist-card"
import { TrackCard } from "@/src/components/app/track-card"

import type { Track, User } from "@/src/lib/types"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function AppHomePage() {

  const [tracks, setTracks] = useState<Track[]>([])
  const [featuredAuthors, setFeaturedAuthors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  

   

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-white mb-2">Contenido principal</h2>
        <p className="text-white/60">Descubre nuevas canciones y conecta con otros artistas</p>
      </section>

      {featuredAuthors.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Compositores destacados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredAuthors.map((author) => (
              <ArtistCard key={author.id} artist={author} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Canciones recientes</h2>
        {tracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#2a3a4a] rounded-xl border border-[#3a4a5a]">
            <p className="text-white/60">No hay canciones disponibles aún</p>
          </div>
        )}
      </section>
    </div>
  )
}
