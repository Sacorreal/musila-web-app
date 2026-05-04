'use client'

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music2, 
  FileText,
  Mic2
} from 'lucide-react';
import { usePlayerStore } from '../store/use-player-store';
import { Slider } from '@/src/shared/components/UI/slider';
import { Button } from '@/src/shared/components/UI/button';
import { PlaylistIcon } from '@/src/shared/components/Icons/icons';
import { AddToPlaylistModal } from '@/src/domains/playlists/components/AddToPlaylistModal';
import { RequestTrackModal } from '@/src/domains/requests/components/RequestTrackModal';
import { TrackLyricsSidePanel } from './TrackLyricsSidePanel';
import { cn } from '@/src/shared/libs/cn';

// Helper to format time (e.g., 65 -> 1:05)
const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const playNext = usePlayerStore(state => state.playNext);
  const playPrevious = usePlayerStore(state => state.playPrevious);
  const pause = usePlayerStore(state => state.pause);
  const resume = usePlayerStore(state => state.resume);
  const setVolumeState = usePlayerStore(state => state.setVolume);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

  // Sync audio play/pause with global state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio playback prevented:", err);
          pause();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, pause]);

  // Sync volume with global state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio Event Listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  // Slider handlers
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    setVolumeState(newVolume);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume > 0 ? previousVolume : 1);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolumeState(0);
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-xl border-t border-white/5 z-50 flex items-center px-4 md:px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Left: Track Info */}
      <div className="flex w-1/3 min-w-[180px] items-center gap-4">
        <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex-shrink-0 shadow-md">
          {currentTrack.coverUrl ? (
            <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <Music2 className="w-6 h-6 text-slate-500" />
            </div>
          )}
        </div>
        <div className="flex flex-col truncate">
          <Link href={`/music/tracks/${currentTrack.id}`} className="font-bold text-sm text-foreground hover:underline truncate">
            {currentTrack.title}
          </Link>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.authors && currentTrack.authors.length > 0
              ? (currentTrack.authors.every(a => typeof a === 'string') 
                  ? 'Varios Artistas' 
                  : currentTrack.authors.map((a, idx, arr) => {
                      if (typeof a === 'string') return null;
                      const name = `${(a as any).name || ''} ${(a as any).lastName || ''}`.trim();
                      if (!name) return null;
                      return (
                        <span key={(a as any).id || idx}>
                          <Link href={`/music/artista/${(a as any).id}`} className="hover:underline hover:text-primary transition-colors">
                            {name}
                          </Link>
                          {idx < arr.length - 1 && ', '}
                        </span>
                      );
                    }).filter(Boolean)
                )
              : 'Autor Desconocido'}
          </p>
        </div>
      </div>

      {/* Center: Playback Controls & Progress */}
      <div className="flex flex-col flex-1 max-w-2xl items-center justify-center gap-1">
        <div className="flex items-center gap-4 md:gap-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={playPrevious}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full w-10 h-10 bg-foreground text-background hover:scale-105 hover:bg-foreground transition-all shadow-md"
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={playNext}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full text-xs text-muted-foreground font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer group"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Extra Controls & Volume */}
      <div className="flex w-1/3 min-w-[180px] items-center justify-end gap-2 md:gap-4">
        {/* Modals integrated into the player */}
        <AddToPlaylistModal trackId={currentTrack.id} trackTitle={currentTrack.title}>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors" title="Agregar a Playlist">
            <PlaylistIcon className="w-5 h-5" />
          </Button>
        </AddToPlaylistModal>

        <RequestTrackModal 
          trackId={currentTrack.id} 
          genreSlug={typeof currentTrack.genre === 'object' ? (currentTrack.genre as any).slug : undefined}
        >
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-emerald-500 transition-colors" title="Solicitar Uso">
            <FileText className="w-5 h-5" />
          </Button>
        </RequestTrackModal>

        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "transition-colors",
            currentTrack.lyric ? "text-muted-foreground hover:text-purple-500" : "text-muted-foreground/30 hover:bg-transparent cursor-not-allowed"
          )}
          title={currentTrack.lyric ? "Ver letra" : "Letra no disponible"}
          onClick={() => currentTrack.lyric && setIsLyricsOpen(!isLyricsOpen)}
          disabled={!currentTrack.lyric}
        >
          <Mic2 className="w-5 h-5" />
        </Button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-28 ml-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8" onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="cursor-pointer group"
          />
        </div>
      </div>
    </div>
      
      {/* Lyrics Side Panel */}
      <TrackLyricsSidePanel 
        track={currentTrack as any} 
        isOpen={isLyricsOpen} 
        onClose={() => setIsLyricsOpen(false)} 
      />
    </>
  );
}
