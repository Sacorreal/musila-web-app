"use client"

import type { Track } from "@/src/lib/types"
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  queue: Track[]
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  addToQueue: (track: Track) => void
  playNext: () => void
  playPrevious: () => void
  setQueue: (tracks: Track[]) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [queue, setQueue] = useState<Track[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume

    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      playNext()
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
    }
  }, [])

  const play = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl
      audioRef.current.play()
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const resume = useCallback(() => {
    audioRef.current?.play()
    setIsPlaying(true)
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTrack(null)
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setVolumeState(newVolume)
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track])
  }, [])

  const playNext = useCallback(() => {
    if (queue.length > 0) {
      const [nextTrack, ...rest] = queue
      setQueue(rest)
      play(nextTrack)
    }
  }, [queue, play])

  const playPrevious = useCallback(() => {
    if (audioRef.current && currentTime > 3) {
      audioRef.current.currentTime = 0
    }
  }, [currentTime])

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        play,
        pause,
        resume,
        stop,
        seek,
        setVolume,
        addToQueue,
        playNext,
        playPrevious,
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
