"use client";

import React, { use, useState, useMemo } from "react";
import { useGenreBySlug } from "@/src/domains/musical-genre/hooks/use-genres.hooks";
import { PlayAllButton } from "@/src/domains/player/components/PlayAllButton";
import { GenreDetailSkeleton } from "@/src/domains/musical-genre/components/GenreDetailSkeleton";
import { GenreNotFound } from "@/src/domains/musical-genre/components/GenreNotFound";
import { GenreFilters } from "@/src/domains/musical-genre/components/GenreFilters";
import { GenreTracksTable } from "@/src/domains/musical-genre/components/GenreTracksTable";
import { GenreFeaturedAuthors } from "@/src/domains/musical-genre/components/GenreFeaturedAuthors";

export default function GenreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: genre, isLoading, isError } = useGenreBySlug(slug);

  const [isGospelFilter, setIsGospelFilter] = useState(false);
  const [subGenreFilter, setSubGenreFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");

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

  const uniqueMoods = useMemo(() => {
    if (!genre?.tracks) return [];
    const moods = genre.tracks.flatMap((t) => t.moods ?? []);
    const byId = new Map(moods.map((m) => [m.id, m]));
    return Array.from(byId.values());
  }, [genre]);

  const uniqueThemes = useMemo(() => {
    if (!genre?.tracks) return [];
    const themes = genre.tracks.map((t) => t.theme).filter((t): t is NonNullable<typeof t> => Boolean(t));
    const byId = new Map(themes.map((t) => [t.id, t]));
    return Array.from(byId.values());
  }, [genre]);

  const filteredTracks = useMemo(() => {
    if (!genre?.tracks) return [];
    return genre.tracks.filter((track) => {
      if (isGospelFilter && !track.isGospel) return false;
      if (subGenreFilter !== "all" && track.subGenre !== subGenreFilter)
        return false;
      if (languageFilter !== "all" && track.language !== languageFilter)
        return false;
      if (moodFilter !== "all" && !track.moods?.some((m) => m.id === moodFilter))
        return false;
      if (themeFilter !== "all" && track.theme?.id !== themeFilter)
        return false;
      return true;
    });
  }, [genre, isGospelFilter, subGenreFilter, languageFilter, moodFilter, themeFilter]);

  if (isLoading) {
    return <GenreDetailSkeleton />;
  }

  if (isError || !genre) {
    return <GenreNotFound />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12 text-foreground">
      <div className="space-y-6 pt-8">
        <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase">
          {genre.genre}
        </h1>

        <GenreFilters
          isGospelFilter={isGospelFilter}
          onGospelFilterChange={setIsGospelFilter}
          subGenreFilter={subGenreFilter}
          onSubGenreFilterChange={setSubGenreFilter}
          languageFilter={languageFilter}
          onLanguageFilterChange={setLanguageFilter}
          uniqueSubGenres={uniqueSubGenres as string[]}
          uniqueLanguages={uniqueLanguages as string[]}
          moodFilter={moodFilter}
          onMoodFilterChange={setMoodFilter}
          uniqueMoods={uniqueMoods}
          themeFilter={themeFilter}
          onThemeFilterChange={setThemeFilter}
          uniqueThemes={uniqueThemes}
        />

        <PlayAllButton tracks={filteredTracks} />
      </div>

      <GenreTracksTable
        tracks={filteredTracks}
        genreName={genre.genre}
        genreSlug={genre.slug}
      />

      <GenreFeaturedAuthors tracks={genre.tracks} />
    </div>
  );
}
