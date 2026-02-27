"use client"

import { AddToPlaylistDialog } from "@/src/components/app/add-to-playlist-dialog"
import { RequestUsageDialog } from "@/src/components/app/request-usage-dialog"
import { TrackCard } from "@/src/components/app/track-card"
import { tracksService } from "@/src/domains/tracks/services/tracks.client"
import { Button } from "@/src/shared/components/UI/button"
import type { MusicalGenre, Track } from "@/src/shared/types/shared.types"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  const [tracks, setTracks] = useState<Track[]>([])
  const [genres, setGenres] = useState<MusicalGenre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      const [tracksRes, genresRes] = await Promise.all([
        query ? tracksService.search(query) : tracksService.getAll(),
        tracksService.getGenres(),
      ])

      if (tracksRes.data) setTracks(tracksRes.data)
      if (genresRes.data) setGenres(genresRes.data)

      setIsLoading(false)
    }

    loadData()
  }, [query])

  const filteredTracks = selectedGenre ? tracks.filter((track) => track.genre?.id === selectedGenre) : tracks

  const handleAddToPlaylist = (trackId: string) => {
    setSelectedTrackId(trackId)
    setPlaylistDialogOpen(true)
  }

  const handleRequestUsage = (track: Track) => {
    setSelectedTrack(track)
    setRequestDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {query ? `Resultados para "${query}"` : "Explorar"}
        </h1>
        <p className="text-muted-foreground">Descubre canciones inéditas de compositores talentosos</p>
      </div>

      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGenre(null)}
          >
            Todos
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onAddToPlaylist={handleAddToPlaylist}
              onRequestUsage={handleRequestUsage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">
            {query ? "No se encontraron resultados" : "No hay canciones disponibles"}
          </p>
        </div>
      )}

      <AddToPlaylistDialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen} trackId={selectedTrackId} />

      <RequestUsageDialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen} track={selectedTrack} />
    </div>
  )
}
