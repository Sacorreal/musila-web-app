'use client'

import { useState, type ChangeEvent } from 'react'
import { CalendarIcon, Loader2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/UI/popover'
import { Calendar } from '@/src/shared/components/UI/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { cn } from '@/src/shared/libs/cn'
import { useGenres } from '@/src/domains/musical-genre/hooks/use-genres.hooks'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder, UploadField } from '@/src/domains/storage/types/storage.types'
import { useCreateCampaign } from '../hooks/use-campaigns.hooks'
import { CampaignGenrePicker } from './CampaignGenrePicker'
import type { CampaignGenreFilterInput, CampaignVisibility } from '../types/campaigns.types'

const today = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

/** Formulario de creación de campaña (de una organización, o personal): §1 Creación de la campaña. */
export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [visibility, setVisibility] = useState<CampaignVisibility>('PUBLIC')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [genres, setGenres] = useState<CampaignGenreFilterInput[]>([])
  const [songsPerComposerLimit, setSongsPerComposerLimit] = useState('3')
  const [requiredSongsCount, setRequiredSongsCount] = useState('10')
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)

  const { data: allGenres } = useGenres()
  const createCampaign = useCreateCampaign()
  const uploadStorage = useUploadStorage()

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
    setVisibility('PUBLIC')
    setCoverFile(null)
    setCoverPreview(null)
    setGenres([])
    setSongsPerComposerLimit('3')
    setRequiredSongsCount('10')
    setDeadline(undefined)
  }

  const onCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!isValid || !deadline) return
    try {
      let coverUrl: string | undefined
      if (coverFile) {
        const result = await uploadStorage.mutateAsync([
          { field: 'cover' as UploadField, file: coverFile, folder: StorageFolder.CAMPAIGN_COVER },
        ])
        coverUrl = result.find((r) => r.field === 'cover')?.publicUrl
      }

      await createCampaign.mutateAsync({
        title: title.trim(),
        visibility,
        coverUrl,
        genres,
        songsPerComposerLimit: Number(songsPerComposerLimit),
        requiredSongsCount: Number(requiredSongsCount),
        deadline: deadline.toISOString(),
      })
      setOpen(false)
      reset()
    } catch {
      /* toast en el hook */
    }
  }

  const isSubmitting = createCampaign.isPending || uploadStorage.isPending

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
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal', !deadline && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP", { locale: es }) : 'Selecciona una fecha'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(date) => {
                    setDeadline(date)
                    setCalendarOpen(false)
                  }}
                  disabled={(date) => date < today()}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label>Cover (opcional)</Label>
            <div className="flex items-center gap-4">
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover de la campaña" className="h-16 w-16 rounded-lg object-cover border border-border" />
              )}
              <div className="flex-1 space-y-1.5">
                <Input type="file" accept="image/*" onChange={onCoverChange} />
                {uploadStorage.progresses['cover'] > 0 && uploadStorage.progresses['cover'] < 100 && (
                  <p className="text-xs text-muted-foreground">Subiendo... {uploadStorage.progresses['cover']}%</p>
                )}
                <p className="text-xs text-muted-foreground">Si se omite, se usa el logo de tu workspace o tus iniciales.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando…
              </>
            ) : (
              'Crear campaña'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
