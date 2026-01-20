"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { tracksService } from "@/domains/tracks/tracks.service"
import { usePlayer } from "@/domains/player/player.context"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { PlayIcon, PauseIcon, MusicNoteIcon, PlusIcon, HeartIcon, RequestIcon } from "@/components/icons"
import { Loader2, Clock, Music } from "lucide-react"
import Link from "next/link"
import { AddToPlaylistDialog } from "@/components/app/add-to-playlist-dialog"
import { RequestUsageDialog } from "@/components/app/request-usage-dialog"

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function TrackDetailPage() {
  const params = useParams()
  const trackId = params.id as string

  const [track, setTrack] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { currentTrack, isPlaying, play, pause, resume } = usePlayer()

  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  const isCurrentTrack = currentTrack?.id === track?.id

  useEffect(() => {
    async function loadTrack() {
      setIsLoading(true)
      const { data } = await tracksService.getById(trackId)
      if (data) setTrack(data)
      setIsLoading(false)
    }

    loadTrack()
  }, [trackId])

  const handlePlayClick = () => {
    if (!track) return
    if (isCurrentTrack) {
      isPlaying ? pause() : resume()
    } else {
      play(track)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!track) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Canción no encontrada</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-80 shrink-0">
          <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
            {track.coverUrl ? (
              <img
                src={track.coverUrl || "/placeholder.svg"}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MusicNoteIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-primary font-medium">Canción</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{track.title}</h1>
            <Link href={`/app/artist/${track.authorId}`} className="text-lg text-muted-foreground hover:underline">
              {track.author?.artisticName || track.author?.name}
            </Link>
          </div>

          {track.description && <p className="text-muted-foreground">{track.description}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {track.genre && (
              <span className="inline-flex items-center gap-1">
                <Music className="h-4 w-4" />
                {track.genre.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(track.duration)}
            </span>
            {track.bpm && <span>{track.bpm} BPM</span>}
            {track.key && <span>Tonalidad: {track.key}</span>}
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button size="lg" onClick={handlePlayClick}>
              {isCurrentTrack && isPlaying ? (
                <>
                  <PauseIcon className="mr-2 h-5 w-5" />
                  Pausar
                </>
              ) : (
                <>
                  <PlayIcon className="mr-2 h-5 w-5" />
                  Reproducir
                </>
              )}
            </Button>

            <Button variant="outline" size="lg" onClick={() => setPlaylistDialogOpen(true)}>
              <PlusIcon className="mr-2 h-5 w-5" />
              Agregar a playlist
            </Button>

            {track.allowRequests && (
              <Button variant="outline" size="lg" onClick={() => setRequestDialogOpen(true)}>
                <RequestIcon className="mr-2 h-5 w-5" />
                Solicitar uso
              </Button>
            )}

            <Button variant="ghost" size="icon" className="h-11 w-11">
              <HeartIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AddToPlaylistDialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen} trackId={track.id} />

      <RequestUsageDialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen} track={track} />
    </div>
  )
}
