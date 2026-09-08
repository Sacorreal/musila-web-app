'use client';

import { StickyNote } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';
import { useTrackNotes } from '../track-notes.hooks';
import { TrackNote } from '../track-notes.types';
import { AddTrackNoteForm } from './AddTrackNoteForm';
import { TrackNoteItem } from './TrackNoteItem';

interface TrackNotesSectionProps {
  trackId: string;
}

/**
 * Ordena por `timestampSeconds` ascendente, dejando las notas sin ancla
 * (null) al final.
 */
function sortNotes(notes: TrackNote[]): TrackNote[] {
  return [...notes].sort((a, b) => {
    if (a.timestampSeconds === null && b.timestampSeconds === null) return 0;
    if (a.timestampSeconds === null) return 1;
    if (b.timestampSeconds === null) return -1;
    return a.timestampSeconds - b.timestampSeconds;
  });
}

/**
 * Variante inline (no-modal) de `TrackNotesPanel`, para la página de detalle
 * de canción, donde no hay contexto de playlist — siempre privada.
 */
export function TrackNotesSection({ trackId }: TrackNotesSectionProps) {
  const { data: notes, isLoading, isError, refetch } = useTrackNotes(trackId);
  const sortedNotes = notes ? sortNotes(notes) : [];

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
          <StickyNote className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground tracking-tight">Mis notas</h2>
          <p className="text-xs text-muted-foreground">Privadas — solo tú las ves</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-muted/10 p-5 space-y-5">
        <AddTrackNoteForm trackId={trackId} />

        {isLoading ? (
          <div className="flex flex-col gap-3" aria-hidden="true">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border/40 bg-muted/30 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <p className="font-bold text-foreground">No se pudieron cargar tus notas</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-6 opacity-70">
            <StickyNote className="w-8 h-8 text-muted-foreground opacity-50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Aún no tienes notas privadas para esta canción.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {sortedNotes.map((note) => (
              <TrackNoteItem key={note.id} note={note} trackId={trackId} showAuthor={false} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
