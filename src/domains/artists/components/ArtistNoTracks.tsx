import React from 'react';
import { Music2 } from 'lucide-react';

export function ArtistNoTracks() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-6">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-slate-700/40 blur-2xl scale-110" />
        <div className="relative w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center shadow-xl">
          <Music2 className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        Aún no hay canciones
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
        Este artista todavía no ha publicado ningún track. ¡Vuelve pronto para descubrir su música!
      </p>
    </div>
  );
}
