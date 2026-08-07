'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { Button } from '@/src/shared/components/UI/button'
import { useMyPublishingContracts } from '../hooks/use-publishing-contracts.hooks'
import { CreatePublishingContractDialog } from './CreatePublishingContractDialog'
import { PublishingContractStatus } from '../types/publishing-contract.types'

interface Props {
  value?: string
  onChange: (contractId: string) => void
}

/**
 * Selector de contratos editoriales VIGENTES del usuario, con acceso directo
 * para crear uno nuevo sin salir del wizard del expediente — evita resubir
 * el mismo PDF cada vez que se registra un track cubierto por el mismo contrato.
 */
export function PublishingContractSelector({ value, onChange }: Props) {
  const { data: contracts, isLoading } = useMyPublishingContracts()
  const [showCreate, setShowCreate] = useState(false)

  const activeContracts = (contracts ?? []).filter((contract) => {
    const finalized =
      contract.status === PublishingContractStatus.FINALIZADO ||
      (!!contract.endDate && new Date(contract.endDate).getTime() < Date.now())
    return !finalized
  })

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoading ? 'Cargando contratos...' : 'Selecciona el contrato editorial'} />
        </SelectTrigger>
        <SelectContent>
          {activeContracts.length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">No tienes contratos vigentes</div>
          )}
          {activeContracts.map((contract) => (
            <SelectItem key={contract.id} value={contract.id}>
              {contract.publisherName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="outline" size="icon" aria-label="Crear contrato editorial" onClick={() => setShowCreate(true)}>
        <Plus className="h-4 w-4" />
      </Button>

      <CreatePublishingContractDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
