"use client"

import type { Track } from "@/src/lib/types"
import { MoreIcon, MusicNoteIcon, PauseIcon, PlayIcon } from "@/src/shared/components/icons"
import { Button } from "@/src/shared/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/shared/ui/dropdown-menu"
import { Trash2 } from "lucide-react"
import Link from "next/link"

interface TrackListItemProps {
  track: Track
  index: number
  isPlaying?: boolean
  onPlay: () => void
  onRemove?: () => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function TrackListItem({ track, index, isPlaying, onPlay, onRemove }: TrackListItemProps) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-card transition-colors">
      <div className="w-8 text-center">
        <span className="text-sm text-muted-foreground group-hover:hidden">{index}</span>
        <button onClick={onPlay} className="hidden group-hover:block text-foreground">
          {isPlaying ? <PauseIcon className="h-4 w-4 mx-auto" /> : <PlayIcon className="h-4 w-4 mx-auto" />}
        </button>
      </div>

      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {track.coverUrl ? (
          <img src={track.coverUrl || "/placeholder.svg"} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <MusicNoteIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/app/track/${track.id}`} className="hover:underline">
          <p className="font-medium text-foreground truncate">{track.title}</p>
        </Link>
        <Link href={`/app/artist/${track.authorId}`} className="hover:underline">
          <p className="text-sm text-muted-foreground truncate">{track.author?.artisticName || track.author?.name}</p>
        </Link>
      </div>

      <span className="text-sm text-muted-foreground hidden sm:block">{track.genre?.name}</span>

      <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>

      {onRemove && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar de playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
