"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { AuthorTrackDetailDto } from "@/src/domains/artists/types/artist.types";
import { ArtistNoTracks } from "./ArtistNoTracks";
import { Button } from "@/src/shared/components/UI/button";
import { Play, FileText } from "lucide-react";
import { PlaylistIcon } from "@/src/shared/components/Icons/icons";
import { AddToPlaylistModal } from "@/src/domains/playlists/components/AddToPlaylistModal";
import { RequestTrackModal } from "@/src/domains/requests/components/RequestTrackModal";
import { usePlayerStore } from "@/src/domains/player/store/use-player-store";
import { PlayAllButton } from "@/src/domains/player/components/PlayAllButton";
import { TrackDuration } from "@/src/shared/components/UI/TrackDuration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";
import {
  useArtistTracksFilter,
  resolveGenreName,
} from "../hooks/use-artist-tracks-filter.hook";

interface ArtistTracksListProps {
  tracks: TrackResponse[] | AuthorTrackDetailDto[] | string[];
  artistId: string;
  artistName: string;
  artistLastName?: string;
}

export function ArtistTracksList({ tracks, artistId, artistName, artistLastName }: ArtistTracksListProps) {
  // Filter out plain string IDs and inject artist data
  const populatedTracks = (
    tracks as Array<TrackResponse | AuthorTrackDetailDto | string>
  )
    .filter((t): t is TrackResponse => typeof t === "object" && t !== null)
    .map((t) => ({
      ...t,
      authors: t.authors?.length ? t.authors : [{
        id: artistId,
        name: artistName,
        lastName: artistLastName || "",
      }]
    } as unknown as TrackResponse));

  const router = useRouter();

  const {
    filteredTracks,
    genreOptions,
    subGenreOptions,
    selectedGenre,
    selectedSubGenre,
    handleGenreChange,
    handleSubGenreChange,
  } = useArtistTracksFilter(populatedTracks);

  return (
    <div className="mt-10 px-2 pb-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Canciones</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PlayAllButton tracks={filteredTracks} iconOnly />

        <div className="flex gap-3">
          {/* Genre select — populated from track.genre string */}
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-[150px] bg-slate-100 dark:bg-slate-800 border-none text-foreground dark:text-slate-300 rounded-full h-10 px-4 shadow-sm hover:bg-slate-200 dark:hover:!bg-slate-700 cursor-pointer ring-0 focus:ring-0">
              <SelectValue>
                {selectedGenre === "all" ? "Género" : selectedGenre}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background border-border text-foreground">
              <SelectItem value="all">Todos los géneros</SelectItem>
              {genreOptions.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* SubGenre select — populated from track.subGenre string, filtered by selected genre */}
          <Select value={selectedSubGenre} onValueChange={handleSubGenreChange}>
            <SelectTrigger className="w-[170px] bg-slate-100 dark:bg-slate-800 border-none text-foreground dark:text-slate-300 rounded-full h-10 px-4 shadow-sm hover:bg-slate-200 dark:hover:!bg-slate-700 cursor-pointer ring-0 focus:ring-0">
              <SelectValue>
                {selectedSubGenre === "all" ? "Subgénero" : selectedSubGenre}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background border-border text-foreground">
              <SelectItem value="all">Todos los subgéneros</SelectItem>
              {subGenreOptions.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tracks List */}
      <div className="flex flex-col gap-2">
        {populatedTracks.length === 0 ? (
          <ArtistNoTracks />
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400">
              No hay canciones que coincidan con los filtros aplicados.
            </p>
            <Button
              variant="link"
              className="text-emerald-500 mt-2"
              onClick={() => handleGenreChange("all")}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          filteredTracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => {
                usePlayerStore.getState().setQueue(filteredTracks.slice(index + 1) as unknown as TrackResponse[]);
                usePlayerStore.getState().play(track as unknown as TrackResponse);
                router.push(`/music/tracks/${track.id}`);
              }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl relative overflow-hidden"
            >
              <span className="text-muted-foreground font-medium w-4 shrink-0 text-center">
                {index + 1}
              </span>

              <div className="flex items-center gap-4 flex-1 min-w-0">
                {track.coverUrl ? (
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover shadow-sm bg-slate-200 dark:bg-slate-800"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-muted-foreground text-xs">🎵</span>
                  </div>
                )}
                <span className="text-foreground font-semibold truncate hover:underline">
                  {track.title}
                </span>
              </div>

              <div className="flex items-center gap-4 sm:gap-10 ml-10 sm:ml-0 text-sm text-muted-foreground font-medium whitespace-nowrap overflow-hidden">
                <TrackDuration 
                  audioUrl={(track as any).audioUrl} 
                  className="text-emerald-500 min-w-[3rem]" 
                />
                <span className="min-w-[6rem] hidden md:block truncate opacity-80 italic">
                  {resolveGenreName(track.genre) || "—"}
                </span>
                <span className="min-w-[9rem] hidden md:block truncate">
                  {track.subGenre || "—"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                <AddToPlaylistModal trackId={track.id} trackTitle={track.title}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-primary hover:bg-primary/10 rounded-full"
                    title="Agregar a Playlist"
                  >
                    <PlaylistIcon className="w-5 h-5" />
                  </Button>
                </AddToPlaylistModal>
                
                <RequestTrackModal 
                  trackId={track.id} 
                  genreSlug={typeof track.genre === 'object' ? (track.genre as any).slug : undefined}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full"
                    title="Solicitar Uso"
                  >
                    <FileText size={20} />
                  </Button>
                </RequestTrackModal>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
