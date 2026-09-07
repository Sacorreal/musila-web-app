'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface PlaylistDetailHeaderProps {
  title?: string
  ownerName?: string
}

export function PlaylistDetailHeader({ title, ownerName }: PlaylistDetailHeaderProps) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => router.push('/admin/playlists')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Playlists
      </button>

      <div>
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Propietario: {ownerName ?? '—'}
        </p>
      </div>
    </>
  )
}
