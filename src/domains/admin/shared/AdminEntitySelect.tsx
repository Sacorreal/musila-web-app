'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import { Button } from '@/src/shared/components/UI/button'
import { Badge } from '@/src/shared/components/UI/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/UI/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/shared/components/UI/command'
import { useDebouncedSearch } from './useDebouncedSearch'

export interface AdminEntityOption {
  value: string
  label: string
  description?: string
}

interface AdminEntitySelectBaseProps {
  fetchOptions: (query: string) => Promise<AdminEntityOption[]>
  selectedOptions?: AdminEntityOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
}

interface AdminEntitySelectSingleProps extends AdminEntitySelectBaseProps {
  multiple?: false
  value: string | null
  onChange: (value: string | null) => void
}

interface AdminEntitySelectMultiProps extends AdminEntitySelectBaseProps {
  multiple: true
  value: string[]
  onChange: (value: string[]) => void
}

type AdminEntitySelectProps = AdminEntitySelectSingleProps | AdminEntitySelectMultiProps

/** Combobox async paginado — busca en el backend en vez de cargar toda la colección en memoria. */
export function AdminEntitySelect(props: AdminEntitySelectProps) {
  const {
    fetchOptions,
    selectedOptions = [],
    placeholder = 'Buscar...',
    emptyMessage = 'Sin resultados',
    disabled,
  } = props

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedSearch(query, 300)
  const [options, setOptions] = useState<AdminEntityOption[]>(selectedOptions)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setIsLoading(true)
    fetchOptions(debouncedQuery)
      .then((result) => {
        if (!cancelled) setOptions(result)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, open])

  const knownOptions = [...selectedOptions, ...options].reduce<Record<string, AdminEntityOption>>(
    (acc, opt) => {
      acc[opt.value] = opt
      return acc
    },
    {},
  )

  const selectedValues = props.multiple ? props.value : props.value ? [props.value] : []

  const toggleValue = (optionValue: string) => {
    if (props.multiple) {
      const next = props.value.includes(optionValue)
        ? props.value.filter((v) => v !== optionValue)
        : [...props.value, optionValue]
      props.onChange(next)
    } else {
      props.onChange(props.value === optionValue ? null : optionValue)
      setOpen(false)
    }
  }

  const removeValue = (optionValue: string) => {
    if (props.multiple) {
      props.onChange(props.value.filter((v) => v !== optionValue))
    } else {
      props.onChange(null)
    }
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
          className="h-auto min-h-9 w-full justify-between px-3 py-2 font-normal"
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : props.multiple ? (
              selectedValues.map((v) => (
                <Badge key={v} variant="secondary" className="gap-1">
                  {knownOptions[v]?.label ?? v}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeValue(v)
                    }}
                    className="rounded-full outline-none hover:bg-muted-foreground/20"
                    aria-label="Quitar"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span>{knownOptions[selectedValues[0]]?.label ?? selectedValues[0]}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => toggleValue(option.value)}
                      >
                        <Check className={cn('h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
