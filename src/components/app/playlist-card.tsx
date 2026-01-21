import { PlaylistIcon } from "@/src/shared/components/Icons/icons"
import type { Playlist } from "@/src/shared/types/shared.types"
import Link from "next/link"

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/app/playlists/${playlist.id}`}
      className="group bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-all"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl || "/placeholder.svg"}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <PlaylistIcon className="h-12 w-12 text-primary/50" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-foreground truncate">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground">{playlist.tracks?.length || 0} canciones</p>
    </Link>
  )
}
