'use client'

import React, { useState, useEffect } from 'react';
import { XIcon, Edit2Icon, CheckIcon, Trash2Icon, FileText } from 'lucide-react';
import { useUpdatePlaylist } from '../hooks/use-playlist.hooks';
import { RequestTrackModal } from '@/src/domains/requests/components/RequestTrackModal';
import { Playlist } from '../types/playlist.types';
import { cn } from '@/src/shared/libs/cn';
import { Button } from '@/src/shared/components/UI/button';
import { MusicNoteIcon } from '@/src/shared/components/Icons/icons';
import { PlayAllButton } from '@/src/domains/player/components/PlayAllButton';
import { usePlayerStore } from '@/src/domains/player/store/use-player-store';

interface PlaylistSidePanelProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlaylistSidePanel({ playlist, isOpen, onClose }: PlaylistSidePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const updatePlaylist = useUpdatePlaylist();

  // Reset states when the playlist changes or panel opens
  useEffect(() => {
    if (playlist) {
      setEditTitle(playlist.title);
      setIsEditing(false);
    }
  }, [playlist, isOpen]);

  if (!playlist) return null;

  const handleSaveTitle = () => {
    if (!editTitle.trim() || editTitle.trim() === playlist.title) {
      setIsEditing(false);
      return;
    }
    
    updatePlaylist.mutate(
      { id: playlist.id, data: { title: editTitle.trim() } },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleRemoveTrack = (trackIdToRemove: string) => {
    if (!playlist || !playlist.tracks) return;
    
    // Filtramos el track a eliminar
    const updatedTrackIds = playlist.tracks
      .filter(t => t.id !== trackIdToRemove)
      .map(t => t.id);

    updatePlaylist.mutate(
      { id: playlist.id, data: { trackIds: updatedTrackIds } }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(playlist.title);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex flex-col flex-1 overflow-hidden pr-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={updatePlaylist.isPending}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  onClick={handleSaveTitle}
                  disabled={updatePlaylist.isPending}
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-muted-foreground"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(playlist.title);
                  }}
                  disabled={updatePlaylist.isPending}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h2 className="text-lg font-bold truncate">{playlist.title}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-6 h-6 opacity-0 group-hover/title:opacity-100 transition-opacity" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2Icon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MusicNoteIcon className="w-3.5 h-3.5" />
              {playlist.tracks?.length || 0} pistas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PlayAllButton 
              tracks={playlist.tracks || []} 
              iconOnly 
              className="w-10 h-10 [&>svg]:w-4 [&>svg]:h-4" 
            />
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full flex-shrink-0 hover:bg-muted">
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content - Track List */}
        <div className="flex-1 overflow-y-auto p-6">
          {(!playlist.tracks || playlist.tracks.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MusicNoteIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No hay pistas aún</p>
                <p className="text-sm text-muted-foreground">Esta lista de reproducción está vacía.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {playlist.tracks.map((track, idx) => (
                <div 
                  key={track.id || idx} 
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer border border-transparent hover:border-border"
                  onClick={() => {
                    if (playlist.tracks) {
                      usePlayerStore.getState().setQueue(playlist.tracks.slice(idx + 1) as any);
                      usePlayerStore.getState().play(track as any);
                    }
                  }}
                >
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                      {track.title || 'Pista desconocida'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.authors?.map(a => a.name).join(', ') || 'Varios artistas'}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <RequestTrackModal 
                      trackId={track.id} 
                      genreSlug={typeof track.genre === 'object' ? (track.genre as any).slug : undefined}
                    >
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </RequestTrackModal>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTrack(track.id);
                      }}
                      disabled={updatePlaylist.isPending}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
