"use client";

import { Music2, Play } from "lucide-react";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { usePlayerStore } from "@/src/domains/player/store/use-player-store";
import { Button } from "@/src/shared/components/UI/button";

interface PlaylistTrackListProps {
  tracks: TrackResponse[];
}

export function PlaylistTrackList({ tracks }: PlaylistTrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 text-center rounded-2xl border border-dashed border-border">
        <Music2 className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Esta playlist aún no tiene pistas.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tracks.map((track, index) => (
        <li
          key={track.id}
          className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-colors group"
        >
          <span className="w-6 text-center text-sm text-muted-foreground">{index + 1}</span>
          <img
            src={track.coverUrl || "/cover-default.png"}
            alt={`Portada de ${track.title}`}
            className="w-12 h-12 rounded-md object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {track.authors?.map((author) => author.name).join(", ")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => usePlayerStore.getState().play(track)}
            aria-label={`Reproducir ${track.title}`}
          >
            <Play className="w-4 h-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
