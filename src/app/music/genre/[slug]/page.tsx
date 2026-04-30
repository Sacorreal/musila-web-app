"use client";

import React, { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGenreBySlug } from "@/src/domains/musical-genre/hooks/use-genres.hooks";
import { Button } from "@/src/shared/components/UI/button";
import { Badge } from "@/src/shared/components/UI/badge";
import { Switch } from "@/src/shared/components/UI/switch";
import {
  Play,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import { PlaylistIcon } from "@/src/shared/components/Icons/icons";
import { RequestTrackModal } from "@/src/domains/requests/components/RequestTrackModal";
import { AddToPlaylistModal } from "@/src/domains/playlists/components/AddToPlaylistModal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/UI/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";
import Link from "next/link";
import { usePlayerStore } from "@/src/domains/player/store/use-player-store";
import { PlayAllButton } from "@/src/domains/player/components/PlayAllButton";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { TrackDuration } from "@/src/shared/components/UI/TrackDuration";
import { BackButton } from "@/src/shared/components/UI/BackButton";

const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  it: "Italiano",
  pt: "Portugués",
  de: "Alemán",
  ja: "Japonés",
  zh: "Chino",
};

export default function GenreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: genre, isLoading, isError } = useGenreBySlug(slug);

  const [isGospelFilter, setIsGospelFilter] = useState(false);
  const [subGenreFilter, setSubGenreFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  const uniqueSubGenres = useMemo(() => {
    if (!genre?.tracks) return [];
    const subgenres = genre.tracks.map((t) => t.subGenre).filter(Boolean);
    return Array.from(new Set(subgenres));
  }, [genre]);

  const uniqueLanguages = useMemo(() => {
    if (!genre?.tracks) return [];
    const languages = genre.tracks.map((t) => t.language).filter(Boolean);
    return Array.from(new Set(languages));
  }, [genre]);

  const filteredTracks = useMemo(() => {
    if (!genre?.tracks) return [];
    return genre.tracks.filter((track) => {
      if (isGospelFilter && !track.isGospel) return false;
      if (subGenreFilter !== "all" && track.subGenre !== subGenreFilter)
        return false;
      if (languageFilter !== "all" && track.language !== languageFilter)
        return false;
      return true;
    });
  }, [genre, isGospelFilter, subGenreFilter, languageFilter]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-800 rounded mb-8" />
        <div className="h-10 w-full bg-slate-800 rounded mb-12" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-slate-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !genre) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Género no encontrado
        </h1>
        <BackButton 
          label="Volver a la música"
          className="text-primary hover:underline mt-4 inline-flex" 
        />
      </div>
    );
  }

  // Extract unique authors from tracks
  const authorsMap = new Map();
  genre.tracks?.forEach((track) => {
    // If authors are hydrated (objects)
    if (track.authors && typeof track.authors[0] === "object") {
      (track.authors as any[]).forEach((author) => {
        authorsMap.set(author.id, author);
      });
    }
  });

  const uniqueAuthors = Array.from(authorsMap.values());

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12 text-foreground">
      {/* Header & Filters */}
      <div className="space-y-6 pt-8">
        <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase">
          {genre.genre}
        </h1>

        <div className="flex flex-wrap items-center gap-4 py-2">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-300 dark:border-white/5 shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Gospel
            </span>
            <Switch
              checked={isGospelFilter}
              onCheckedChange={setIsGospelFilter}
            />
          </div>

          <Select value={subGenreFilter} onValueChange={setSubGenreFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-background text-foreground border border-input font-bold rounded-xl shadow-sm hover:bg-accent focus:ring-0">
              <SelectValue placeholder="Subgénero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Subgéneros</SelectItem>
              {uniqueSubGenres.map((sg) => (
                <SelectItem key={sg as string} value={sg as string}>
                  {sg as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-background text-foreground border border-input font-bold rounded-xl shadow-sm hover:bg-accent focus:ring-0">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Idioma</SelectItem>
              {uniqueLanguages.map((lang) => (
                <SelectItem key={lang as string} value={lang as string}>
                  {LANGUAGE_LABELS[(lang as string).toLowerCase()] ||
                    (lang as string).toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(isGospelFilter ||
            subGenreFilter !== "all" ||
            languageFilter !== "all") && (
              <Button
                variant="ghost"
                className="h-10 text-primary hover:text-primary/80 hover:bg-primary/5 flex items-center gap-2 px-4 rounded-xl font-bold transition-all"
                onClick={() => {
                  setIsGospelFilter(false);
                  setSubGenreFilter("all");
                  setLanguageFilter("all");
                }}
              >
                Eliminar filtros <X size={16} />
              </Button>
            )}
        </div>

        <PlayAllButton tracks={filteredTracks} />
      </div>

      {/* Tracks Table */}
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
              {filteredTracks.map((track, index) => (
                <tr
                  key={track.id}
                  onClick={() => {
                    usePlayerStore.getState().setQueue(filteredTracks.slice(index + 1) as unknown as TrackResponse[]);
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
                    {Array.isArray(track.authors) &&
                      typeof track.authors[0] === "object"
                      ? (track.authors as any[])
                        .map((a) => `${a.name} ${a.lastName || ""}`)
                        .join(", ")
                      : "Varios Artistas"}
                  </td>
                  <td className="px-8 py-5 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-80">
                    {genre.genre}
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
                      
                      <RequestTrackModal trackId={track.id} genreSlug={genre.slug}>
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
              {filteredTracks.length === 0 && (
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

        {/* Pagination */}
        {filteredTracks.length > 0 && (
          <div className="p-8 flex items-center justify-center gap-3 border-t border-white/5">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-slate-500 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button className="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-xs p-0 shadow-lg shadow-blue-500/20">
              1
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full text-slate-500 font-black text-xs p-0 hover:text-white hover:bg-white/10"
            >
              2
            </Button>
            <Button
              variant="ghost"
              className="w-10 h-10 rounded-full text-slate-500 font-black text-xs p-0 hover:text-white hover:bg-white/10"
            >
              3
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full text-slate-500 hover:text-white hover:bg-white/10"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>

      {/* Featured Authors */}
      <section className="space-y-10 pb-20">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
            Autores Destacados
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {(uniqueAuthors.length > 0
            ? uniqueAuthors.slice(0, 6)
            : [
              {
                name: "Nathaniel Hayes",
                img: "https://i.pravatar.cc/150?u=1",
              },
              { name: "Jonathan Reed", img: "https://i.pravatar.cc/150?u=2" },
              {
                name: "Isabella Foster",
                img: "https://i.pravatar.cc/150?u=3",
              },
              {
                name: "Charles Bennett",
                img: "https://i.pravatar.cc/150?u=4",
              },
              { name: "Amelia Carter", img: "https://i.pravatar.cc/150?u=5" },
              {
                name: "Theodore Morgan",
                img: "https://i.pravatar.cc/150?u=6",
              },
            ]
          ).map((author, i) => (
            <Link
              key={i}
              href={`/music/artista/${author.id || i}`}
              className="flex flex-col items-center gap-5 group cursor-pointer"
            >
              <div className="relative p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500 shadow-xl">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shadow-inner">
                  <AvatarImage
                    src={(author as any).avatar || (author as any).img}
                    alt={author.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-muted-foreground font-black text-xl">
                    {author.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
              <span className="text-sm font-black text-foreground text-center group-hover:text-primary transition-colors uppercase tracking-tight">
                {author.name} {(author as any).lastName || ""}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
