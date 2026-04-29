'use client'

import React from 'react';
import { Card, CardContent } from '@/src/shared/components/UI/card';
import { MusicNoteIcon, PlaylistIcon, PlayIcon } from '@/src/shared/components/Icons/icons';
import { Playlist } from '../types/playlist.types';
import { cn } from '@/src/shared/libs/cn';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: (playlist: Playlist) => void;
}

export function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  const trackCount = playlist.tracks?.length || 0;

  return (
    <Card 
      onClick={() => onClick?.(playlist)}
      className="group relative overflow-hidden bg-background/50 backdrop-blur-sm hover:bg-muted/50 border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1"
    >
      <CardContent className="p-4 flex flex-col h-full gap-4">
        {/* Cover Aspect Ratio Box */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-white/5 group-hover:shadow-lg transition-all duration-500">
          {playlist.cover ? (
            <img 
              src={playlist.cover} 
              alt={playlist.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-primary/40 group-hover:text-primary/60 transition-colors duration-300">
              <PlaylistIcon className="w-16 h-16" />
            </div>
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
              <PlayIcon className="w-6 h-6 ml-1" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 mt-auto">
          <h3 className="font-semibold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors">
            {playlist.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MusicNoteIcon className="w-3.5 h-3.5" />
            <span>{trackCount} {trackCount === 1 ? 'pista' : 'pistas'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
