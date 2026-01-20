"use client"

import { CreatePlaylistDialog } from "@/src/components/app/create-playlist-dialog"
import { PlaylistCard } from "@/src/components/app/playlist-card"
import { playlistsService } from "@/src/domains/playlists/playlists.service"
import type { Playlist } from "@/src/lib/types"
import { PlusIcon } from "@/src/shared/components/icons"
import { Button } from "@/src/shared/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const loadPlaylists = async () => {
    setIsLoading(true)
    const { data } = await playlistsService.getAll()
    if (data) setPlaylists(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const handlePlaylistCreated = () => {
    loadPlaylists()
    setCreateDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Mis playlists</h1>
          <p className="text-muted-foreground">Organiza tus canciones favoritas</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <PlaylistIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tienes playlists</h3>
          <p className="text-muted-foreground mb-4">Crea tu primera playlist para organizar tus canciones favoritas</p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Crear playlist
          </Button>
        </div>
      )}

      <CreatePlaylistDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handlePlaylistCreated}
      />
    </div>
  )
}

function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
    </svg>
  )
}
