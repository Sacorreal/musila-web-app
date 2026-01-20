"use client"

import { RequestCard } from "@/src/components/app/request-card"
import { useAuth } from "@/src/domains/auth/components/auth.context"
import { requestsService } from "@/src/domains/requests/requests.service"
import type { RequestedTrack } from "@/src/lib/types"
import { RequestIcon } from "@/src/shared/components/icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui/tabs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RequestedTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRequests = async () => {
    setIsLoading(true)
    const { data } = await requestsService.getAll()
    if (data) setRequests(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const isComposer = user?.role === "COMPOSER"

  const sentRequests = requests.filter((r) => r.requesterId === user?.id)
  const receivedRequests = requests.filter((r) => r.track?.authorId === user?.id)

  const handleStatusUpdate = () => {
    loadRequests()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Solicitudes</h1>
        <p className="text-muted-foreground">
          {isComposer
            ? "Gestiona las solicitudes de uso de tus canciones"
            : "Revisa el estado de tus solicitudes enviadas"}
        </p>
      </div>

      <Tabs defaultValue={isComposer ? "received" : "sent"}>
        <TabsList>
          {isComposer && <TabsTrigger value="received">Recibidas ({receivedRequests.length})</TabsTrigger>}
          <TabsTrigger value="sent">Enviadas ({sentRequests.length})</TabsTrigger>
        </TabsList>

        {isComposer && (
          <TabsContent value="received" className="space-y-4 mt-6">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <RequestCard key={request.id} request={request} type="received" onStatusUpdate={handleStatusUpdate} />
              ))
            ) : (
              <EmptyState message="No has recibido solicitudes aún" />
            )}
          </TabsContent>
        )}

        <TabsContent value="sent" className="space-y-4 mt-6">
          {sentRequests.length > 0 ? (
            sentRequests.map((request) => <RequestCard key={request.id} request={request} type="sent" />)
          ) : (
            <EmptyState message="No has enviado solicitudes aún" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-card rounded-xl border border-border">
      <RequestIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
