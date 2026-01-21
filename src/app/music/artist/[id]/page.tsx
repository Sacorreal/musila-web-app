"use client"

import { AddToPlaylistDialog } from "@/src/components/app/add-to-playlist-dialog"
import { RequestUsageDialog } from "@/src/components/app/request-usage-dialog"
import { TrackCard } from "@/src/components/app/track-card"
import { tracksService } from "@/src/domains/tracks/services/tracks.service"
import { usersService } from "@/src/domains/users/users.service"
import { UserIcon } from "@/src/shared/components/Icons/icons"
import type { Track, User } from "@/src/shared/types/shared.types"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ArtistPage() {
  const params = useParams()
  const artistId = params.id as string

  const [artist, setArtist] = useState<User | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      const [artistRes, tracksRes] = await Promise.all([usersService.getAuthorById(artistId), tracksService.getAll()])

      if (artistRes.data) setArtist(artistRes.data)
      if (tracksRes.data) {
        setTracks(tracksRes.data.filter((t) => t.authorId === artistId))
      }

      setIsLoading(false)
    }

    loadData()
  }, [artistId])

  const handleAddToPlaylist = (trackId: string) => {
    setSelectedTrackId(trackId)
    setPlaylistDialogOpen(true)
  }

  const handleRequestUsage = (track: Track) => {
    setSelectedTrack(track)
    setRequestDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Artista no encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-b from-primary/10 to-transparent p-8 rounded-2xl">
        <div className="h-40 w-40 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
          {artist.avatar ? (
            <img src={artist.avatar || "/placeholder.svg"} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="h-20 w-20 text-muted-foreground" />
          )}
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm text-primary font-medium mb-1">
            {artist.role === "COMPOSER" ? "Compositor" : "Intérprete"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{artist.artisticName || artist.name}</h1>
          {artist.bio && <p className="text-muted-foreground max-w-lg">{artist.bio}</p>}
          <p className="text-sm text-muted-foreground mt-2">{tracks.length} canciones</p>
        </div>
      </div>

      {tracks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Canciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onAddToPlaylist={handleAddToPlaylist}
                onRequestUsage={handleRequestUsage}
              />
            ))}
          </div>
        </section>
      )}

      <AddToPlaylistDialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen} trackId={selectedTrackId} />

      <RequestUsageDialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen} track={selectedTrack} />
    </div>
  )
}
