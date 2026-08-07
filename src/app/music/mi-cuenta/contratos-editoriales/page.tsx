'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Button } from '@/src/shared/components/UI/button'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { PublishingContractsList } from '@/src/domains/publishing-contracts/components/PublishingContractsList'
import { CreatePublishingContractDialog } from '@/src/domains/publishing-contracts/components/CreatePublishingContractDialog'

export default function ContratosEditorialesPage() {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <BackButton />

      <PageHeader
        title="Contratos Editoriales"
        description="Registra tus contratos de administración o cesión editorial una sola vez y reutilízalos en el expediente de cualquiera de tus obras."
        actions={
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Contrato
          </Button>
        }
      />

      <PublishingContractsList />

      <CreatePublishingContractDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
