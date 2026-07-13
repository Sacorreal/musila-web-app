import React from "react";
import { useRouter } from "next/navigation";
import { Play, X, FileText } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { PlaylistIcon } from "@/src/shared/components/Icons/icons";
import { RequestTrackModal } from "@/src/domains/requests/components/RequestTrackModal";
import { AddToPlaylistModal } from "@/src/domains/playlists/components/AddToPlaylistModal";
import { TrackDuration } from "@/src/shared/components/UI/TrackDuration";
import { usePlayerStore } from "@/src/domains/player/store/use-player-store";
import { TrackResponse, TracksResponseDto } from "@/src/domains/tracks/types/track.types";
import { GenrePagination } from "@/src/domains/musical-genre/components/GenrePagination";

interface GenreTracksTableProps {
  tracks: TracksResponseDto[];
  genreName: string;
  genreSlug: string;
}

export function GenreTracksTable({ tracks, genreName, genreSlug }: GenreTracksTableProps) {
  const router = useRouter();

  return (
    <div className="bg-card dark:bg-slate-900/20 rounded-[2.5rem] overflow-hidden border border-slate-300 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] border-b border-slate-300 dark:border-white/5">
              <th className="px-8 py-6 w-16 text-center">#</th>
              <th className="px-8 py-6">Track</th>
              <th className="px-8 py-6">Duración</th>
              <th className="px-8 py-6">Autor</th>
              <th className="px-8 py-6">Género</th>
              <th className="px-8 py-6">Subgénero</th>
              <th className="px-8 py-6 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {tracks.map((track, index) => (
              <tr
                key={track.id}
                onClick={() => {
                  usePlayerStore.getState().setQueue(tracks.slice(index + 1) as unknown as TrackResponse[]);
                  usePlayerStore.getState().play(track as unknown as TrackResponse);
                  router.push(`/music/tracks/${track.id}`);
                }}
                className="group hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
              >
                <td className="px-8 py-5 text-center text-muted-foreground font-black text-sm">
                  {index + 1}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative shadow-lg group-hover:scale-105 transition-transform duration-500">
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-900">
                          <Play size={20} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-base text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {track.title}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-emerald-500 text-sm font-black text-center whitespace-nowrap">
                  <TrackDuration audioUrl={(track as any).audioUrl} />
                </td>
                <td className="px-8 py-5 text-muted-foreground text-sm font-semibold">
                  {Array.isArray(track.authors) && typeof track.authors[0] === "object"
                    ? (track.authors as any[]).map((a) => `${a.name} ${a.lastName || ""}`).join(", ")
                    : "Varios Artistas"}
                </td>
                <td className="px-8 py-5 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-80">
                  {genreName}
                </td>
                <td className="px-8 py-5 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-80">
                  {track.subGenre || "-"}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

                    <RequestTrackModal trackId={track.id} genreSlug={genreSlug}>
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
                </td>
              </tr>
            ))}
            {tracks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <X className="text-muted-foreground" size={32} />
                    </div>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                      No hay pistas disponibles
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tracks.length > 0 && <GenrePagination />}
    </div>
  );
}
