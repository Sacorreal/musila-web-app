'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/src/shared/libs/cn'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
}

/**
 * Selector buscable genérico, ensamblado sobre los primitivos `Command` +
 * `Popover` (cmdk + Radix). Reutilizable para cualquier catálogo con más de
 * un puñado de opciones (ej. sociedades de gestión colectiva, países).
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Sin resultados.',
  disabled = false,
  className,
  'aria-invalid': ariaInvalid,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', !selected && 'text-muted-foreground', className)}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('h-4 w-4', option.value === value ? 'opacity-100' : 'opacity-0')} />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
