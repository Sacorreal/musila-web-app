'use client'

import { useEffect, useState } from 'react'
import { Combobox } from '@/src/shared/components/UI/combobox'
import { useCollectiveManagementSocieties } from '../society-affiliations.hooks'

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  'aria-invalid'?: boolean
}

export function CollectiveManagementSocietyCombobox({ value, onChange, disabled, 'aria-invalid': ariaInvalid }: Props) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  const { data, isLoading, isFetching } = useCollectiveManagementSocieties(debouncedSearch || undefined)

  const options = (data?.data ?? []).map((society) => ({
    value: society.id,
    label: `${society.acronym} — ${society.officialName}`,
    description: society.country,
  }))

  return (
    <Combobox
      options={options}
      value={value || null}
      onChange={onChange}
      onSearchChange={setSearch}
      loading={isFetching}
      disabled={disabled || isLoading}
      placeholder={isLoading ? 'Cargando sociedades...' : 'Selecciona una sociedad...'}
      searchPlaceholder="Buscar por sigla o nombre..."
      emptyText="No se encontraron sociedades."
      aria-invalid={ariaInvalid}
    />
  )
}
