'use client'

import * as React from 'react'
import { Ban, Check, ChevronsUpDown, Globe, MapPin } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/UI/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/shared/components/UI/command'
import { cn } from '@/src/shared/libs/cn'
import { getCountriesInSpanish } from '@/src/domains/auth/utils/get-countries'
import { SocietyAffiliationTerritoryMode } from '../society-affiliations.types'

interface Props {
  mode: SocietyAffiliationTerritoryMode
  countries: string[]
  onModeChange: (mode: SocietyAffiliationTerritoryMode) => void
  onCountriesChange: (countries: string[]) => void
  disabled?: boolean
}

const MODE_OPTIONS = [
  { mode: SocietyAffiliationTerritoryMode.WORLDWIDE, label: 'Todo el mundo', icon: Globe },
  { mode: SocietyAffiliationTerritoryMode.SPECIFIC_COUNTRIES, label: 'País(es) específico(s)', icon: MapPin },
  { mode: SocietyAffiliationTerritoryMode.WORLDWIDE_EXCEPT, label: 'Todo el mundo excepto...', icon: Ban },
] as const

/**
 * Cubre los tres esquemas reales de administración territorial de una
 * sociedad de gestión colectiva: un país o varios países puntuales, el mundo
 * entero, o el mundo entero excepto ciertos países — ej. SAYCO administra
 * "todo el mundo excepto EE.UU." mientras otra sociedad administra
 * exclusivamente EE.UU.; ambas afiliaciones deben poder coexistir sin
 * solaparse (validado en el backend, ver `SocietyAffiliationService`).
 */
export function SocietyTerritorySelector({ mode, countries, onModeChange, onCountriesChange, disabled }: Props) {
  const [open, setOpen] = React.useState(false)
  const countriesList = React.useMemo(() => getCountriesInSpanish(), [])

  const toggleCountry = (isoCode: string) => {
    onCountriesChange(countries.includes(isoCode) ? countries.filter((c) => c !== isoCode) : [...countries, isoCode])
  }

  const showCountryPicker = mode !== SocietyAffiliationTerritoryMode.WORLDWIDE
  const pickerLabel = mode === SocietyAffiliationTerritoryMode.WORLDWIDE_EXCEPT ? 'países excluidos' : 'país(es)'

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {MODE_OPTIONS.map(({ mode: optionMode, label, icon: Icon }) => (
          <button
            key={optionMode}
            type="button"
            disabled={disabled}
            onClick={() => onModeChange(optionMode)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 h-11 px-2 text-sm font-bold transition-all disabled:opacity-50',
              mode === optionMode
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {showCountryPicker && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-sm font-medium disabled:opacity-50"
            >
              <span className="truncate">
                {countries.length > 0 ? `${countries.length} ${pickerLabel} seleccionados` : `Selecciona ${pickerLabel}`}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar país..." />
              <CommandList>
                <CommandEmpty>Sin resultados.</CommandEmpty>
                <CommandGroup>
                  {countriesList.map(({ isoCode, name }) => (
                    <CommandItem key={isoCode} value={`${name} ${isoCode}`} onSelect={() => toggleCountry(isoCode)}>
                      <Check className={cn('h-4 w-4', countries.includes(isoCode) ? 'opacity-100' : 'opacity-0')} />
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {showCountryPicker && countries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {countries.map((isoCode) => {
            const entry = countriesList.find((c) => c.isoCode === isoCode)
            return (
              <span key={isoCode} className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold text-foreground">
                {entry?.name ?? isoCode}
              </span>
            )
          })}
        </div>
      )}

      {mode === SocietyAffiliationTerritoryMode.WORLDWIDE && (
        <p className="text-xs text-muted-foreground">Esta afiliación cubrirá tus derechos en todo el mundo.</p>
      )}
    </div>
  )
}
