"use client"

import { usePlayer } from "@/src/domains/player/player.context"
import type { Track } from "@/src/lib/types"
import { HeartIcon, MoreIcon, MusicNoteIcon, PauseIcon, PlayIcon, PlusIcon, RequestIcon } from "@/src/shared/components/icons"
import { Button } from "@/src/shared/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/shared/ui/dropdown-menu"
import Link from "next/link"

interface TrackCardProps {
  track: Track
  onAddToPlaylist?: (trackId: string) => void
  onRequestUsage?: (track: Track) => void
}

export function TrackCard({ track, onAddToPlaylist, onRequestUsage }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause, resume } = usePlayer()
  const isCurrentTrack = currentTrack?.id === track.id

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      isPlaying ? pause() : resume()
    } else {
      play(track)
    }
  }

  return (
    <div className="group relative bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
        {track.coverUrl ? (
          <img
            src={track.coverUrl || "/placeholder.svg"}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicNoteIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={handlePlayClick}
        >
          {isCurrentTrack && isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="space-y-1">
        <Link href={`/app/track/${track.id}`} className="block">
          <h3 className="font-semibold text-foreground truncate hover:underline">{track.title}</h3>
        </Link>
        <Link href={`/app/artist/${track.authorId}`} className="block">
          <p className="text-sm text-muted-foreground truncate hover:underline">
            {track.author?.artisticName || track.author?.name}
          </p>
        </Link>
        {track.genre && <p className="text-xs text-primary">{track.genre.name}</p>}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onAddToPlaylist?.(track.id)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Agregar a playlist
          </DropdownMenuItem>
          {track.allowRequests && (
            <DropdownMenuItem onClick={() => onRequestUsage?.(track)}>
              <RequestIcon className="mr-2 h-4 w-4" />
              Solicitar uso
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <HeartIcon className="mr-2 h-4 w-4" />
            Me gusta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
