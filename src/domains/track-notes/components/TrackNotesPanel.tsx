'use client';

import { StickyNote, XIcon } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';
import { Button } from '@/src/shared/components/UI/button';
import { useTrackNotes } from '../track-notes.hooks';
import { TrackNote } from '../track-notes.types';
import { AddTrackNoteForm } from './AddTrackNoteForm';
import { TrackNoteItem } from './TrackNoteItem';

interface TrackNotesPanelProps {
  trackId: string;
  playlistId?: string;
  isOpen: boolean;
  onClose: () => void;
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

export function TrackNotesPanel({ trackId, playlistId, isOpen, onClose }: TrackNotesPanelProps) {
  const { data: notes, isLoading, isError, refetch } = useTrackNotes(trackId, playlistId);
  const sortedNotes = notes ? sortNotes(notes) : [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notas de la canción"
        className={cn(
          'fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-background/95 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-500',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <StickyNote className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-black text-foreground truncate tracking-tight">Notas</h2>
              <p className="text-xs font-semibold text-muted-foreground truncate opacity-80">
                {playlistId ? 'Compartidas con la playlist' : 'Privadas — solo tú las ves'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full flex-shrink-0 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar panel de notas"
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Formulario de creación */}
        <div className="px-6 pt-5">
          <AddTrackNoteForm trackId={trackId} playlistId={playlistId} />
        </div>

        {/* Contenido - lista de notas */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl border border-border/40 bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80">
              <p className="font-bold text-foreground">No se pudieron cargar las notas</p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Ocurrió un error al obtener las notas de esta canción.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-70">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <StickyNote className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <div className="max-w-[220px]">
                <p className="font-bold text-lg text-foreground tracking-tight">Aún no hay notas</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {playlistId
                    ? 'Sé el primero en dejar una nota para esta playlist.'
                    : 'Agrega la primera nota privada sobre esta canción.'}
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {sortedNotes.map((note) => (
                <TrackNoteItem
                  key={note.id}
                  note={note}
                  trackId={trackId}
                  playlistId={playlistId}
                  showAuthor={Boolean(playlistId)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer fade */}
        <div className="h-12 w-full bg-gradient-to-t from-background to-transparent absolute bottom-0 pointer-events-none" />
      </div>
    </>
  );
}
