"use client"

import { usePlayer } from "@/src/domains/player/player.context"
import {
    HeartIcon,
    MusicNoteIcon,
    PauseIcon,
    PlayIcon,
    PlaylistIcon,
    SkipNextIcon,
    SkipPreviousIcon,
    VolumeIcon,
} from "@/src/shared/components/Icons/icons"
import { Button } from "@/src/shared/components/UI/button"
import { Slider } from "@/src/shared/components/UI/slider"
import { MoreHorizontal, Repeat, Shuffle } from "lucide-react"
import { useState } from "react"

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    playNext,
    playPrevious,
  } = usePlayer()

  const [isFavorite, setIsFavorite] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const displayTrack = currentTrack || {
    title: "Título de la canción",
    author: { artisticName: "Autor", name: "Autor" },
    coverUrl: "/placeholder.svg?height=56&width=56",
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a2332] border-t border-[#2a3444]">
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track info - left side */}
          <div className="flex items-center gap-3 w-64 min-w-0">
            <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {displayTrack.coverUrl ? (
                <img
                  src={displayTrack.coverUrl || "/placeholder.svg"}
                  alt={displayTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MusicNoteIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-primary truncate">{displayTrack.title}</p>
              <p className="text-xs text-primary/70 truncate">
                {displayTrack.author?.artisticName || displayTrack.author?.name}
              </p>
            </div>

            {/* More options and favorite */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFavorite(!isFavorite)}>
                <HeartIcon
                  className={`h-5 w-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-white/60"}`}
                  filled={isFavorite}
                />
              </Button>
            </div>
          </div>

          {/* Playback controls - center */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white"
                onClick={playPrevious}
              >
                <SkipPreviousIcon className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-white text-black hover:bg-white/90"
                onClick={currentTrack ? (isPlaying ? pause : resume) : undefined}
              >
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={playNext}>
                <SkipNextIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 w-full max-w-xl">
              <span className="text-xs text-white/60 w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 240}
                step={1}
                onValueChange={([value]) => seek(value)}
                className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_.bg-primary]:bg-red-500"
              />
              <span className="text-xs text-white/60 w-10">{formatTime(duration || 240)}</span>
            </div>
          </div>

          {/* Extra controls - right side */}
          <div className="flex items-center gap-2 w-48 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
              <PlaylistIcon className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <VolumeIcon className="h-4 w-4 text-white/60" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="w-20 [&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${shuffle ? "text-primary" : "text-white/60 hover:text-white"}`}
              onClick={() => setShuffle(!shuffle)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${repeat ? "text-primary" : "text-white/60 hover:text-white"}`}
              onClick={() => setRepeat(!repeat)}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
