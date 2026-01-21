"use client"

import { playlistsService } from "@/src/domains/playlists/playlists.service"
import { PlaylistIcon, PlusIcon } from "@/src/shared/components/Icons/icons"
import { Button } from "@/src/shared/components/UI/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog"
import type { Playlist } from "@/src/shared/types/shared.types"
import { Check, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CreatePlaylistDialog } from "./create-playlist-dialog"

interface AddToPlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackId: string | null
}

export function AddToPlaylistDialog({ open, onOpenChange, trackId }: AddToPlaylistDialogProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (open) {
      loadPlaylists()
    }
  }, [open])

  const loadPlaylists = async () => {
    setIsLoading(true)
    const { data } = await playlistsService.getAll()
    if (data) setPlaylists(data)
    setIsLoading(false)
  }

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!trackId) return
    setAddingTo(playlistId)

    const { error } = await playlistsService.addTrack(playlistId, trackId)

    if (error) {
      toast.error("Error al agregar a la playlist")
    } else {
      toast.success("Canción agregada a la playlist")
      onOpenChange(false)
    }

    setAddingTo(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar a playlist</DialogTitle>
            <DialogDescription>Selecciona una playlist para agregar esta canción</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={addingTo !== null}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-card transition-colors text-left disabled:opacity-50"
                >
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                    {playlist.coverUrl ? (
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <PlaylistIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{playlist.name}</p>
                    <p className="text-sm text-muted-foreground">{playlist.tracks?.length || 0} canciones</p>
                  </div>
                  {addingTo === playlist.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Check className="h-4 w-4 text-transparent group-hover:text-muted-foreground" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tienes playlists</p>
              </div>
            )}
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setCreateDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Crear nueva playlist
          </Button>
        </DialogContent>
      </Dialog>

      <CreatePlaylistDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          setCreateDialogOpen(false)
          loadPlaylists()
        }}
      />
    </>
  )
}
