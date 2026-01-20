import type { User } from "@/lib/types"
import Link from "next/link"
import { UserIcon } from "@/components/icons"

interface ArtistCardProps {
  artist: User
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/app/artist/${artist.id}`}
      className="group flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
    >
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-primary transition-all">
        {artist.avatar ? (
          <img
            src={artist.avatar || "/placeholder.svg"}
            alt={artist.artisticName || artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm font-medium text-foreground text-center truncate w-full">
        {artist.artisticName || artist.name}
      </p>
      <p className="text-xs text-muted-foreground">{artist.role === "COMPOSER" ? "Compositor" : "Intérprete"}</p>
    </Link>
  )
}
