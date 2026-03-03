"use client"

import { TrackListItem } from "@/src/components/app/track-list-item"
import { usePlayer } from "@/src/domains/player/player.context"
import { playlistsService } from "@/src/domains/playlists/playlists.service"
import { MoreIcon, PlayIcon, PlaylistIcon } from "@/src/shared/components/Icons/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/UI/alert-dialog"
import { Button } from "@/src/shared/components/UI/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/shared/components/UI/dropdown-menu"
import type { Playlist, Track } from "@/src/shared/types/shared.types"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function PlaylistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const playlistId = params.id as string

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { currentTrack, isPlaying, play, pause, resume, setQueue } = usePlayer()

  useEffect(() => {
    async function loadPlaylist() {
      setIsLoading(true)
      const { data } = await playlistsService.getById(playlistId)
      if (data) setPlaylist(data)
      setIsLoading(false)
    }

    loadPlaylist()
  }, [playlistId])

  const handlePlayAll = () => {
    if (!playlist?.tracks?.length) return
    play(playlist.tracks[0])
    setQueue(playlist.tracks.slice(1))
  }

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      isPlaying ? pause() : resume()
    } else {
      play(track)
    }
  }

  const handleDeletePlaylist = async () => {
    const { error } = await playlistsService.delete(playlistId)
    if (error) {
      toast.error("Error al eliminar la playlist")
    } else {
      toast.success("Playlist eliminada")
      router.push("/app/playlists")
    }
  }

  const handleRemoveTrack = async (trackId: string) => {
    const { error } = await playlistsService.removeTrack(playlistId, trackId)
    if (error) {
      toast.error("Error al eliminar la canción")
    } else {
      toast.success("Canción eliminada de la playlist")
      setPlaylist((prev) => (prev ? { ...prev, tracks: prev.tracks.filter((t) => t.id !== trackId) } : null))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Playlist no encontrada</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl || "/placeholder.svg"}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <PlaylistIcon className="h-24 w-24 text-primary/50" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-primary font-medium">Playlist</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{playlist.name}</h1>
            {playlist.description && <p className="text-muted-foreground mt-2">{playlist.description}</p>}
          </div>

          <p className="text-sm text-muted-foreground">{playlist.tracks?.length || 0} canciones</p>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button size="lg" onClick={handlePlayAll} disabled={!playlist.tracks?.length}>
              <PlayIcon className="mr-2 h-5 w-5" />
              Reproducir todo
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                  <MoreIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar playlist
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {playlist.tracks?.length > 0 ? (
          playlist.tracks.map((track, index) => (
            <TrackListItem
              key={track.id}
              track={track}
              index={index + 1}
              isPlaying={currentTrack?.id === track.id && isPlaying}
              onPlay={() => handlePlayTrack(track)}
              onRemove={() => handleRemoveTrack(track.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">Esta playlist está vacía</p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la playlist "{playlist.name}" permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlaylist} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
