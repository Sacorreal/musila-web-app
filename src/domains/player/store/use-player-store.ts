import { create } from 'zustand';
import { TrackResponse } from '@/src/domains/tracks/types/track.types';

interface PlayerState {
  currentTrack: TrackResponse | null;
  isPlaying: boolean;
  volume: number;
  queue: TrackResponse[];
  history: TrackResponse[];
  
  // Actions
  play: (track: TrackResponse) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: TrackResponse) => void;
  setQueue: (tracks: TrackResponse[]) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1, // 0 to 1
  queue: [],
  history: [],

  play: (track) => set((state) => {
    // Si ya hay un track sonando, lo guardamos en el historial
    const newHistory = state.currentTrack && state.currentTrack.id !== track.id 
      ? [state.currentTrack, ...state.history].slice(0, 50) // limit history
      : state.history;
      
    return {
      currentTrack: track,
      isPlaying: true,
      history: newHistory
    };
  }),

  pause: () => set({ isPlaying: false }),
  
  resume: () => set((state) => ({ isPlaying: !!state.currentTrack })),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  playNext: () => set((state) => {
    if (state.queue.length === 0) return state; // Nothing to play next

    const nextTrack = state.queue[0];
    const newQueue = state.queue.slice(1);
    
    const newHistory = state.currentTrack 
      ? [state.currentTrack, ...state.history].slice(0, 50)
      : state.history;

    return {
      currentTrack: nextTrack,
      queue: newQueue,
      isPlaying: true,
      history: newHistory
    };
  }),

  playPrevious: () => set((state) => {
    if (state.history.length === 0) return state; // Nothing in history
    
    const prevTrack = state.history[0];
    const newHistory = state.history.slice(1);
    
    // Put current track back to the start of the queue
    const newQueue = state.currentTrack 
      ? [state.currentTrack, ...state.queue]
      : state.queue;

    return {
      currentTrack: prevTrack,
      history: newHistory,
      queue: newQueue,
      isPlaying: true
    };
  }),

  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),

  setQueue: (tracks) => set({ queue: tracks }),

  clearPlayer: () => set({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    history: []
  })
}));
