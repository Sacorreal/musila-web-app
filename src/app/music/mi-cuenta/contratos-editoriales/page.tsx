'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Button } from '@/src/shared/components/UI/button'
import { BackButton } from '@/src/shared/components/UI/BackButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import { PublishingContractsList } from '@/src/domains/publishing-contracts/components/PublishingContractsList'
import { CreatePublishingContractDialog } from '@/src/domains/publishing-contracts/components/CreatePublishingContractDialog'
import { EditorialRelationshipsHistory } from '@/src/domains/editorial-relationships/components/EditorialRelationshipsHistory'
import { useMyEditorialRelationships } from '@/src/domains/editorial-relationships/hooks/editorial-relationships.hooks'

export default function ContratosEditorialesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const { data: relationships, isLoading, isError } = useMyEditorialRelationships()

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

      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="contracts">
          <PublishingContractsList />
        </TabsContent>
        <TabsContent value="history">
          <EditorialRelationshipsHistory
            items={relationships}
            isLoading={isLoading}
            isError={isError}
            perspective="author"
          />
        </TabsContent>
      </Tabs>

      <CreatePublishingContractDialog isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
