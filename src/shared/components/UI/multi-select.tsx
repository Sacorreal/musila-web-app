'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/shared/components/UI/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/UI/popover'

export interface MultiSelectOption {
  value: string
  label: string
  group?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  maxSelected?: number
  placeholder?: string
  emptyText?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  maxSelected,
  placeholder = 'Selecciona opciones...',
  emptyText = 'Sin resultados.',
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const limitReached = maxSelected !== undefined && value.length >= maxSelected

  const selectedOptions = options.filter((o) => value.includes(o.value))

  const groups = React.useMemo(() => {
    const map = new Map<string, MultiSelectOption[]>()
    for (const option of options) {
      const key = option.group ?? ''
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(option)
    }
    return Array.from(map.entries())
  }, [options])

  const toggleValue = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      if (limitReached) return
      onChange([...value, optionValue])
    }
  }

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-auto min-h-9 w-full justify-between font-normal"
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5 py-0.5">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {option.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => removeValue(option.value, e)}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    aria-label={`Quitar ${option.label}`}
                  >
                    <X className="size-3" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {groups.map(([group, groupOptions]) => (
              <CommandGroup key={group || 'default'} heading={group || undefined}>
                {groupOptions.map((option) => {
                  const isSelected = value.includes(option.value)
                  const isDisabled = !isSelected && limitReached
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => toggleValue(option.value)}
                      disabled={isDisabled}
                      className={cn(isDisabled && 'opacity-40')}
                    >
                      <Check
                        className={cn('mr-2 size-4', isSelected ? 'opacity-100' : 'opacity-0')}
                      />
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
