"use client"

import type React from "react"

import { requestsService } from "@/src/domains/requests/requests.service"
import { MusicNoteIcon } from "@/src/shared/components/Icons/icons"
import { Button } from "@/src/shared/components/UI/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/UI/dialog"
import { Label } from "@/src/shared/components/UI/label"
import { Textarea } from "@/src/shared/components/UI/textarea"
import type { Track } from "@/src/shared/types/shared.types"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface RequestUsageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  track: Track | null
}

export function RequestUsageDialog({ open, onOpenChange, track }: RequestUsageDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!track) return

    setIsLoading(true)

    const { error } = await requestsService.create({
      trackId: track.id,
      message,
    })

    if (error) {
      toast.error("Error al enviar la solicitud", { description: error })
    } else {
      toast.success("Solicitud enviada exitosamente", {
        description: "El compositor recibirá tu solicitud y podrá responder",
      })
      setMessage("")
      onOpenChange(false)
    }

    setIsLoading(false)
  }

  if (!track) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar uso de canción</DialogTitle>
          <DialogDescription>
            Envía una solicitud al compositor para obtener permiso de grabar esta canción
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
            {track.coverUrl ? (
              <img
                src={track.coverUrl || "/placeholder.svg"}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <MusicNoteIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{track.title}</p>
            <p className="text-sm text-muted-foreground truncate">{track.author?.artisticName || track.author?.name}</p>
            {track.genre && <p className="text-xs text-primary">{track.genre.name}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje al compositor</Label>
            <Textarea
              id="message"
              placeholder="Cuéntale al compositor por qué te interesa su canción, qué proyecto tienes en mente, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Un mensaje detallado aumenta las posibilidades de que tu solicitud sea aprobada
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
