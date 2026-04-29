'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';
import { usePlayerStore } from '../store/use-player-store';
import { TrackResponse } from '@/src/domains/tracks/types/track.types';

export interface PlayAllButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tracks: any[]; // Using any[] to accept TrackResponse or TracksResponseDto
  iconOnly?: boolean;
}

export function PlayAllButton({ tracks, iconOnly = false, className, children, ...props }: PlayAllButtonProps) {
  const handlePlayAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (tracks && tracks.length > 0) {
      const [firstTrack, ...restTracks] = tracks;
      usePlayerStore.getState().setQueue(restTracks as TrackResponse[]);
      usePlayerStore.getState().play(firstTrack as TrackResponse);
    }
  };

  if (iconOnly) {
    return (
      <Button 
        className={`w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 p-0 flex items-center justify-center align-middle shadow-lg border-0 shrink-0 ${className || ''}`}
        onClick={handlePlayAll}
        disabled={!tracks || tracks.length === 0}
        {...props}
      >
        <Play
          className="w-6 h-6 text-foreground dark:text-slate-300 ml-1"
          fill="currentColor"
        />
      </Button>
    );
  }

  return (
    <Button 
      className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${className || ''}`}
      onClick={handlePlayAll}
      disabled={!tracks || tracks.length === 0}
      {...props}
    >
      <Play size={24} fill="currentColor" className="mr-3" /> {children || 'PLAY'}
    </Button>
  );
}
