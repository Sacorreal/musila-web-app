import React from 'react';
import { ScrollText } from 'lucide-react';

interface TrackLyricsProps {
  lyric?: string;
}

export function TrackLyrics({ lyric }: TrackLyricsProps) {
  if (!lyric) {
    return (
      <div className="mt-10 rounded-2xl bg-white/5 border border-white/8 p-8 text-center">
        <ScrollText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">La letra de esta canción no está disponible.</p>
      </div>
    );
  }

  return (
    <section className="mt-10" aria-label="Letra de la canción">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <ScrollText className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-bold text-white tracking-tight">Letra</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700/60 to-transparent" />
      </div>

      {/* Lyrics card */}
      <div className="relative rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
        {/* Gradient top separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="max-h-[520px] overflow-y-auto px-6 sm:px-10 py-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          <p className="whitespace-pre-wrap text-slate-300 leading-8 text-[15px] font-light tracking-wide">
            {lyric}
          </p>
        </div>

        {/* Gradient bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0f172a]/80 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
