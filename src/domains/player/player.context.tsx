"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import type { Track } from "@/src/shared/types/shared.types";

type PlayerContextValue = {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (tracks: Track[]) => void;
};

const noop = () => {};

const defaultValue: PlayerContextValue = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  queue: [],
  play: noop,
  pause: noop,
  resume: noop,
  seek: noop,
  setVolume: noop,
  playNext: noop,
  playPrevious: noop,
  setQueue: noop,
};

const PlayerContext = createContext<PlayerContextValue>(defaultValue);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [queue, setQueueState] = useState<Track[]>([]);

  const play = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
  }, []);

  const playNext = useCallback(() => {
    if (!queue.length) return;
    const [next, ...rest] = queue;
    setCurrentTrack(next);
    setQueueState(rest);
    setIsPlaying(true);
    setCurrentTime(0);
  }, [queue]);

  const playPrevious = useCallback(() => {
    // Implementación mínima: no manejamos historial por ahora.
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks ?? []);
  }, []);

  const value: PlayerContextValue = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      queue,
      play,
      pause,
      resume,
      seek,
      setVolume,
      playNext,
      playPrevious,
      setQueue,
    }),
    [
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      queue,
      play,
      pause,
      resume,
      seek,
      setVolume,
      playNext,
      playPrevious,
      setQueue,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  return useContext(PlayerContext);
}

