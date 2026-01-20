"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/domains/auth/auth.context"
import { tracksService, type CreateTrackInput } from "@/domains/tracks/tracks.service"
import type { MusicalGenre, Language } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadIcon, MusicNoteIcon, ImageIcon } from "@/components/icons"
import { toast } from "sonner"
import { Loader2, Upload, X, Music } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const audioInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [genres, setGenres] = useState<MusicalGenre[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [audioDuration, setAudioDuration] = useState<number>(0)

  const [formData, setFormData] = useState<CreateTrackInput>({
    title: "",
    description: "",
    audioUrl: "",
    coverUrl: "",
    duration: 0,
    bpm: undefined,
    key: "",
    genreId: "",
    languageId: "",
    allowRequests: true,
  })

  useEffect(() => {
    async function loadData() {
      const [genresRes, languagesRes] = await Promise.all([tracksService.getGenres(), tracksService.getLanguages()])

      if (genresRes.data) setGenres(genresRes.data)
      if (languagesRes.data) setLanguages(languagesRes.data)
    }

    loadData()
  }, [])

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      toast.error("Por favor selecciona un archivo de audio válido")
      return
    }

    setAudioFile(file)

    // Get audio duration
    const audio = new Audio()
    audio.src = URL.createObjectURL(file)
    audio.onloadedmetadata = () => {
      setAudioDuration(Math.round(audio.duration))
      URL.revokeObjectURL(audio.src)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const removeCover = () => {
    setCoverFile(null)
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
      setCoverPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!audioFile) {
      toast.error("Por favor selecciona un archivo de audio")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would upload the files to a storage service
      // and get the URLs back. For now, we'll simulate this.
      const audioUrl = URL.createObjectURL(audioFile)
      const coverUrl = coverFile ? URL.createObjectURL(coverFile) : ""

      const trackData: CreateTrackInput = {
        ...formData,
        audioUrl,
        coverUrl,
        duration: audioDuration,
        bpm: formData.bpm ? Number(formData.bpm) : undefined,
      }

      const { error } = await tracksService.create(trackData)

      if (error) {
        toast.error("Error al subir la canción", { description: error })
      } else {
        toast.success("Canción subida exitosamente")
        router.push("/app")
      }
    } catch (_error) {
      toast.error("Error al procesar los archivos")
    }

    setIsLoading(false)
  }

  if (user?.role !== "COMPOSER") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <UploadIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Solo para compositores</h1>
        <p className="text-muted-foreground">
          Esta función está disponible solo para usuarios registrados como compositores.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Subir canción</h1>
        <p className="text-muted-foreground">Comparte tu música inédita con intérpretes de todo el mundo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Archivo de audio
            </CardTitle>
            <CardDescription>Sube tu canción en formato MP3, WAV o AAC</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="hidden"
              id="audio-upload"
            />

            {audioFile ? (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MusicNoteIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    {audioDuration > 0 &&
                      ` • ${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, "0")}`}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAudioFile(null)
                    setAudioDuration(0)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  <span className="font-medium text-foreground">Haz clic para seleccionar</span>
                  <br />o arrastra y suelta tu archivo aquí
                </p>
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Portada (opcional)
            </CardTitle>
            <CardDescription>Una imagen cuadrada de al menos 500x500px</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              id="cover-upload"
            />

            <div className="flex gap-4">
              <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                {coverPreview ? (
                  <img
                    src={coverPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MusicNoteIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-2">
                <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()}>
                  {coverFile ? "Cambiar imagen" : "Seleccionar imagen"}
                </Button>
                {coverFile && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeCover}>
                    <X className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la canción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Nombre de tu canción"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Cuéntanos sobre tu canción, su historia, inspiración..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Género musical</Label>
                <Select
                  value={formData.genreId}
                  onValueChange={(value) => setFormData({ ...formData, genreId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={formData.languageId}
                  onValueChange={(value) => setFormData({ ...formData, languageId: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.id} value={language.id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpm">BPM (opcional)</Label>
                <Input
                  id="bpm"
                  type="number"
                  placeholder="120"
                  value={formData.bpm || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bpm: e.target.value ? Number(e.target.value) : undefined })
                  }
                  disabled={isLoading}
                  min={1}
                  max={300}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Tonalidad (opcional)</Label>
                <Input
                  id="key"
                  placeholder="Do Mayor, La Menor..."
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRequests" className="text-base">
                  Permitir solicitudes de uso
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los intérpretes podrán solicitar permiso para grabar esta canción
                </p>
              </div>
              <Switch
                id="allowRequests"
                checked={formData.allowRequests}
                onCheckedChange={(checked) => setFormData({ ...formData, allowRequests: checked })}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || !audioFile} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Publicar canción
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
