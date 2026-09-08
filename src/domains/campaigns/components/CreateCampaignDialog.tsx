'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Label } from '@/src/shared/components/UI/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/components/UI/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { useGenres } from '@/src/domains/musical-genre/hooks/use-genres.hooks'
import { useCreateCampaign } from '../hooks/use-campaigns.hooks'
import { CampaignGenrePicker } from './CampaignGenrePicker'
import type { CampaignGenreFilterInput, CampaignVisibility } from '../types/campaigns.types'

/** Formulario de creación de campaña (de una organización, o personal): §1 Creación de la campaña. */
export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [visibility, setVisibility] = useState<CampaignVisibility>('PUBLIC')
  const [coverUrl, setCoverUrl] = useState('')
  const [genres, setGenres] = useState<CampaignGenreFilterInput[]>([])
  const [songsPerComposerLimit, setSongsPerComposerLimit] = useState('3')
  const [requiredSongsCount, setRequiredSongsCount] = useState('10')
  const [deadline, setDeadline] = useState('')

  const { data: allGenres } = useGenres()
  const createCampaign = useCreateCampaign()

  const genreNames = genres
    .map((g) => allGenres?.find((genre) => genre.id === g.genreId)?.genre)
    .filter(Boolean)
  const descriptionPreview = genreNames.length ? `Géneros buscados: ${genreNames.join(', ')}` : ''

  const isValid =
    title.trim().length >= 3 &&
    genres.length > 0 &&
    genres.every((g) => g.ritmos === undefined || g.ritmos.length > 0) &&
    Number(songsPerComposerLimit) >= 1 &&
    Number(requiredSongsCount) >= 1 &&
    !!deadline

  const reset = () => {
    setTitle('')
    setAuthorName('')
    setVisibility('PUBLIC')
    setCoverUrl('')
    setGenres([])
    setSongsPerComposerLimit('3')
    setRequiredSongsCount('10')
    setDeadline('')
  }

  const handleSubmit = async () => {
    if (!isValid) return
    try {
      await createCampaign.mutateAsync({
        title: title.trim(),
        authorName: authorName.trim() || undefined,
        visibility,
        coverUrl: coverUrl.trim() || undefined,
        genres,
        songsPerComposerLimit: Number(songsPerComposerLimit),
        requiredSongsCount: Number(requiredSongsCount),
        deadline: new Date(deadline).toISOString(),
      })
      setOpen(false)
      reset()
    } catch {
      /* toast en el hook */
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nueva campaña
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nueva campaña</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título de la campaña</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Buscamos tracks urbanos" />
          </div>

          <div className="space-y-1.5">
            <Label>Autor de la campaña</Label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ej. Sony Music (opcional, se usa el nombre de tu workspace o tu propio nombre)"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Visibilidad</Label>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as CampaignVisibility)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Pública (visible en el home)</SelectItem>
                <SelectItem value="PRIVATE">Privada (enlace único para compartir)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CampaignGenrePicker value={genres} onChange={setGenres} />

          {descriptionPreview && (
            <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Descripción autogenerada:</span> {descriptionPreview}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Canciones por compositor</Label>
              <Input
                type="number"
                min={1}
                value={songsPerComposerLimit}
                onChange={(e) => setSongsPerComposerLimit(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Canciones requeridas</Label>
              <Input
                type="number"
                min={1}
                value={requiredSongsCount}
                onChange={(e) => setRequiredSongsCount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Fecha máxima de recepción</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Cover (opcional)</Label>
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="URL de la imagen (si se omite, se usa el logo de tu workspace o tus iniciales)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={createCampaign.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || createCampaign.isPending}>
            {createCampaign.isPending ? 'Creando…' : 'Crear campaña'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
