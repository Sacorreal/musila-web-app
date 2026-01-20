"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/domains/auth/auth.context"
import { tracksService } from "@/domains/tracks/tracks.service"
import { usersService, type UpdateUserInput } from "@/domains/users/users.service"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackCard } from "@/components/app/track-card"
import { UserIcon } from "@/components/icons"
import { toast } from "sonner"
import { Loader2, Settings, Music } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [myTracks, setMyTracks] = useState<Track[]>([])
  const [isLoadingTracks, setIsLoadingTracks] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<UpdateUserInput>({
    name: "",
    lastName: "",
    artisticName: "",
    bio: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        artisticName: user.artisticName || "",
        bio: user.bio || "",
      })

      loadMyTracks()
    }
  }, [user])

  const loadMyTracks = async () => {
    setIsLoadingTracks(true)
    const { data } = await tracksService.getMyTracks()
    if (data) setMyTracks(data)
    setIsLoadingTracks(false)
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)

    const { error } = await usersService.update(user.id, formData)

    if (error) {
      toast.error("Error al guardar el perfil")
    } else {
      toast.success("Perfil actualizado")
    }

    setIsSaving(false)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="h-32 w-32 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden shrink-0 mx-auto md:mx-0">
          {user?.avatar ? (
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="h-16 w-16 text-muted-foreground" />
          )}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user?.artisticName || user?.name}</h1>
          <p className="text-muted-foreground">{user?.role === "COMPOSER" ? "Compositor" : "Intérprete"}</p>
          {user?.bio && <p className="text-sm text-foreground mt-2 max-w-lg">{user.bio}</p>}
          {user?.role === "COMPOSER" && (
            <p className="text-sm text-primary mt-2">{myTracks.length} canciones publicadas</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
          {user?.role === "COMPOSER" && (
            <TabsTrigger value="tracks">
              <Music className="h-4 w-4 mr-2" />
              Mis canciones
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del perfil</CardTitle>
              <CardDescription>Actualiza tu información personal y profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="artisticName">Nombre artístico</Label>
                <Input
                  id="artisticName"
                  value={formData.artisticName}
                  onChange={(e) => setFormData({ ...formData, artisticName: e.target.value })}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={isSaving}
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "COMPOSER" && (
          <TabsContent value="tracks" className="mt-6">
            {isLoadingTracks ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : myTracks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No has subido canciones</h3>
                <p className="text-muted-foreground mb-4">Comparte tu música con intérpretes de todo el mundo</p>
                <Button asChild>
                  <a href="/app/upload">Subir mi primera canción</a>
                </Button>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
