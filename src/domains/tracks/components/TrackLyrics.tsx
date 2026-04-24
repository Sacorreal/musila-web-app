import React from 'react';
import { ScrollText } from 'lucide-react';

interface TrackLyricsProps {
  lyric?: string;
}

export function TrackLyrics({ lyric }: TrackLyricsProps) {
  if (!lyric) {
    return (
      <div className="mt-10 rounded-2xl bg-card border border-border p-8 text-center">
        <ScrollText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground text-sm">La letra de esta canción no está disponible.</p>
      </div>
    );
  }

  return (
    <section className="mt-10" aria-label="Letra de la canción">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <ScrollText className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-bold text-foreground tracking-tight">Letra</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Lyrics card */}
      <div className="relative rounded-2xl bg-card/50 border border-border overflow-hidden shadow-none">
        {/* Gradient top separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="max-h-[520px] overflow-y-auto px-6 sm:px-10 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full">
          <p className="whitespace-pre-wrap text-foreground leading-8 text-[15px] font-medium tracking-wide">
            {lyric}
          </p>
        </div>

        {/* Gradient bottom fade - Adjusted for theme */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
