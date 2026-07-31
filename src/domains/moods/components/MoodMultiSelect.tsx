'use client'

import { Loader2 } from 'lucide-react'
import { useMoods } from '@domains/moods/hooks/mood.hooks'
import { MultiSelect } from '@shared/components/UI/multi-select'

interface MoodMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  maxSelected?: number
  disabled?: boolean
}

export function MoodMultiSelect({ value, onChange, maxSelected = 2, disabled }: MoodMultiSelectProps) {
  const { data: moods = [], isLoading, isError } = useMoods()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando catálogo de moods...
      </div>
    )
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error de conexión. Intenta de nuevo más tarde.</div>
  }

  return (
    <MultiSelect
      options={moods.map((m) => ({ value: m.id, label: m.name, group: m.category }))}
      value={value}
      onChange={onChange}
      maxSelected={maxSelected}
      placeholder={`Selecciona hasta ${maxSelected} moods`}
      emptyText="No se encontraron moods."
      disabled={disabled}
    />
  )
}
