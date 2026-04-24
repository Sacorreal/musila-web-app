"use client";

import React from "react";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { AuthorTrackDetailDto } from "@/src/domains/artists/types/artist.types";
import { ArtistNoTracks } from "./ArtistNoTracks";
import { Button } from "@/src/shared/components/UI/button";
import { Play, MoreHorizontal } from "lucide-react";
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
}

export function ArtistTracksList({ tracks }: ArtistTracksListProps) {
  // Filter out plain string IDs — keep only populated track objects
  const populatedTracks = (
    tracks as Array<TrackResponse | AuthorTrackDetailDto | string>
  ).filter((t): t is TrackResponse => typeof t === "object" && t !== null);

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
        <Button className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-0 flex items-center justify-center align-middle shadow-lg border-0 shrink-0">
          <Play
            className="w-6 h-6 text-foreground dark:text-slate-300 ml-1"
            fill="currentColor"
          />
        </Button>

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
              className="group flex flex-col sm:flex-row items-start sm:items-center py-2 px-3 hover:bg-accent/5 rounded-lg transition-colors gap-4 sm:gap-6 w-full cursor-pointer"
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
                <span className="text-emerald-500 min-w-[3rem]">{"3:12"}</span>
                <span className="min-w-[6rem] hidden md:block truncate opacity-80 italic">
                  {resolveGenreName(track.genre) || "—"}
                </span>
                <span className="min-w-[9rem] hidden md:block truncate">
                  {track.subGenre || "—"}
                </span>
              </div>

              <button className="text-muted-foreground hover:text-foreground p-2 self-end sm:self-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
