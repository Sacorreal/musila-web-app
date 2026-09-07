"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/UI/avatar";
import { AuthorsResponseDto } from "@/src/domains/artists/types/artist.types";
import { TracksResponseDto } from "@/src/domains/tracks/types/track.types";

type HydratedAuthor = Pick<AuthorsResponseDto, "id" | "name" | "lastName" | "avatar">;

interface GenreFeaturedAuthorsProps {
  tracks?: TracksResponseDto[];
}

function extractUniqueAuthors(tracks?: TracksResponseDto[]): HydratedAuthor[] {
  const authorsMap = new Map<string, HydratedAuthor>();

  tracks?.forEach((track) => {
    const authors = track.authors as unknown;
    if (Array.isArray(authors) && typeof authors[0] === "object") {
      (authors as HydratedAuthor[]).forEach((author) => {
        authorsMap.set(author.id, author);
      });
    }
  });

  return Array.from(authorsMap.values());
}

export function GenreFeaturedAuthors({ tracks }: GenreFeaturedAuthorsProps) {
  const uniqueAuthors = useMemo(() => extractUniqueAuthors(tracks), [tracks]);

  if (uniqueAuthors.length === 0) {
    return null;
  }

  return (
    <section className="space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
          Autores Destacados
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
        {uniqueAuthors.slice(0, 6).map((author) => (
          <Link
            key={author.id}
            href={`/music/artista/${author.id}`}
            className="flex flex-col items-center gap-5 group cursor-pointer"
          >
            <div className="relative p-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500 shadow-xl">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shadow-inner">
                <AvatarImage
                  src={author.avatar ?? undefined}
                  alt={`${author.name} ${author.lastName || ""}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-muted-foreground font-black text-xl">
                  {author.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
            <span className="text-sm font-black text-foreground text-center group-hover:text-primary transition-colors uppercase tracking-tight">
              {author.name} {author.lastName || ""}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
