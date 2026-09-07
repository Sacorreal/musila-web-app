'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

function extractYoutubeId(url: string): string | null {
  const match = url.match(YOUTUBE_ID_REGEX)
  return match ? match[1] : null
}

interface Props {
  url: string
}

export function YoutubeEmbed({ url }: Props) {
  const [hasError, setHasError] = useState(false)
  const videoId = extractYoutubeId(url)

  if (!videoId || hasError) {
    return (
      <div className="my-8 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        No se pudo cargar el video de YouTube.
      </div>
    )
  }

  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-xl bg-muted">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Video de YouTube"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={() => setHasError(true)}
      />
    </div>
  )
}
