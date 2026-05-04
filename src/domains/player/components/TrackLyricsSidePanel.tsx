'use client'

import React from 'react';
import { XIcon, Mic2 } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';
import { Button } from '@/src/shared/components/UI/button';
import { TrackResponse } from '@/src/domains/tracks/types/track.types';

interface TrackLyricsSidePanelProps {
  track: TrackResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackLyricsSidePanel({ track, isOpen, onClose }: TrackLyricsSidePanelProps) {
  if (!track) return null;

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
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-background/95 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-black text-foreground truncate tracking-tight">Letra</h2>
              <p className="text-xs font-semibold text-muted-foreground truncate opacity-80">
                {track.title}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full flex-shrink-0 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Lyrics */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {(!track.lyric || track.lyric.trim() === '') ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-70">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Mic2 className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <div className="max-w-[200px]">
                <p className="font-bold text-lg text-foreground tracking-tight">Letra no disponible</p>
                <p className="text-sm text-muted-foreground mt-2">Aún no se ha añadido la letra para esta pista.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-none">
              <div className="relative">
                {/* Decorative blur effect behind text */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />
                
                <p 
                  className="whitespace-pre-wrap text-[1.1rem] leading-loose font-medium text-slate-800 dark:text-slate-200/90 tracking-wide"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  {track.lyric}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Fade Out */}
        <div className="h-12 w-full bg-gradient-to-t from-background to-transparent absolute bottom-0 pointer-events-none" />
      </div>
    </>
  );
}
