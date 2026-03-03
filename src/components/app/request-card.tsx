"use client"

import { requestsService } from "@/src/domains/requests/requests.service"
import { MusicNoteIcon, UserIcon } from "@/src/shared/components/Icons/icons"
import { Badge } from "@/src/shared/components/UI/badge"
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
import type { RequestedTrack } from "@/src/shared/types/shared.types"
import { Check, Clock, Loader2, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface RequestCardProps {
  request: RequestedTrack
  type: "sent" | "received"
  onStatusUpdate?: () => void
}

const statusConfig = {
  PENDING: { label: "Pendiente", variant: "outline" as const, icon: Clock },
  APPROVED: { label: "Aprobada", variant: "default" as const, icon: Check },
  REJECTED: { label: "Rechazada", variant: "destructive" as const, icon: X },
}

export function RequestCard({ request, type, onStatusUpdate }: RequestCardProps) {
  const [respondDialogOpen, setRespondDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [respondAction, setRespondAction] = useState<"APPROVED" | "REJECTED" | null>(null)

  const status = statusConfig[request.status]
  const StatusIcon = status.icon

  const handleRespond = async () => {
    if (!respondAction) return
    setIsLoading(true)

    const { error } = await requestsService.update(request.id, {
      status: respondAction,
      response: responseMessage,
    })

    if (error) {
      toast.error("Error al responder la solicitud")
    } else {
      toast.success(respondAction === "APPROVED" ? "Solicitud aprobada" : "Solicitud rechazada")
      setRespondDialogOpen(false)
      onStatusUpdate?.()
    }

    setIsLoading(false)
  }

  const openRespondDialog = (action: "APPROVED" | "REJECTED") => {
    setRespondAction(action)
    setRespondDialogOpen(true)
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {request.track?.coverUrl ? (
                <img
                  src={request.track.coverUrl || "/placeholder.svg"}
                  alt={request.track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MusicNoteIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/app/track/${request.trackId}`} className="hover:underline">
                  <h3 className="font-semibold text-foreground truncate">{request.track?.title}</h3>
                </Link>
                <Badge variant={status.variant} className="shrink-0">
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
              </div>

              {type === "received" ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Solicitado por: {request.requester?.artisticName || request.requester?.name}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-2">
                  Por: {request.track?.author?.artisticName || request.track?.author?.name}
                </p>
              )}

              {request.message && (
                <div className="bg-muted/50 rounded-lg p-3 mb-2">
                  <p className="text-sm text-muted-foreground">{`"${request.message}"`}</p>
                </div>
              )}

              {request.response && (
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-xs text-primary font-medium mb-1">Respuesta del compositor:</p>
                  <p className="text-sm text-foreground">{`"${request.response}"`}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                {new Date(request.createdAt).toLocaleDateString("es", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {type === "received" && request.status === "PENDING" && (
            <div className="flex md:flex-col gap-2 shrink-0">
              <Button size="sm" onClick={() => openRespondDialog("APPROVED")} className="flex-1 md:flex-initial">
                <Check className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openRespondDialog("REJECTED")}
                className="flex-1 md:flex-initial bg-transparent"
              >
                <X className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{respondAction === "APPROVED" ? "Aprobar solicitud" : "Rechazar solicitud"}</DialogTitle>
            <DialogDescription>
              {respondAction === "APPROVED"
                ? "Al aprobar, el intérprete podrá usar tu canción para grabarla"
                : "Puedes explicar al intérprete por qué rechazas su solicitud"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Mensaje de respuesta (opcional)</Label>
              <Textarea
                id="response"
                placeholder={
                  respondAction === "APPROVED"
                    ? "Gracias por tu interés, adelante con el proyecto..."
                    : "Lo siento, pero en este momento no puedo..."
                }
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleRespond}
              disabled={isLoading}
              variant={respondAction === "REJECTED" ? "destructive" : "default"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : respondAction === "APPROVED" ? (
                "Confirmar aprobación"
              ) : (
                "Confirmar rechazo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
