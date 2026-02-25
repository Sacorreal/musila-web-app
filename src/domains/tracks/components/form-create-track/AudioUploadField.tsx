"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  Music2,
  Play,
  Pause,
} from "lucide-react"

import { Input } from "@shared/components/UI/input"
import {
  Field,
  FieldLabel,
} from "@shared/components/UI/field"

interface Props {
  value: File | null | undefined
  onChange: (file: File | null) => void
  error?: string
}

export function AudioUploadField({
  value,
  onChange,
  error,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!value) return
    const url = URL.createObjectURL(value)

    if (audioRef.current) {
      audioRef.current.src = url
    }

    return () => URL.revokeObjectURL(url)
  }, [value])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const current = audioRef.current.currentTime
    const total = audioRef.current.duration
    setProgress((current / total) * 100)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime =
      percent * audioRef.current.duration
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const hasFile = !!value

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>Audio</FieldLabel>

      <div
        className={`relative rounded-xl border-2 border-dashed p-6 transition
        ${
          hasFile
            ? "border-green-500 bg-green-500/5"
            : error
            ? "border-red-500 bg-red-500/5"
            : "hover:border-primary"
        }`}
      >
        <Input
          type="file"
          accept="audio/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) =>
            onChange(e.target.files?.[0] ?? null)
          }
        />

        {!hasFile && (
          <div className="text-center space-y-2">
            <Music2 className="mx-auto w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Arrastra tu archivo o haz clic
            </p>
            <p className="text-xs text-muted-foreground">
              MP3 o WAV
            </p>
          </div>
        )}

        <AnimatePresence>
          {hasFile && value && (
            <motion.div
              key="audio-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                  <div>
                    <p className="text-sm font-medium">
                      {value.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(value.size)} • {formatTime(duration)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-red-500 hover:opacity-80 transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                <div
                  className="flex-1 h-2 bg-muted rounded-full cursor-pointer relative"
                  onClick={handleSeek}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-2 bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <span className="text-xs text-muted-foreground w-12 text-right">
                  {formatTime(audioRef.current?.currentTime ?? 0)}
                </span>
              </div>

              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">
          {error}
        </p>
      )}
    </Field>
  )
}