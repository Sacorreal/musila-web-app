'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/UI/select'
import { Loader2 } from 'lucide-react'
import { useThemes } from '@domains/themes/hooks/theme.hooks'

interface ThemeSelectorProps {
  themeId?: string
  onChange: (themeId: string) => void
  disabled?: boolean
}

const NONE_VALUE = '__none__'

export function ThemeSelector({ themeId, onChange, disabled }: ThemeSelectorProps) {
  const { data: themes = [], isLoading, isError } = useThemes()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando catálogo de temas...
      </div>
    )
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error de conexión. Intenta de nuevo más tarde.</div>
  }

  return (
    <Select
      value={themeId || NONE_VALUE}
      onValueChange={(val) => onChange(val === NONE_VALUE ? '' : val)}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un tema (opcional)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE}>Sin tema</SelectItem>
        {themes.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
