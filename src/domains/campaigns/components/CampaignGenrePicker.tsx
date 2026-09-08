'use client'

import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { Label } from '@/src/shared/components/UI/label'
import { MultiSelect } from '@/src/shared/components/UI/multi-select'
import { useGenres } from '@/src/domains/musical-genre/hooks/use-genres.hooks'
import type { CampaignGenreFilterInput } from '../types/campaigns.types'

interface CampaignGenrePickerProps {
  value: CampaignGenreFilterInput[]
  onChange: (value: CampaignGenreFilterInput[]) => void
}

/**
 * Selección de géneros/ritmos buscados por la campaña (§1 Creación de la
 * campaña): uno o varios géneros, y por cada uno, ritmos puntuales o "todos
 * los ritmos del género".
 */
export function CampaignGenrePicker({ value, onChange }: CampaignGenrePickerProps) {
  const { data: genres, isLoading } = useGenres()

  const genreOptions = (genres ?? []).map((g) => ({ value: g.id, label: g.genre }))
  const selectedGenreIds = value.map((v) => v.genreId)

  const setGenreIds = (genreIds: string[]) => {
    const next = genreIds.map((genreId) => {
      const existing = value.find((v) => v.genreId === genreId)
      return existing ?? { genreId, ritmos: undefined }
    })
    onChange(next)
  }

  const updateGenreRitmos = (genreId: string, ritmos: string[] | undefined) => {
    onChange(value.map((v) => (v.genreId === genreId ? { ...v, ritmos } : v)))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Géneros buscados</Label>
        <MultiSelect
          options={genreOptions}
          value={selectedGenreIds}
          onChange={setGenreIds}
          placeholder={isLoading ? 'Cargando géneros…' : 'Selecciona uno o varios géneros'}
          disabled={isLoading}
        />
      </div>

      {value.map((selection) => {
        const genre = genres?.find((g) => g.id === selection.genreId)
        if (!genre) return null
        const catalog = genre.ritmo ?? []
        const allRitmos = selection.ritmos === undefined

        return (
          <div key={selection.genreId} className="space-y-2 rounded-lg border border-border p-3">
            <p className="text-sm font-medium text-foreground">{genre.genre}</p>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={allRitmos}
                onCheckedChange={(checked) => updateGenreRitmos(selection.genreId, checked ? undefined : [])}
              />
              Todos los ritmos de {genre.genre}
            </label>
            {!allRitmos && catalog.length > 0 && (
              <MultiSelect
                options={catalog.map((r) => ({ value: r, label: r }))}
                value={selection.ritmos ?? []}
                onChange={(ritmos) => updateGenreRitmos(selection.genreId, ritmos)}
                placeholder="Selecciona ritmos puntuales"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
